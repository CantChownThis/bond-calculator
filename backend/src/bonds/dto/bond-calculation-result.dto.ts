import { CashFlowEntry } from '../interfaces/cash-flow-entry.interface';

export type PriceIndicator = 'premium' | 'discount' | 'par';

export class BondCalculationResultDto {
  /** Annual coupon / market price × 100 */
  currentYield: number;

  /** Annualised return if held to maturity (Newton-Raphson result) */
  ytm: number;

  /** Coupon payment × total number of periods */
  totalInterestEarned: number;

  /** Whether the bond trades above, below, or at face value */
  priceIndicator: PriceIndicator;

  /** One entry per coupon period */
  cashFlowSchedule: CashFlowEntry[];
}
