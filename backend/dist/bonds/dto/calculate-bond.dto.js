"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateBondDto = exports.CouponFrequency = void 0;
const class_validator_1 = require("class-validator");
let IsHalfIntegerConstraint = class IsHalfIntegerConstraint {
    validate(value) {
        return value > 0 && value % 0.5 === 0;
    }
    defaultMessage() {
        return 'yearsToMaturity must be a positive integer or half-integer (0.5 step)';
    }
};
IsHalfIntegerConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isHalfInteger', async: false })
], IsHalfIntegerConstraint);
var CouponFrequency;
(function (CouponFrequency) {
    CouponFrequency["ANNUAL"] = "annual";
    CouponFrequency["SEMI_ANNUAL"] = "semi-annual";
})(CouponFrequency || (exports.CouponFrequency = CouponFrequency = {}));
class CalculateBondDto {
    faceValue;
    couponRate;
    marketPrice;
    yearsToMaturity;
    couponFrequency;
}
exports.CalculateBondDto = CalculateBondDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CalculateBondDto.prototype, "faceValue", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CalculateBondDto.prototype, "couponRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CalculateBondDto.prototype, "marketPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Validate)(IsHalfIntegerConstraint),
    __metadata("design:type", Number)
], CalculateBondDto.prototype, "yearsToMaturity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CouponFrequency),
    __metadata("design:type", String)
], CalculateBondDto.prototype, "couponFrequency", void 0);
//# sourceMappingURL=calculate-bond.dto.js.map