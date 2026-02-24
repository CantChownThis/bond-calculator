import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondCalculationResultDto } from './dto/bond-calculation-result.dto';
export declare class BondsService {
    calculate(dto: CalculateBondDto): BondCalculationResultDto;
    private calculateCurrentYield;
    private calculateYTM;
    private presentValue;
    private presentValueDerivative;
    private calculateTotalInterest;
    private getPriceIndicator;
    private buildCashFlowSchedule;
    private round;
}
