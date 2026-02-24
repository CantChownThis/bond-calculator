# Bond Yield Calculator — Requirements

## 1. Functional Requirements

### 1.1 Inputs

All inputs are provided by the user via a single form.

| Field | Type | Validation |
|-------|------|------------|
| Face Value | number | > 0 |
| Annual Coupon Rate (%) | number | ≥ 0, ≤ 100 |
| Market Price | number | > 0 |
| Years to Maturity | number | > 0, integer or half-integer (0.5 step) |
| Coupon Frequency | enum | `annual` \| `semi-annual` |

### 1.2 Outputs — Summary Metrics

| Output | Description |
|--------|-------------|
| **Current Yield** | `(Annual Coupon Payment / Market Price) × 100` |
| **Yield to Maturity (YTM)** | Iterative solution (Newton-Raphson) for the discount rate that equates the present value of all cash flows to the market price |
| **Total Interest Earned** | `Coupon Payment × Total Number of Periods` |
| **Premium / Discount Indicator** | `"Trading at Premium"` if Market Price > Face Value, `"Trading at Discount"` if Market Price < Face Value, `"Trading at Par"` if equal |

### 1.3 Cash Flow Schedule

A table rendered in the UI showing one row per coupon period:

| Column | Description |
|--------|-------------|
| Period | Period number (1, 2, …, n) |
| Payment Date | Calculated from today + period × (12 / frequency) months |
| Coupon Payment | Fixed coupon amount per period |
| Cumulative Interest | Running total of coupon payments received |
| Remaining Principal | Face value (constant; returned at maturity) |

The final row must show face value repayment alongside the last coupon.

---

## 2. Non-Functional Requirements

### 2.1 Performance
- API response time < 200 ms for any valid input
- Frontend renders schedule table for up to 60 periods without noticeable lag

### 2.2 Accuracy
- YTM converges to within 0.0001% tolerance
- All monetary values rounded to 2 decimal places in the UI

### 2.3 Code Quality
- TypeScript strict mode enabled across frontend and backend
- Shared type definitions for API request/response (recommended: a `shared/` types package or duplicated DTO interfaces)
- NestJS calculation logic isolated in a dedicated `BondsService` — no business logic in controllers
- React components are small, single-responsibility, and props-typed

### 2.4 Maintainability
- Adding a new coupon frequency (e.g. quarterly, monthly) requires changes only to the frequency enum and the calculation service — zero UI restructuring
- All financial formulas documented with inline comments referencing the formula name

### 2.5 Error Handling
- API returns structured error responses (`{ message: string, field?: string }`) with appropriate HTTP status codes
- Frontend displays inline field validation errors before submitting
- API-level errors are surfaced to the user in a non-intrusive banner

---

## 3. API Contract

### `POST /bonds/calculate`

**Request Body**
```json
{
  "faceValue": 1000,
  "couponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "couponFrequency": "semi-annual"
}
```

**Response Body (200 OK)**
```json
{
  "currentYield": 5.26,
  "ytm": 5.58,
  "totalInterestEarned": 500.00,
  "priceIndicator": "discount",
  "cashFlowSchedule": [
    {
      "period": 1,
      "paymentDate": "2025-08-23",
      "couponPayment": 25.00,
      "cumulativeInterest": 25.00,
      "remainingPrincipal": 1000.00
    }
  ]
}
```

**Error Response (400 Bad Request)**
```json
{
  "statusCode": 400,
  "message": ["faceValue must be a positive number"],
  "error": "Bad Request"
}
```

---

## 4. Technology Constraints

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18+ |
| Frontend language | TypeScript | 5+ |
| Backend framework | NestJS | 10+ |
| Backend language | TypeScript | 5+ |
| HTTP client | Axios or Fetch API | — |
| Styling | Tailwind CSS with DaisyUI | — |
| Build tool | Vite (frontend), NestJS CLI (backend) | — |
