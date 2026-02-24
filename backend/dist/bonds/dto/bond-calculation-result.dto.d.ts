import { CashFlowEntry } from '../interfaces/cash-flow-entry.interface';
export type PriceIndicator = 'premium' | 'discount' | 'par';
export declare class BondCalculationResultDto {
    currentYield: number;
    ytm: number;
    totalInterestEarned: number;
    priceIndicator: PriceIndicator;
    cashFlowSchedule: CashFlowEntry[];
}
