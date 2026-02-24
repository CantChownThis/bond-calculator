# Bond Yield Calculator — Project Goals

## Primary Goal

Build a full-stack web application that allows users to calculate key bond metrics — including Current Yield, Yield to Maturity (YTM), and a full cash flow schedule — given a set of bond parameters.

## Business Objectives

- Provide investors, students, and financial analysts with a fast, accurate bond analysis tool
- Deliver a clear, interactive cash flow schedule so users understand the full lifecycle of a bond
- Demonstrate a production-quality, maintainable TypeScript codebase across both frontend and backend

## Technical Objectives

- Implement all financial calculations server-side (NestJS) to keep business logic centralised and testable
- Expose a clean REST API so the frontend (React) remains a pure presentation layer
- Structure the codebase so that new bond types or calculation methods can be added quickly during live review / iteration
- Achieve clear separation of concerns: input validation → calculation service → API response → UI rendering

## Success Criteria

| Criterion | Target |
|-----------|--------|
| All five inputs accepted and validated | ✅ Required |
| Current Yield displayed correctly | ✅ Required |
| YTM calculated via iterative Newton-Raphson method | ✅ Required |
| Total interest earned displayed | ✅ Required |
| Premium / discount indicator shown | ✅ Required |
| Full cash flow schedule rendered as table | ✅ Required |
| API returns structured, typed responses | ✅ Required |
| Frontend handles edge cases gracefully (e.g. zero coupon, par bond) | ✅ Required |

## Out of Scope (v1)

- User authentication / saved calculations
- Multiple bonds comparison view
- Chart / graph visualisations of cash flows
- CSV/PDF export
- Database persistence
