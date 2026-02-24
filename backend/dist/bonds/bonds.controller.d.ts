import { BondsService } from './bonds.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondCalculationResultDto } from './dto/bond-calculation-result.dto';
export declare class BondsController {
    private readonly bondsService;
    constructor(bondsService: BondsService);
    calculate(dto: CalculateBondDto): BondCalculationResultDto;
}
