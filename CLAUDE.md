# Shadow AI Assessment — CLAUDE.md

**Project:** Shadow AI Risk Assessment micro-tool
**Repo prefix:** (no RI prefix — sub-project of krystal-will-work-in-ai portfolio)
**Deployed at:** `shadowai.krystalmartinez.com`
**Related tool:** `governance.krystalmartinez.com`

## Stack

| Layer     | Choice                                                  |
| --------- | ------------------------------------------------------- |
| Framework | SvelteKit + Svelte 5 runes                              |
| Styling   | Tailwind 4 (`@tailwindcss/vite`, `@theme` in `app.css`) |
| PDF       | jsPDF 4.x (dynamic import — browser-only)               |
| State     | Svelte 5 `$state` class pattern                         |
| Tests     | Vitest + jsdom + `@testing-library/jest-dom`            |
| Deploy    | Vercel + `@sveltejs/adapter-vercel` (nodejs22.x)        |
| Data      | Client-side only — no server, no PII, no persistence    |

## Architecture

```
src/
  lib/
    types.ts           ← Interfaces: Question, ShadowAIResult, RiskLevel, ExposureEstimate
    scoring.ts         ← Pure functions: raw score, percentage, risk level, dollar-exposure
    data/
      questions.ts     ← 8 shadow AI questions (4 options each, scored 0–3)
    stores/
      assessment.svelte.ts  ← Svelte 5 $state class store
    components/
      ProgressBar.svelte
      QuestionCard.svelte
      Button.svelte
      ExposureScore.svelte
      DollarEstimate.svelte
      RiskBreakdown.svelte
      GovernanceCTA.svelte
    pdf/
      report.ts        ← 2–3 page Shadow AI Risk Brief (jsPDF)
  routes/
    +layout.svelte     ← Skip-link, header, footer (Privacy | Terms)
    +page.svelte       ← Landing page
    assess/
      +page.svelte     ← Assessment flow
    results/
      +page.svelte     ← Results dashboard
    privacy/
      +page.svelte     ← Privacy policy
    terms/
      +page.svelte     ← Terms of use
```

## Key Statistics (Stage 00 Research — IBM 2025)

All statistics used in this tool must come from confirmed sources. Approved stats:

| Stat                                                 | Value        | Source                                |
| ---------------------------------------------------- | ------------ | ------------------------------------- |
| Breach premium when shadow AI involved               | $670,000     | IBM 2025 Cost of a Data Breach Report |
| Orgs that experienced shadow AI breach               | 20% (1 in 5) | IBM 2025 Cost of a Data Breach Report |
| AI-breached orgs lacking AI access controls          | 97%          | IBM 2025 Cost of a Data Breach Report |
| Companies with technical controls to prevent uploads | 17%          | IBM 2025 Cost of a Data Breach Report |
| Employees using unapproved AI tools                  | 50%          | Software AG 2024 (via ISC2)           |

**Do NOT use:** "98% of orgs have shadow AI" (no citable source), "29% trained" (no citable source)

## Dollar Exposure Model

```typescript
const SHADOW_AI_BREACH_PREMIUM = 670_000; // IBM 2025
// Risk-tier probability ranges (editorial estimates — not actuarial):
// Critical (0–25%):   0.40–0.60
// High (26–50%):      0.25–0.40
// Moderate (51–75%):  0.10–0.25
// Low (76–100%):      0.02–0.10
// Display as range: probability_low * 670000 to probability_high * 670000
```

Required caveat (results page + PDF): "This estimate multiplies the IBM 2025 average shadow AI breach premium ($670,000) by a risk-tier probability range. The probability ranges are illustrative estimates — not actuarial calculations."

## Critical Constraints

- **No server-side code** — everything runs in the browser
- **No PII** — no data collected, no analytics, no cookies
- **WCAG 2.1 AA** — all UI stages must pass a11y audit gate
- **`aria-checked` is a string** — coerce to `"true"` or `"false"`, not boolean
- **jsPDF: dynamic import only** — `const { jsPDF } = await import('jspdf')` inside handlers
- **SvelteMap reactivity bug** — use `.set()` with new value reference; don't rely on in-place mutation
- **Governance CTA** — results page and PDF must link to `governance.krystalmartinez.com`

## D2R Plan Reference

- Source plan: `/home/krystal/repos/krystal-will-work-in-ai/05_Portfolio_Materials/plans/D2R_Shadow_AI_Lead_Magnet_Plan_2026-04-11_v01_I.md`
- Hardened plan (authoritative): `/home/krystal/.claude/plans/lexical-pondering-boole.md`
- Research summary: `docs/D2R_Stage00_Research_Summary_2026-04-11_v03_I.md`
