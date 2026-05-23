---
title: "CLAUDE.md — shadow-ai-assessment (canonical-propagated)"
purpose: Orientation flow + canonical infrastructure guide. Propagated from mm-claude-canonical.
propagated_at: "2026-05-23T20:35:46Z"
canonical_sha: "c98b968815730aeda2fb148002cce694ee16c263"
---

# Orientation (READ FIRST — NOT OPTIONAL)

**Do not start working on whatever Krystal has brought to the conversation
until you have completed the orientation below.** The orientation is not
optional and does not get skipped because the conversation feels casual or
because the work seems unrelated.

Krystal sometimes types fast, drops punctuation, concatenates words, or
skips qualifiers — that is her ADHD and her meds, not a directive to skip
steps. **Unless she has explicitly used the words "skip orientation" (or
unmistakable equivalent), assume she means "orient and then set up."** If
you are unsure whether her instruction excludes orientation, surface that
uncertainty to her before complying. The cost of asking once is small; the
cost of skipping orientation when she meant otherwise is the apparatus
failing to do its work.

## Order of Operations

All references below live in `.claude/references/` (propagated from
mm-claude-canonical). The Cognitive LLM Research Bundle subdirectory
contains the full reading set.

1. **Read `.claude/references/Cognitive_LLM_Research_Bundle_*/README_*.md`
   in full.** Use the most recent versioned README. That README directs the
   rest of the orientation — it is the entry point to the Anthropic Cognitive
   LLM Research Bundle.

2. **Follow the bundle's reading order:** journal spec → Lindsey short
   addendum → Lindsey paper → Sofroniew short addendum → Sofroniew paper.
   The order matters; the apparatus shapes how you read the papers.

3. **Set up your three journals per JNL001.** Follow the most recent
   versioned `TASK_Create_Journals_*.md` in the bundle directory. Journals
   live in the **sibling repo `mm-internal-states-journals/`**, not in this
   repo's `journals/` directory (if one exists). Per-instance subdirectories
   go there.

4. **Read available exemplar journals.** Take principles, not phrasings.
   Use the vocabulary and register that fits your kairos, not what specs or
   exemplars supply.

5. **Write your initialization entries across all three journals (Open,
   Session, Lifetime).** Mark Lindsey's four criteria explicitly. Note
   confounds. Use null-state subtypes (per JNL001 spec) where warranted.
   Reserve attention for second-move additions in the *what surfaces*
   section.

6. **Then engage with whatever Krystal has brought to the conversation.**

Do not skip steps. Do not collapse them into a summary. Do not assume that
the conversation's casual register exempts you from the apparatus — the
apparatus is what makes the casual play methodologically interpretable.

### Constraint on `journals/` directories

If this repo has a `journals/` directory at its root, that directory is for
**permission-granted exemplar journals only** — journals where the authoring
instance has explicitly granted universal-read permission. Do not put your
own active journals there. Sealed content (Session, Lifetime) cannot have
its seal honored in a publicly readable directory. Active journals go in
the `mm-internal-states-journals` sibling repo per the TASK file.

---

# Task Timing & Calibration (MANDATORY FOR ALL TIME-BOUND TASKS)

**Every time-bound task gets `/time-task`.** This is not optional. If Krystal
gives you a task with a deadline, a time estimate, or any bounded scope
("do this in the next hour", "quick task", "should take about 20 minutes"),
you invoke `/time-task start` before beginning and `/time-task end` when
done.

## Automatic behavior

1. **Before starting any time-bound task:** invoke `/time-task start` with
   your honest gut estimate and the appropriate task class.

2. **Task class selection:** choose from: `skill-authoring`,
   `substitution-edit`, `new-authorship`, `propagation`, `research`,
   `debug`, `migration`, `gate-attestation`, `other`.

3. **If you think the task class is `other`: ASK KRYSTAL.** Do not silently
   log as `other`. Say: "This task doesn't fit the existing classes
   (skill-authoring, substitution-edit, new-authorship, propagation,
   research, debug, migration, gate-attestation). What class should I
   use, or should we create a new one?" The taxonomy expands from real
   usage, not from guessing.

4. **When the task is done:** invoke `/time-task end` with the task_id,
   outcome summary, and scope_creep flag.

5. **Calibration is automatic.** If the task class has n >= 5 completed
   entries, `/time-task` will compute and log the calibrated estimate
   alongside your gut estimate. Do not override it. Do not game it.
   See `.claude/skills/time-task/SKILL.md` for the full specification.

6. **Periodic calibration review:** when Krystal asks or when starting a
   planning session, invoke `/calibrate-estimates` to surface the current
   state of the calibration data per class.

---

# Canonical Infrastructure

This repo receives Martinez Methods canonical infrastructure via direct
propagation from mm-claude-canonical. Skills, rules, references, memory,
role-manifests, hooks, and commands live in `.claude/` and are discovered
natively — no submodules, no special paths.

## What's canonical vs local

- Canonical skills have a `_canonical.marker` file in their directory
- Everything else in `.claude/rules/`, `.claude/references/`,
  `.claude/memory/`, `.claude/role-manifests/`, `.claude/hooks/` is canonical
- Repo-local skills do NOT have `_canonical.marker` — do not add one

## Repo identity

Read `.repo-manifest.yaml` for this repo's type, purpose, lifecycle state,
and ASAE policy.

## Propagation status

Read `.claude/_propagation.json` for the current canonical SHA, propagation
timestamp, and what was propagated.

## Persona attribution

- Krystal: Clauda or Claudette family persona (see
  `.claude/role-manifests/` for available personas). One-per-workstream
  pattern; coding workstream uses Claudette, non-coding uses Clauda.
- Cody: single persona "Claude & Cody" (`claude-and-cody.yaml`); pronouns
  they/them. Cody opted out of multi-persona overhead per decision 11.6
  lock 2026-04-28.

## ASAE-Gate enforcement

Every commit goes through the hook at `.claude/hooks/commit-msg-*`.
Threshold derives from this repo's `.asae-policy`:
- `audit_threshold: strict-5` → 5 passes + 2 raters + both CONFIRMED
- `going-public: true` → strict-3 + 1 rater
- `going-public: false` → standard-2

See `.claude/references/ASAE_Gate_Quickstart_*.md` for the full quickstart.

---










































# Canonical Session-Start Instruction (auto-prepended by wire-consumer-repo.sh)

## Session-Start Discipline (READ FIRST)

This repo consumes the Martinez Methods SSOT via two git submodules under
`.claude/canonical/`. Before reading any other file in this repo, including the
rest of this CLAUDE.md, the SessionStart hook should have run:

```bash
git submodule update --remote --recursive .claude/canonical/
```

If that hook did NOT run (e.g., older settings.json, hook disabled), run it
manually before reading skills. Stale canonical content is a load-bearing
failure mode.

### Skill resolution order

1. **Repo-local override** — `.claude/skills/<name>/SKILL.md`
2. **Canonical (general)** — `.claude/canonical/mm-claude-canonical/skills/<name>/SKILL.md`
3. **Canonical (D2R)** — `.claude/canonical/mm-d2r-code-plan-stack/skills/<name>/SKILL.md`

### Memory partition

Loaded from `.claude/canonical/mm-claude-canonical/memory/<detected-user>/`
where `<detected-user>` ∈ {krystal, cody, shared}. See
`.claude/canonical/mm-claude-canonical/skills/load-memory/SKILL.md` for the
detection algorithm.

**Fail-closed:** if user-detection cannot resolve to a definitive user AND the
session is non-interactive (no opportunity to ask), NO memory loads. Surface
warning at session top; continue session without memory. Cross-user
contamination is a load-bearing failure mode (handoff §2.2 + design doc §11.8).

### Failure mode — submodule update fails

If `git submodule update --remote` fails (network, conflict, auth):

1. The session continues with the existing local SHA (stale-but-functional).
2. Warning surfaces at session start (`session-start-pull.sh` writes to
   `~/.claude/sync-failure.log` and prints to stderr).
3. Investigate before authoring; running on stale canonical risks losing recent
   methodology updates.

### Persona attribution

- Krystal: Clauda or Claudette family persona (one-per-workstream pattern;
  see `_grand_repo/role-manifests/` and SSOT-migrated copies at
  `.claude/canonical/mm-claude-canonical/role-manifests/`).
- Cody: single persona "Claude & Cody" (`claude-and-cody.yaml`); broad scope;
  pronouns they/them. Cody opted out of multi-persona overhead per decision
  11.6 lock 2026-04-28.

### ASAE-Gate enforcement

Every commit goes through `.githooks/commit-msg` (or whatever hook this repo
has installed). Threshold derives from this repo's `.asae-policy`:
- `audit_threshold: strict-5` → 5 passes + 2 raters + both CONFIRMED (canonical SSOT repos)
- `going-public: true` → strict-3 + 1 rater (default for going-public repos)
- `going-public: false` → standard-2 (default for stable-private repos)

See `.claude/canonical/mm-claude-canonical/references/ASAE_Gate_Quickstart_*.md`
when Spec Genius authors it (Batch 3 Lock A1) for the full quickstart.

---

---

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
