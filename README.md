# Bond Yield Calculator

A full-stack web application for calculating bond yields. Enter bond parameters and instantly get the Current Yield, Yield to Maturity (YTM), Total Interest Earned, and a full cash flow schedule for the life of the bond.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, DaisyUI |
| Backend | NestJS, TypeScript |
| HTTP Client | Axios |
| Validation | class-validator (backend) |

## Project Structure

```
bond-calculator/
├── frontend/       # React + Vite app (port 5173)
├── backend/        # NestJS API server (port 3000)
├── docs/           # Project documentation
└── package.json    # Root monorepo scripts
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd bond-calculator
```

### 2. Install all dependencies

From the root directory, install both frontend and backend dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## Running the Application

**Backend:**
```bash
cd backend
npm run start:dev
```
The API will be available at `http://localhost:3000`.

**Frontend:**
```bash
cd frontend
npm run dev
```
The app will be available at `http://localhost:5173`.

### Environment Variables (Frontend)

The frontend reads the backend URL from an environment variable. A `.env` file is included with the default value:

```
VITE_API_BASE_URL=http://localhost:3000
```

If you change the backend port, update this value accordingly.

---

## Usage

1. Open `http://localhost:5173` in your browser
2. Enter the bond parameters:
   - **Face Value** — the bond's par value (e.g. 1000)
   - **Coupon Rate** — annual interest rate as a percentage (e.g. 5)
   - **Market Price** — current purchase price of the bond (e.g. 950)
   - **Years to Maturity** — time until the bond matures, in 0.5-year increments (e.g. 10)
   - **Coupon Frequency** — annual or semi-annual payments
3. Click **Calculate**
4. View the results:
   - Current Yield, YTM, Total Interest Earned, and Price Indicator
   - Full cash flow schedule showing each coupon payment and cumulative interest

---

## API Reference

### `POST /bonds/calculate`

**Request body:**
```json
{
  "faceValue": 1000,
  "couponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "couponFrequency": "semi-annual"
}
```

**Response:**
```json
{
  "currentYield": 5.26,
  "ytm": 5.58,
  "totalInterestEarned": 500,
  "priceIndicator": "discount",
  "cashFlowSchedule": [
    {
      "period": 1,
      "paymentDate": "2025-09-01",
      "couponPayment": 25,
      "cumulativeInterest": 25,
      "remainingPrincipal": 1000
    }
  ]
}
```

`priceIndicator` values: `"premium"` (market > face), `"discount"` (market < face), `"par"` (market = face).
