import type { CouponFrequency } from '../../types/bond.types';

export interface FormValues {
  faceValue: string;
  couponRate: string;
  marketPrice: string;
  yearsToMaturity: string;
  couponFrequency: CouponFrequency;
}

export interface FormErrors {
  faceValue?: string;
  couponRate?: string;
  marketPrice?: string;
  yearsToMaturity?: string;
  couponFrequency?: string;
}
