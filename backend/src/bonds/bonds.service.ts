import { Injectable } from '@nestjs/common';
import { CalculateBondDto, CouponFrequency } from './dto/calculate-bond.dto';
import {
  BondCalculationResultDto,
  PriceIndicator,
} from './dto/bond-calculation-result.dto';
import { CashFlowEntry } from './interfaces/cash-flow-entry.interface';

@Injectable()
export class BondsService {
  calculate(dto: CalculateBondDto): BondCalculationResultDto {
    const { faceValue, couponRate, marketPrice, yearsToMaturity, couponFrequency } = dto;

    const periodsPerYear = couponFrequency === CouponFrequency.SEMI_ANNUAL ? 2 : 1;
    const totalPeriods = yearsToMaturity * periodsPerYear;

    // Coupon payment per period
    const couponPayment = (couponRate / 100) * faceValue / periodsPerYear;

    return {
      currentYield: this.calculateCurrentYield(couponRate, faceValue, marketPrice),
      ytm: this.calculateYTM(faceValue, couponPayment, marketPrice, totalPeriods, periodsPerYear),
      totalInterestEarned: this.calculateTotalInterest(couponPayment, totalPeriods),
      priceIndicator: this.getPriceIndicator(marketPrice, faceValue),
      cashFlowSchedule: this.buildCashFlowSchedule(
        faceValue,
        couponPayment,
        totalPeriods,
        periodsPerYear,
      ),
    };
  }

  /**
   * Current Yield = (Annual Coupon Payment / Market Price) × 100
   */
  private calculateCurrentYield(
    couponRate: number,
    faceValue: number,
    marketPrice: number,
  ): number {
    const annualCoupon = (couponRate / 100) * faceValue;
    return this.round((annualCoupon / marketPrice) * 100);
  }

  /**
   * Yield to Maturity — Newton-Raphson iterative solution.
   *
   * Finds the periodic rate r such that:
   *   marketPrice = Σ [coupon / (1+r)^t] + faceValue / (1+r)^n
   *
   * Then annualises: ytm = r × periodsPerYear
   */
  private calculateYTM(
    faceValue: number,
    couponPayment: number,
    marketPrice: number,
    totalPeriods: number,
    periodsPerYear: number,
  ): number {
    const TOLERANCE = 1e-8;
    const MAX_ITERATIONS = 1000;

    // Initial guess: coupon rate / periodsPerYear
    let r = couponPayment / faceValue;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      // f(r) = present value of all cash flows − market price
      const pv = this.presentValue(couponPayment, faceValue, r, totalPeriods);
      const f = pv - marketPrice;

      // f'(r) = derivative of PV with respect to r
      const df = this.presentValueDerivative(couponPayment, faceValue, r, totalPeriods);

      const rNext = r - f / df;

      if (Math.abs(rNext - r) < TOLERANCE) {
        r = rNext;
        break;
      }
      r = rNext;
    }

    // Annualise the periodic rate
    return this.round(r * periodsPerYear * 100);
  }

  /** PV = Σ coupon/(1+r)^t + face/(1+r)^n */
  private presentValue(
    coupon: number,
    face: number,
    r: number,
    n: number,
  ): number {
    let pv = 0;
    for (let t = 1; t <= n; t++) {
      pv += coupon / Math.pow(1 + r, t);
    }
    pv += face / Math.pow(1 + r, n);
    return pv;
  }

  /** d(PV)/dr = Σ -t·coupon/(1+r)^(t+1) + -n·face/(1+r)^(n+1) */
  private presentValueDerivative(
    coupon: number,
    face: number,
    r: number,
    n: number,
  ): number {
    let dpv = 0;
    for (let t = 1; t <= n; t++) {
      dpv -= (t * coupon) / Math.pow(1 + r, t + 1);
    }
    dpv -= (n * face) / Math.pow(1 + r, n + 1);
    return dpv;
  }

  /**
   * Total Interest Earned = Coupon Payment × Total Number of Periods
   */
  private calculateTotalInterest(couponPayment: number, totalPeriods: number): number {
    return this.round(couponPayment * totalPeriods);
  }

  /**
   * Price Indicator: premium if price > face, discount if price < face, par if equal
   */
  private getPriceIndicator(marketPrice: number, faceValue: number): PriceIndicator {
    if (marketPrice > faceValue) return 'premium';
    if (marketPrice < faceValue) return 'discount';
    return 'par';
  }

  /**
   * Cash Flow Schedule — one row per coupon period.
   * The final row includes face value repayment.
   * Payment date = today + period × (12 / periodsPerYear) months.
   */
  private buildCashFlowSchedule(
    faceValue: number,
    couponPayment: number,
    totalPeriods: number,
    periodsPerYear: number,
  ): CashFlowEntry[] {
    const today = new Date();
    const monthsPerPeriod = 12 / periodsPerYear;
    const schedule: CashFlowEntry[] = [];
    let cumulativeInterest = 0;

    for (let period = 1; period <= totalPeriods; period++) {
      cumulativeInterest += couponPayment;

      const paymentDate = new Date(today);
      paymentDate.setMonth(paymentDate.getMonth() + period * monthsPerPeriod);

      schedule.push({
        period,
        paymentDate: paymentDate.toISOString().split('T')[0],
        couponPayment: this.round(couponPayment),
        cumulativeInterest: this.round(cumulativeInterest),
        // Principal is constant throughout; the face value is returned at maturity
        remainingPrincipal: this.round(faceValue),
      });
    }

    return schedule;
  }

  /** Round to 2 decimal places */
  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
