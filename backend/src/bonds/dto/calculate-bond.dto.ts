import {
  IsNumber,
  IsPositive,
  IsEnum,
  Min,
  Max,
  IsInt,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/** yearsToMaturity must be a positive multiple of 0.5 (integer or half-integer) */
@ValidatorConstraint({ name: 'isHalfInteger', async: false })
class IsHalfIntegerConstraint implements ValidatorConstraintInterface {
  validate(value: number) {
    return value > 0 && value % 0.5 === 0;
  }
  defaultMessage() {
    return 'yearsToMaturity must be a positive integer or half-integer (0.5 step)';
  }
}

export enum CouponFrequency {
  ANNUAL = 'annual',
  SEMI_ANNUAL = 'semi-annual',
}

export class CalculateBondDto {
  /** Principal amount repaid at maturity — must be > 0 */
  @IsNumber()
  @IsPositive()
  faceValue: number;

  /** Annual coupon rate as a percentage of face value — 0–100 */
  @IsNumber()
  @Min(0)
  @Max(100)
  couponRate: number;

  /** Current market price of the bond — must be > 0 */
  @IsNumber()
  @IsPositive()
  marketPrice: number;

  /** Number of years until maturity — positive integer or half-integer */
  @IsNumber()
  @Validate(IsHalfIntegerConstraint)
  yearsToMaturity: number;

  /** Payment frequency per year */
  @IsEnum(CouponFrequency)
  couponFrequency: CouponFrequency;
}
