export declare enum CouponFrequency {
    ANNUAL = "annual",
    SEMI_ANNUAL = "semi-annual"
}
export declare class CalculateBondDto {
    faceValue: number;
    couponRate: number;
    marketPrice: number;
    yearsToMaturity: number;
    couponFrequency: CouponFrequency;
}
