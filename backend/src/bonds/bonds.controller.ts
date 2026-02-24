import { Controller, Post, Body } from '@nestjs/common';
import { BondsService } from './bonds.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondCalculationResultDto } from './dto/bond-calculation-result.dto';

@Controller('bonds')
export class BondsController {
  constructor(private readonly bondsService: BondsService) {}

  /** POST /bonds/calculate — accepts bond parameters, returns all metrics and cash flow schedule */
  @Post('calculate')
  calculate(@Body() dto: CalculateBondDto): BondCalculationResultDto {
    return this.bondsService.calculate(dto);
  }
}
