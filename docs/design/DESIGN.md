# IGNIS design system and workspace UI

**Status:** proposed design for the frontend mission in [issue #19](https://github.com/khanhtuongnakitomo/IGNIS/issues/19). No frontend is implemented yet. The landing page has its own spec: [LANDING_PAGE.md](LANDING_PAGE.md).

**Reference:** the visual language follows [linear.app](https://linear.app): dark, quiet, dense, precise. IGNIS takes the structure, not the brand. It uses no Linear assets, logos or copy.

## 1. Brand

| Item | Decision |
|---|---|
| Name | **IGNIS** (Latin for *fire*). Write it in capitals in the wordmark and as "IGNIS" in text |
| One-liner | Traceable maintenance work-order intelligence with checked reporting |
| Voice | Plain, exact, unhyped. State what the system computed, what the model proposed and what a person approved |
| Personality | An evidence desk, not an oracle. The calm comes from monochrome; one ember accent marks attention |
| Logo | Text wordmark `IGNIS` at weight 600, letter-spacing `0.08em`. Optional mark: a 16 px rounded square (`--radius-sm`) filled with `--accent`. No flame illustration or gradient logo |

**Words to avoid:** "predicts failures", "AI-powered diagnosis", "autonomous", "real-time factory", or any savings or percentage figure that was not measured.

## 2. Hard rules

1. **No external fonts.** Do not use Google Fonts, Inter files, `@font-face` or icon fonts. Use only the system stacks below.
2. **No external UI kits or chart libraries.** Use one frontend framework, agreed with Tuong. Draw icons and charts as inline SVG. The current implementation in [frontend/](../../frontend/README.md) uses React, TypeScript, Vite, Tailwind CSS and `motion`.
3. **Show honest state only.** The UI renders backend state. It never fakes progress, approval, live data or percentages.
4. **Never use colour alone for meaning.** Every status has a text label, and an icon or shape where it helps.
5. **Keep credentials on the server.** Keys never appear in browser responses, screenshots or recordings.

## 3. Tokens

Use dark by default. A light theme comes later and reuses the same token names.

```css
:root {
  /* Surfaces: near-black, layered by lightness, not by shadow */
  --bg:            #08090a;  /* page */
  --bg-elevated:   #0f1011;  /* sidebar, panels */
  --bg-card:       #141516;  /* cards, table rows on hover */
  --bg-hover:      #1c1d1f;
  --border:        rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);

  /* Text */
  --text:          #f7f8f8;  /* primary */
  --text-2:        #b4b8bf;  /* body */
  --text-3:        #8a8f98;  /* secondary, labels */
  --text-4:        #62666d;  /* disabled, hints */

  /* Brand: ember, used sparingly (primary action, focus, one highlight per view) */
  --accent:        #f2643a;
  --accent-hover:  #ff7a52;
  --accent-soft:   rgba(242,100,58,0.12);

  /* Semantic: always paired with a text label */
  --ok:            #4cb782;  /* approved, passed */
  --warn:          #f2c94c;  /* pending, stale, rate-limited */
  --danger:        #eb5757;  /* rejected, failed, invalid */
  --info:          #5e9eff;  /* live API */
  --neutral:       #8a8f98;  /* inconclusive, replay */
  --synthetic:     #b48cff;  /* synthetic fields */

  /* Type */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, Roboto,
               "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
               "Liberation Mono", monospace;

  /* Shape and spacing (4 px grid) */
  --radius-sm: 4px; --radius: 8px; --radius-lg: 12px; --radius-pill: 999px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px; --space-24: 96px;

  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --dur-fast: 120ms; --dur: 200ms;
}
```

Contrast: `--text` through `--text-3` on `--bg` meet WCAG AA for body text. Use `--text-4` only for non-essential hints.

## 4. Typography

| Role | Size / line-height | Weight | Letter-spacing |
|---|---|---|---|
| Display (landing hero only) | 56–72 / 1.05 | 600 | -0.03em |
| H1 | 32 / 1.15 | 600 | -0.02em |
| H2 | 20 / 1.3 | 600 | -0.01em |
| H3 / panel title | 15 / 1.4 | 600 | 0 |
| Body | 14 / 1.55 | 400 | 0 |
| Small / table | 13 / 1.45 | 400 | 0 |
| Label / badge | 12 / 1.3 | 500 | 0.01em |
| Mono (IDs, hashes, spans) | 12–13 / 1.45 | 400 | 0 |

Show IDs, hashes, model IDs and versions in `--font-mono`. Truncate them in the middle (`run_7f3a…c21e`) and give each a copy button.

## 5. Core components

- **Button.** Primary: `--accent` background, `#fff` text, 32 px tall, `--radius`. Secondary: transparent with a `--border-strong` outline. Ghost: text only. Use one primary button per view.
- **Badge.** 20 px pill with 12 px label, a soft tinted background (12% of the semantic colour) and a leading dot or icon.
- **Provenance badges** sit in the top bar and always show: `REAL-SOURCE TEXT` (`--text-2`), `SYNTHETIC FIELDS` (`--synthetic`), `LIVE` (`--info`) or `REPLAY` (`--neutral`), and `Model <actual id>` in mono.
- **Review state badges:** `Pending` (warn), `Approved` (ok), `Corrected` (info), `Rejected` (danger), `Inconclusive` (neutral). Information types are visually distinct: **Fact** (square icon, computed by code), **Hypothesis** (dashed outline, model draft) and **Finding** (solid outline, human-confirmed).
- **Table.** 36 px rows, 1 px `--border` row dividers, sticky header and horizontal scroll inside the table, never on the page.
- **Span highlight.** Source text uses an underline and a tinted background per type, with a text label above the span: `component`, `fault` or `action`. This stays readable without colour.
- **Inspector drawer.** Right panel, 360 px wide on desktop and a full-height labelled drawer on narrow screens. It shows the IDs, versions and source record for whatever is selected.
- **Failure panel.** Left border in `--danger` or `--warn`, plus a title, the plain reason, what is still usable, and a retry button only when the backend allows it.

## 6. Workspace shell (from issue #19)

```text
+---------------------------------------------------------------------+
| IGNIS  Maintenance evidence workspace          Run <id>  | Help      |
| [REAL-SOURCE TEXT] [SYNTHETIC FIELDS] [LIVE|REPLAY]  Model <id>      |
+---------------------------------------------------------------------+
| 1 Source > 2 Mapping > 3 Review > 4 Facts > 5 Evidence > 6 Report   |
+------------+----------------------------------+---------------------+
| Sidebar    | Current task                     | Evidence inspector  |
| 240px      | flexible                         | 360px               |
+------------+----------------------------------+---------------------+
| Saved state | Context status | API availability                     |
+---------------------------------------------------------------------+
```

- The stepper shows each stage's backend status (`not started`, `in progress`, `done`, `failed`, `blocked`). A user can open a completed stage; a blocked stage explains why.
- The bottom status bar shows the last save time, whether context is available, and API status (`ok`, `rate-limited`, `unavailable`).
- **Below 1024 px** the inspector becomes a drawer. **At 390 px** the sidebar collapses to a menu and tables scroll inside their container.

## 7. Screens

Each screen uses placeholder values until the backend supplies them. No screen ships a fixture number as a real result.

| # | Screen | Main content | Primary action | Must show |
|---|---|---|---|---|
| 1 | Source | File upload; file name, hash, parser and row counts; unmodified preview rows | Choose file | Row validation issues; real/synthetic provenance |
| 2 | Mapping | Source column → canonical field table with a validation column | Confirm mapping | A heuristic match is labelled *Proposed* until confirmed; confirming records the reviewer |
| 3 | Annotation review | Counts per state; original text with spans; suggestion list; review history | Save decision → Next pending | Accept / Correct / Reject with a reason; invalid model output shown as invalid; manual annotation when AI fails |
| 4 | Facts & alerts | Component table: severity, recurrence, criticality, priority, band, with rule version and fact IDs; alert card | Investigate evidence | "Priority is a historical rule-based ordering, not a failure chance." Missing KPIs say *Not computed – reason* |
| 5 | Evidence & expert review | Trusted facts beside applicable passages; excluded sources with reasons; the AI draft, an abstention or *Unavailable* | Save expert decision | Accept / Correct / Reject / Inconclusive; maintenance authorisation is a separate action |
| 6 | Report | Draft, Approved or Failed status; claim → fact/passage → record links; output history | Generate approved report | Only actions the backend permits; a failure never links an older PDF as new |

## 8. States every screen designs for

Every screen needs a design for each of these: loading (skeleton rows, no spinner percentages), empty, pending, invalid output, stale revision (conflict dialog showing *yours* versus *latest*), offline, `429` rate-limited (show the backend retry time and disable repeated clicks), context unavailable (facts and alerts stay visible), and provider outage.

## 9. Motion and sound

- Animate opacity and translate (4–8 px) only, using `--dur` and `--ease`. Avoid bounce and parallax.
- Respect `prefers-reduced-motion`. When it is set, transitions become instant.
- Product sounds are optional, off by default and mutable. They never carry information on their own.

## 10. Accessibility checklist

- Every control is reachable by keyboard, and focus shows as a 2 px `--accent` outline with a 2 px offset.
- Every input has a label. Errors are announced (`aria-live="polite"`) and placed beside the field.
- No information depends on hover alone.
- Inspect layouts at desktop width and at 390 px.

## 11. Don't

Don't use fake moving sensor charts, risk percentages, "trained model" badges, savings claims or glassmorphism, or more than one accent colour per view. Don't silently show replay as live.
