# Deal Analyzer

A wholesale real-estate deal analyzer built for Deva Gana LLC — doubling as a live
underwriting tool and a portfolio piece.

Enter a property's ARV, list price, square footage, and repair tier, and every number
recomputes on each keystroke: MAO, opening offer, EMD, the full negotiation ladder,
and a DEAL/PASS verdict with a visual waterfall breakdown of how the MAO is built.

## Stack

- Vite + React + TypeScript (strict)
- Tailwind CSS v4
- Recharts for the MAO waterfall visualization
- Fully client-side, no backend — deployed as a static build on GitHub Pages

## Formulas

- `MAO = round(ARV x 0.70 - repairs - $10,000)` (the $10K assignment fee is baked in)
- `Opening offer = round(MAO x 0.90)` to the nearest $100
- `EMD = 1% of opening offer`
- Negotiation ladder: R1 = opening + gap/3, R2 = opening + 2·gap/3, R3 = MAO
- Repair tiers: Light $25/sqft, Medium $45/sqft, Heavy $75/sqft (or a custom amount)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
