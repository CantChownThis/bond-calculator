import { Test, TestingModule } from '@nestjs/testing';
import { BondsService } from './bonds.service';
import { CouponFrequency } from './dto/calculate-bond.dto';

describe('BondsService', () => {
  let service: BondsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondsService],
    }).compile();

    service = module.get<BondsService>(BondsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('par bond (price = face value)', () => {
    const result = () =>
      service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      });

    it('returns priceIndicator = par', () => {
      expect(result().priceIndicator).toBe('par');
    });

    it('YTM equals coupon rate for a par bond', () => {
      expect(result().ytm).toBeCloseTo(5, 1);
    });

    it('currentYield equals coupon rate for a par bond', () => {
      expect(result().currentYield).toBe(5);
    });
  });

  describe('discount bond (price < face value)', () => {
    const result = () =>
      service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.SEMI_ANNUAL,
      });

    it('returns priceIndicator = discount', () => {
      expect(result().priceIndicator).toBe('discount');
    });

    it('YTM is greater than coupon rate for a discount bond', () => {
      expect(result().ytm).toBeGreaterThan(5);
    });

    it('currentYield is greater than coupon rate', () => {
      expect(result().currentYield).toBeGreaterThan(5);
    });

    it('cash flow schedule has correct number of periods', () => {
      expect(result().cashFlowSchedule).toHaveLength(20); // 10 years × 2
    });

    it('last period shows full face value as remaining principal', () => {
      const schedule = result().cashFlowSchedule;
      expect(schedule[schedule.length - 1].remainingPrincipal).toBe(1000);
    });
  });

  describe('premium bond (price > face value)', () => {
    const result = () =>
      service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1050,
        yearsToMaturity: 5,
        couponFrequency: CouponFrequency.ANNUAL,
      });

    it('returns priceIndicator = premium', () => {
      expect(result().priceIndicator).toBe('premium');
    });

    it('YTM is less than coupon rate for a premium bond', () => {
      expect(result().ytm).toBeLessThan(5);
    });
  });

  describe('zero-coupon bond (coupon rate = 0)', () => {
    const result = () =>
      service.calculate({
        faceValue: 1000,
        couponRate: 0,
        marketPrice: 600,
        yearsToMaturity: 5,
        couponFrequency: CouponFrequency.ANNUAL,
      });

    it('currentYield is 0', () => {
      expect(result().currentYield).toBe(0);
    });

    it('totalInterestEarned is 0', () => {
      expect(result().totalInterestEarned).toBe(0);
    });

    it('all coupon payments in schedule are 0', () => {
      result().cashFlowSchedule.forEach((row) => {
        expect(row.couponPayment).toBe(0);
      });
    });

    it('YTM is positive (implied by discount)', () => {
      expect(result().ytm).toBeGreaterThan(0);
    });
  });

  describe('semi-annual bond cash flow schedule', () => {
    it('produces correct number of periods', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 6,
        marketPrice: 980,
        yearsToMaturity: 3,
        couponFrequency: CouponFrequency.SEMI_ANNUAL,
      });
      expect(result.cashFlowSchedule).toHaveLength(6);
    });
  });

  describe('totalInterestEarned', () => {
    it('equals coupon per period × total periods', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      });
      // 10 years × $50/year = $500
      expect(result.totalInterestEarned).toBe(500);
    });
  });
});
