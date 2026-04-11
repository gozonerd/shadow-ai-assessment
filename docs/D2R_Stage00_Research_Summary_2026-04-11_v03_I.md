# D2R Stage 00: Research Summary
**Project:** Shadow AI Lead Magnet — `shadowai.krystalmartinez.com`
**Date:** 2026-04-11
**Research model:** Sonnet 4.6
**Plan version:** lexical-pondering-boole.md (hardened plan)

---

## Target 1: Shadow AI Statistics (DRAFT VALUES CORRECTED)

- **Best practice:** All three draft statistics from the source plan required correction. The $670K figure is confirmed but was cited to the wrong report year. The 98% and 29% figures have no citable sources and must be replaced.

- **Corrected statistics with authoritative sources:**

  | Stat | Confirmed Value | Source | Notes |
  |------|----------------|--------|-------|
  | Additional breach cost when shadow AI involved | **$670,000** | IBM 2025 Cost of a Data Breach Report (published July 30, 2025) | Was correctly stated in source plan but cited to "IBM 2024" — correct citation is IBM 2025 |
  | Orgs that experienced a breach caused by shadow AI | **20%** (1 in 5) | IBM 2025 Cost of a Data Breach Report | Replaces uncitable "98% of orgs have shadow AI" |
  | AI-breached orgs lacking proper AI access controls | **97%** | IBM 2025 Cost of a Data Breach Report (IBM newsroom, July 30, 2025) | Strong supporting stat for urgency framing |
  | Orgs lacking AI governance policies (among breached) | **63%** | IBM 2025 Cost of a Data Breach Report | Useful for policy question framing |
  | Companies with technical controls to prevent confidential data uploads to AI tools | **17%** | IBM 2025 Cost of a Data Breach Report | Replaces uncitable "29% trained" |
  | Employees using unapproved AI tools | **50%** | Software AG research (2024), cited in ISC2 community | Replaces uncitable "98% of orgs have shadow AI" as a human-behavior stat |

  **Stats that had NO citable source and must be REMOVED from the plan:**
  - "98% of organizations have shadow AI" — does not appear in IBM, Gartner, or SANS
  - "29% trained on AI data handling" — does not appear in any major source
  - "38% of employees share confidential data with AI without approval" — attributed to "CybSafe/NCA research (late 2024)" but no verifiable URL could be confirmed. Do NOT use in the tool unless primary source is found and cited.

- **Sources:**
  - IBM 2025 Cost of a Data Breach Report: https://www.ibm.com/reports/data-breach
  - IBM newsroom (July 30, 2025): https://newsroom.ibm.com/2025-07-30-ibm-report-13-of-organizations-reported-breaches-of-ai-models-or-applications,-97-of-which-reported-lacking-proper-ai-access-controls
  - Kiteworks IBM 2025 summary: https://www.kiteworks.com/cybersecurity-risk-management/ibm-2025-data-breach-report-ai-risks/
  - NudgeSecurity shadow AI in IBM 2025: https://www.nudgesecurity.com/post/shadow-ai-the-emerging-security-threat-in-ibms-2025-cost-of-a-data-breach-report
  - ISC2 community (50% stat): https://community.isc2.org/t5/Industry-News/Shadow-AI-on-the-Rise-50-of-Employees-Using-Unapproved-AI-Tools/td-p/79019

- **Applies to:** Stages 02, 04, 06, 07 — all stats-facing content

- **Pitfalls:**
  - Do NOT cite $670K to "IBM Cost of Data Breach 2024" — it is the 2025 report
  - Do NOT use 98% or 29% — they have no citable source and will fail a content accuracy stress test
  - All stats strips, question help text, PDF findings, and dollar-exposure methodology must use these confirmed values

---

## Target 2: Tailwind CSS v4 — `@tailwindcss/vite` Plugin

- **Best practice:** `@tailwindcss/vite` plugin is the correct and current method for Tailwind v4 in Vite. The `@theme {}` block in `app.css` is the correct way to define design tokens and CSS custom properties. No `tailwind.config.js` exists in v4.

- **Confirmed config pattern:**
  ```js
  // vite.config.ts
  import tailwindcss from '@tailwindcss/vite';
  export default defineConfig({ plugins: [tailwindcss()] });
  ```
  ```css
  /* app.css */
  @import "tailwindcss";
  @theme {
    --color-primary: #your-value;
    --color-accent: #your-value;
  }
  ```

- **Current version:** `@tailwindcss/vite` 4.2.2 (as of approximately March 2026)

- **Sources:**
  - Tailwind v4 release blog: https://tailwindcss.com/blog/tailwindcss-v4
  - Tailwind v4 theme variables docs: https://tailwindcss.com/docs/theme
  - npm: https://www.npmjs.com/package/@tailwindcss/vite

- **Applies to:** Stage 01 (scaffold), Stage 04–08 (all UI)

- **Pitfalls:**
  - Variables defined in `:root {}` (outside `@theme {}`) will NOT generate utility classes
  - No `@tailwind base/components/utilities` directives in v4 — the single `@import "tailwindcss"` replaces all three
  - No `postcss.config.js` needed — the Vite plugin handles all of it
  - Do not reference any v3 config patterns

---

## Target 3: jsPDF — Dynamic Import for SSR Safety

- **Best practice:** The dynamic import pattern `const { jsPDF } = await import('jspdf')` is confirmed as the correct SSR-safe pattern for SvelteKit. Must be inside a browser-only context (button handler, `onMount`, never at module top level).

- **Current version:** `jspdf` 4.2.1 (major version bump from earlier 2.x series; v4.0.0 released January 2026)

- **v4.0.0 breaking changes:**
  - Dropped Internet Explorer support
  - Fixed CVE-2025-68428 (critical path traversal vulnerability in Node.js build)
  - Filesystem access in Node.js builds restricted by default — requires `--permission` flag or `jsPDF.allowFsRead`
  - **No API breaking changes for browser usage via dynamic import**

- **Sources:**
  - npm: https://www.npmjs.com/package/jspdf
  - GitHub releases: https://github.com/parallax/jsPDF/releases
  - CVE-2025-68428: https://github.com/advisories/GHSA-f8cm-6447-x5h2

- **Applies to:** Stage 07 (PDF report)

- **Pitfalls:**
  - This tool uses browser-only jsPDF via dynamic import — the Node.js filesystem restriction in v4.0.0 does not affect it
  - Pin to `>=4.0.0` in `package.json` to ensure CVE-2025-68428 is patched
  - Never import jsPDF at module top level in a SvelteKit file — always use dynamic import inside a function/handler

---

## Target 4: WCAG 2.1 AA — Radio Group and Progress Bar ARIA Patterns

- **Best practice:** W3C WAI-ARIA Authoring Practices Guide confirms the following patterns for WCAG 2.1 AA compliance:

  **Radio group (question card):**
  ```html
  <div role="radiogroup" aria-labelledby="group-label-id">
    <span id="group-label-id">Question text here</span>
    <div role="radio" aria-checked="false" tabindex="-1">Option A</div>
    <div role="radio" aria-checked="true" tabindex="0">Option B (selected)</div>
    <div role="radio" aria-checked="false" tabindex="-1">Option C</div>
  </div>
  ```
  - Roving tabindex: only the selected/focused radio gets `tabindex="0"`, all others `tabindex="-1"`
  - `aria-checked` must be string `"true"` or `"false"` (not boolean)

  **Progress bar:**
  ```html
  <div role="progressbar"
       aria-valuenow="3"
       aria-valuemin="1"
       aria-valuemax="8"
       aria-label="Question 3 of 8">
  </div>
  ```

  **Live region for dynamic updates:**
  ```html
  <div aria-live="polite" aria-atomic="true">Dynamic content here</div>
  ```

- **Sources:**
  - WAI-ARIA APG Radio Group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
  - MDN radiogroup role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/radiogroup_role
  - WCAG 2.1 Technique ARIA17: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA17.html

- **Applies to:** Stages 04, 05, 06, 08

- **Pitfalls:**
  - `aria-checked` must be string `"true"`/`"false"` — Svelte's `aria-checked={boolean}` will output the boolean directly; coerce to string or use `aria-checked={selected ? "true" : "false"}`
  - All interactive elements need visible focus ring (`focus-visible:ring-2` in Tailwind)
  - Touch targets must be ≥44×44px
  - For indeterminate progress, omit `aria-valuenow` rather than setting to 0
  - Color alone must not convey risk levels — always pair with text labels

---

## Target 5: `@sveltejs/adapter-vercel` — Version and Runtime Config

- **Best practice:** Adapter-vercel is at v6.3.3 and supports Node.js 20, 22, and 24. `nodejs22.x` is recommended (active LTS). The governance tool uses `nodejs20.x` — this remains valid; upgrade to 22.x is optional for new project.

- **Recommended config for new project:**
  ```js
  import adapter from '@sveltejs/adapter-vercel';
  export default {
    kit: {
      adapter: adapter({ runtime: 'nodejs22.x' })
    }
  };
  ```

- **Current version:** `@sveltejs/adapter-vercel` 6.3.3

- **Sources:**
  - SvelteKit adapter-vercel docs: https://svelte.dev/docs/kit/adapter-vercel
  - npm: https://www.npmjs.com/package/@sveltejs/adapter-vercel

- **Applies to:** Stage 01 (scaffold), Stage 09 (deploy)

- **Pitfalls:**
  - `@sveltejs/adapter-auto` may pull in an older adapter-vercel version without Node 22 support — install `@sveltejs/adapter-vercel` explicitly (not via adapter-auto)
  - Do not use `nodejs18.x` — no longer listed as supported
  - `nodejs20.x` LTS ends April 2026 — prefer `nodejs22.x` for a new project

---

## Target 6: Competitor Shadow AI Assessment Tools

- **Best practice (differentiation):**

  | Tool | Format | Dollar Estimate | PDF | Notes |
  |------|--------|-----------------|-----|-------|
  | GXA Shadow AI Risk Simulator | ~5-question calculator | Yes (IBM-sourced) | Not confirmed | Closest competitor — marketing lead gen |
  | shadowaiaudit.com (Make More Marbles) | 3-minute quiz | Not confirmed | Not confirmed | Outputs governance policy template, not risk dollars |
  | RiskImmune | Automated tool scan | No — discovery tool | No | Not a quiz; detects actual tools in use |
  | Auvik Shadow IT Quiz | Quiz in gated ebook | No | No — gated | Gated content, limited reach |

  **Genuine market gap confirmed:** No identified tool combines (1) short quiz + (2) dollar-denominated risk output + (3) downloadable personalized PDF in a single ungated flow.

- **Sources:**
  - GXA: https://www.gxait.com/resources/shadow-ai-simulator
  - shadowaiaudit.com: https://shadowaiaudit.com/
  - RiskImmune: https://riskimmune.ai/blog/assess-cyber-risk-boards-2025-26e41a
  - Reco 2025 State of Shadow AI Report: https://www.reco.ai/state-of-shadow-ai-report
  - ISACA: https://www.isaca.org/resources/news-and-trends/industry-news/2025/the-rise-of-shadow-ai-auditing-unauthorized-ai-tools-in-the-enterprise

- **Applies to:** Stage 02 (question design validation), Stage 04 (positioning and hero copy)

- **Pitfalls:**
  - GXA's simulator is the closest head-to-head competitor — differentiate on the PDF deliverable, question depth, and the personal dollar-per-scenario framing
  - Do not claim "only tool" without qualifying scope — say "only ungated tool that..." or similar
  - Tone differentiation is important: GXA's tool is IT-vendor-branded; this tool should read as an independent resource

---

## Target 7: Svelte 5 Runes — Current Version and Breaking Changes

- **Best practice:** Svelte 5 runes are stable at v5.30.2. `SvelteMap` from `svelte/reactivity` is confirmed. The runes config in `svelte.config.js` should use the function form (not boolean) to exclude `node_modules`.

- **Confirmed patterns:**

  **State class pattern (confirmed):**
  ```typescript
  import { SvelteMap } from 'svelte/reactivity';

  class AssessmentStore {
    private _currentStep = $state(0);
    private _responses = $state<SvelteMap<string, Response>>(new SvelteMap());
  }
  ```

  **Runes config — use function form to protect node_modules:**
  ```js
  // svelte.config.js
  // The governance tool's pattern — validated working in production
  compilerOptions: {
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
  }
  ```
  Note: The boolean form (`runes: true`) is documented as stable but forces runes on ALL files including `node_modules`, which can break Svelte 4-style library components. The function form used by the governance tool is the safer choice for a project with dependencies.

  **`$derived.by` for complex derivations:**
  ```typescript
  const complexValue = $derived.by(() => {
    // multi-statement logic
    return result;
  });
  ```

- **Current version:** Svelte 5.30.2 (as of April 2026)

- **Sources:**
  - svelte/reactivity docs: https://svelte.dev/docs/svelte/svelte-reactivity
  - Svelte 5 release blog: https://svelte.dev/blog/svelte-5-is-alive
  - v5 migration guide: https://svelte.dev/docs/svelte/v5-migration-guide

- **Applies to:** Stages 01, 03, 04, 05, 06

- **Pitfalls:**
  - **SvelteMap reactivity bug (open):** Replacing a value in SvelteMap does not always trigger reactivity (GitHub issue #16760). Workaround: use `.set()` with a new value reference, or reassign the entire map
  - **`aria-checked` with boolean:** Svelte will pass booleans through to ARIA attributes — coerce to string manually (see WCAG findings above)
  - **`$effect` timing:** Runs after DOM update. Use `$effect.pre` for before-DOM logic
  - **`SvelteMap` deep reactivity:** Values inside a SvelteMap are NOT made deeply reactive automatically — store primitives or reactive class instances

---

## Dollar Exposure Model — Updated Parameters

Based on Stage 00 research, the dollar-exposure model in Stage 02 should use:

```typescript
// Confirmed source: IBM 2025 Cost of a Data Breach Report
const SHADOW_AI_BREACH_PREMIUM = 670_000;   // Additional cost vs average breach

// IBM 2025 baseline: 20% of all organizations experienced a shadow AI breach.
// These probability ranges apply a tier multiplier to the baseline, based on the
// reasoning that organizations scoring in lower governance tiers have proportionally
// worse shadow AI posture and therefore higher-than-average breach probability.
//
// Derivation (editorial — illustrative only, not actuarial):
//   Critical (0–25%):   ~2x–3x baseline  → 0.40–0.60
//   High (26–50%):      ~1.25x–2x baseline → 0.25–0.40
//   Moderate (51–75%):  ~0.5x–1.25x baseline → 0.10–0.25
//   Low (76–100%):      ~0.1x–0.5x baseline → 0.02–0.10
//
// These multipliers are editorial estimates, not derived from regression analysis.
// They must be presented with the required methodology caveat.
```

Display: "Based on your responses, your estimated annual shadow AI exposure is **$X–$Y**"
Methodology caveat (required on results page AND in PDF): "This estimate multiplies the IBM 2025 average shadow AI breach premium ($670,000) by a risk-tier probability range. The probability ranges are illustrative estimates — not actuarial calculations — based on IBM's finding that 20% of all organizations experienced a shadow AI breach. Actual exposure depends on organizational size, industry, and specific AI usage patterns."

---

## Summary of Changes to Source Plan

| Item | Draft Value | Confirmed Value | Action |
|------|------------|-----------------|--------|
| Shadow AI prevalence stat | "98% of orgs" | No citable source | REMOVE — use "20% of orgs had a shadow AI breach" (IBM 2025) |
| Breach premium | "$670K — IBM Cost of Breach 2024" | $670K confirmed — IBM 2025 report | UPDATE citation year to 2025 |
| Training stat | "29% trained on AI data handling" | No citable source | REPLACE with "only 17% have technical controls" (IBM 2025) |
| jsPDF version | Unspecified | v4.2.1 (major version) | Note in scaffold — no API changes for browser use |
| adapter-vercel runtime | `nodejs20.x` | `nodejs22.x` preferred (v6.3.3) | Use 22.x for new project |
| Runes config | boolean `runes: true` | Function form per governance tool | Use function form — safer for node_modules |
| Competitor landscape | Not researched | GXA closest; PDF + dollar output is a real gap | Validated differentiation |
