# Bond Yield Calculator — Sitemap & Project Structure

## 1. Application Sitemap

This is a single-page application (SPA). There is one route:

```
/           →  Calculator page (input form + results + cash flow table)
```

No routing library is required for v1. The single page manages UI state (idle → loading → results / error) internally.

---

## 2. Monorepo Structure

```
bond-yield-calculator/
├── README.md
├── package.json                  # Root — workspace scripts only
│
├── frontend/                     # React + TypeScript (Vite)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # Root component, layout
│       ├── api/
│       │   └── bondsApi.ts       # Axios/Fetch wrapper for POST /bonds/calculate
│       ├── components/
│       │   ├── BondForm/
│       │   │   ├── BondForm.tsx          # Controlled form with validation
│       │   │   └── BondForm.types.ts     # FormValues interface
│       │   ├── ResultsSummary/
│       │   │   ├── ResultsSummary.tsx    # 4-card metric grid
│       │   │   └── MetricCard.tsx        # Individual card component
│       │   └── CashFlowTable/
│       │       └── CashFlowTable.tsx     # Scrollable period table
│       ├── types/
│       │   └── bond.types.ts     # Shared request/response interfaces (mirrors backend DTOs)
│       └── utils/
│           └── formatters.ts     # Currency, percentage, date formatters
│
└── backend/                      # NestJS + TypeScript
    ├── tsconfig.json
    ├── package.json
    └── src/
        ├── main.ts               # NestJS bootstrap, CORS config
        ├── app.module.ts         # Root module
        └── bonds/
            ├── bonds.module.ts
            ├── bonds.controller.ts       # POST /bonds/calculate
            ├── bonds.controller.spec.ts
            ├── bonds.service.ts          # All financial calculations
            ├── bonds.service.spec.ts
            ├── dto/
            │   ├── calculate-bond.dto.ts         # Request DTO with class-validator decorators
            │   └── bond-calculation-result.dto.ts # Response DTO
            └── interfaces/
                └── cash-flow-entry.interface.ts  # CashFlowEntry type
```

---

## 3. Key Module Responsibilities

### Frontend

| File | Responsibility |
|------|---------------|
| `BondForm.tsx` | Renders inputs, manages local form state, runs client-side validation before API call |
| `bondsApi.ts` | Single function `calculateBond(input)` — POST to backend, returns typed result |
| `ResultsSummary.tsx` | Receives calculation result as props, renders metric cards |
| `CashFlowTable.tsx` | Renders paginated/scrollable table from `cashFlowSchedule[]` |
| `bond.types.ts` | `CalculateBondRequest` and `CalculateBondResponse` interfaces — source of truth for frontend typing |
| `formatters.ts` | `formatCurrency()`, `formatPercent()`, `formatDate()` utilities |

### Backend

| File | Responsibility |
|------|---------------|
| `bonds.controller.ts` | Accepts POST request, delegates to service, returns response — no logic here |
| `bonds.service.ts` | `calculate()` orchestrates: validates business rules → computes metrics → builds schedule |
| `calculate-bond.dto.ts` | Input validation via `class-validator` (`@IsPositive`, `@IsEnum`, etc.) |
| `bonds.service.spec.ts` | Unit tests covering: par bond, premium bond, discount bond, zero-coupon, semi-annual |

---

## 4. Data Flow

```
User fills form
      │
      ▼
BondForm (client validation)
      │  POST /bonds/calculate
      ▼
bonds.controller.ts  →  ValidationPipe (DTO)
      │
      ▼
bonds.service.ts
  ├── calculateCurrentYield()
  ├── calculateYTM()           ← Newton-Raphson iteration
  ├── calculateTotalInterest()
  ├── getPriceIndicator()
  └── buildCashFlowSchedule()
      │
      ▼
BondCalculationResultDto  →  JSON response
      │
      ▼
ResultsSummary + CashFlowTable (render)
```

---

## 5. API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/bonds/calculate` | Accepts bond parameters, returns all metrics and cash flow schedule |

No other endpoints are required for v1.

---

## 6. Environment Configuration

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:3000
```

### Backend
NestJS defaults to port `3000`. CORS is enabled for `http://localhost:5173` (Vite default) in development.

---

## 7. Development Scripts

| Command | Description |
|---------|-------------|
| `cd backend && npm run start:dev` | Start NestJS in watch mode |
| `cd frontend && npm run dev` | Start Vite dev server |
| `cd backend && npm run test` | Run backend unit tests |
| `cd backend && npm run test:cov` | Run with coverage report |
