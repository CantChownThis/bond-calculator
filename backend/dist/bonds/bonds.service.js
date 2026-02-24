"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondsService = void 0;
const common_1 = require("@nestjs/common");
const calculate_bond_dto_1 = require("./dto/calculate-bond.dto");
let BondsService = class BondsService {
    calculate(dto) {
        const { faceValue, couponRate, marketPrice, yearsToMaturity, couponFrequency } = dto;
        const periodsPerYear = couponFrequency === calculate_bond_dto_1.CouponFrequency.SEMI_ANNUAL ? 2 : 1;
        const totalPeriods = yearsToMaturity * periodsPerYear;
        const couponPayment = (couponRate / 100) * faceValue / periodsPerYear;
        return {
            currentYield: this.calculateCurrentYield(couponRate, faceValue, marketPrice),
            ytm: this.calculateYTM(faceValue, couponPayment, marketPrice, totalPeriods, periodsPerYear),
            totalInterestEarned: this.calculateTotalInterest(couponPayment, totalPeriods),
            priceIndicator: this.getPriceIndicator(marketPrice, faceValue),
            cashFlowSchedule: this.buildCashFlowSchedule(faceValue, couponPayment, totalPeriods, periodsPerYear),
        };
    }
    calculateCurrentYield(couponRate, faceValue, marketPrice) {
        const annualCoupon = (couponRate / 100) * faceValue;
        return this.round((annualCoupon / marketPrice) * 100);
    }
    calculateYTM(faceValue, couponPayment, marketPrice, totalPeriods, periodsPerYear) {
        const TOLERANCE = 1e-8;
        const MAX_ITERATIONS = 1000;
        let r = couponPayment / faceValue;
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            const pv = this.presentValue(couponPayment, faceValue, r, totalPeriods);
            const f = pv - marketPrice;
            const df = this.presentValueDerivative(couponPayment, faceValue, r, totalPeriods);
            const rNext = r - f / df;
            if (Math.abs(rNext - r) < TOLERANCE) {
                r = rNext;
                break;
            }
            r = rNext;
        }
        return this.round(r * periodsPerYear * 100);
    }
    presentValue(coupon, face, r, n) {
        let pv = 0;
        for (let t = 1; t <= n; t++) {
            pv += coupon / Math.pow(1 + r, t);
        }
        pv += face / Math.pow(1 + r, n);
        return pv;
    }
    presentValueDerivative(coupon, face, r, n) {
        let dpv = 0;
        for (let t = 1; t <= n; t++) {
            dpv -= (t * coupon) / Math.pow(1 + r, t + 1);
        }
        dpv -= (n * face) / Math.pow(1 + r, n + 1);
        return dpv;
    }
    calculateTotalInterest(couponPayment, totalPeriods) {
        return this.round(couponPayment * totalPeriods);
    }
    getPriceIndicator(marketPrice, faceValue) {
        if (marketPrice > faceValue)
            return 'premium';
        if (marketPrice < faceValue)
            return 'discount';
        return 'par';
    }
    buildCashFlowSchedule(faceValue, couponPayment, totalPeriods, periodsPerYear) {
        const today = new Date();
        const monthsPerPeriod = 12 / periodsPerYear;
        const schedule = [];
        let cumulativeInterest = 0;
        for (let period = 1; period <= totalPeriods; period++) {
            cumulativeInterest += couponPayment;
            const paymentDate = new Date(today);
            paymentDate.setMonth(paymentDate.getMonth() + period * monthsPerPeriod);
            schedule.push({
                period,
                paymentDate: paymentDate.toISOString().split('T')[0],
                couponPayment: this.round(couponPayment),
                cumulativeInterest: this.round(cumulativeInterest),
                remainingPrincipal: this.round(faceValue),
            });
        }
        return schedule;
    }
    round(value) {
        return Math.round(value * 100) / 100;
    }
};
exports.BondsService = BondsService;
exports.BondsService = BondsService = __decorate([
    (0, common_1.Injectable)()
], BondsService);
//# sourceMappingURL=bonds.service.js.map