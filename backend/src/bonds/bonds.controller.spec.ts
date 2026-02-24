import { Test, TestingModule } from '@nestjs/testing';
import { BondsController } from './bonds.controller';
import { BondsService } from './bonds.service';
import { CouponFrequency } from './dto/calculate-bond.dto';
import { BondCalculationResultDto } from './dto/bond-calculation-result.dto';

describe('BondsController', () => {
  let controller: BondsController;
  let service: BondsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BondsController],
      providers: [BondsService],
    }).compile();

    controller = module.get<BondsController>(BondsController);
    service = module.get<BondsService>(BondsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates to BondsService.calculate and returns the result', () => {
    const mockResult: BondCalculationResultDto = {
      currentYield: 5.26,
      ytm: 5.58,
      totalInterestEarned: 500,
      priceIndicator: 'discount',
      cashFlowSchedule: [],
    };

    jest.spyOn(service, 'calculate').mockReturnValue(mockResult);

    const dto = {
      faceValue: 1000,
      couponRate: 5,
      marketPrice: 950,
      yearsToMaturity: 10,
      couponFrequency: CouponFrequency.SEMI_ANNUAL,
    };

    const result = controller.calculate(dto);

    expect(service.calculate).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });
});
