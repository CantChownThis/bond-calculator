# Bond Yield Calculator — Content Strategy

## Overview

This document defines what content lives on each screen, what language/tone is used, and how information is structured to support both first-time users and experienced analysts.

---

## Tone & Voice

- **Precise but accessible.** Financial terms (YTM, coupon, face value) are used correctly but accompanied by short tooltips or labels that clarify meaning for less experienced users.
- **Action-oriented.** Labels instruct: "Enter face value", "Calculate", "View schedule".
- **Neutral and factual.** No marketing language. Results are presented as numbers with clear labels.

---

## Page Content Breakdown

### Page 1 — Calculator (Main / Only Page)

The single-page app is divided into three visual sections:

#### Section A — Input Form

| Element | Content |
|---------|---------|
| Page title | `Bond Yield Calculator` |
| Subtitle | `Enter bond details to calculate yield metrics and view the full cash flow schedule.` |
| Field: Face Value | Label: `Face Value ($)` · Placeholder: `e.g. 1000` · Helper: `The principal amount repaid at maturity` |
| Field: Annual Coupon Rate | Label: `Annual Coupon Rate (%)` · Placeholder: `e.g. 5` · Helper: `Annual interest rate as a percentage of face value` |
| Field: Market Price | Label: `Market Price ($)` · Placeholder: `e.g. 950` · Helper: `The current price you would pay for the bond` |
| Field: Years to Maturity | Label: `Years to Maturity` · Placeholder: `e.g. 10` · Helper: `Number of years until the bond matures` |
| Field: Coupon Frequency | Label: `Coupon Frequency` · Options: `Annual`, `Semi-Annual` |
| CTA button | `Calculate` |
| Validation errors | Inline, below each field, in red. E.g. `"Face value must be greater than 0"` |

#### Section B — Results Summary

Displayed immediately below the form after a successful calculation. Uses a card/grid layout.

| Card | Label | Example Value |
|------|-------|---------------|
| 1 | Current Yield | `5.26%` |
| 2 | Yield to Maturity (YTM) | `5.58%` |
| 3 | Total Interest Earned | `$500.00` |
| 4 | Price Indicator | `Trading at a Discount 🔴` / `Trading at a Premium 🟢` / `Trading at Par ⚪` |

Each card includes a one-line description below the value, e.g.:
- Current Yield: *"Annual coupon as a percentage of market price"*
- YTM: *"Annualised return if held to maturity"*
- Total Interest: *"Sum of all coupon payments over the bond's life"*
- Price Indicator: *"Bond is priced below / above / at face value"*

#### Section C — Cash Flow Schedule

A scrollable table rendered below the results summary.

**Table heading:** `Cash Flow Schedule`

**Column headers:**

| Period | Payment Date | Coupon Payment | Cumulative Interest | Remaining Principal |
|--------|-------------|----------------|---------------------|---------------------|

- Last row is visually differentiated (bold or highlighted) to indicate principal repayment
- Monetary values formatted as `$1,000.00`
- Dates formatted as `DD MMM YYYY` (e.g. `23 Aug 2025`)

---

## Empty & Error States

| State | Message |
|-------|---------|
| Initial load (no calculation yet) | Results section is hidden; no placeholder needed |
| API error | Banner: `"Something went wrong. Please check your inputs and try again."` |
| Zero-coupon bond (rate = 0%) | Results shown normally; cash flow table shows $0.00 coupon per period with face value at maturity |
| Bond at par (price = face value) | Price indicator shows `"Trading at Par"` |

---

## Terminology Glossary (for tooltip / help copy)

| Term | Plain-English Definition |
|------|--------------------------|
| Face Value | The amount the bond issuer will repay at maturity, also called par value |
| Coupon Rate | The annual interest rate the bond pays, expressed as a percentage of face value |
| Market Price | What the bond costs to buy today on the open market |
| Current Yield | Annual income ÷ current price — a simple snapshot of return |
| YTM | The total annualised return if you hold the bond to maturity and reinvest coupons at the same rate |
| Premium | Bond priced above face value — implies lower YTM than coupon rate |
| Discount | Bond priced below face value — implies higher YTM than coupon rate |

---

## Accessibility & Internationalisation

- All form fields have associated `<label>` elements (screen reader support)
- Colour-coded indicators (red/green) are always paired with text labels
- Numbers use locale-aware formatting (`Intl.NumberFormat`) — default locale `en-US`
- Date formatting via `Intl.DateTimeFormat` — default locale `en-GB` (`DD MMM YYYY`)
