export type CouponFrequency = 'annual' | 'semi-annual';

export type PriceIndicator = 'premium' | 'discount' | 'par';

export interface CalculateBondRequest {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: CouponFrequency;
}

export interface CashFlowEntry {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface CalculateBondResponse {
  currentYield: number;
  ytm: number;
  totalInterestEarned: number;
  priceIndicator: PriceIndicator;
  cashFlowSchedule: CashFlowEntry[];
}
