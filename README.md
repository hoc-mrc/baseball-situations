# Baseball Situations

A mobile-first web app that teaches defensive positioning and baserunning decisions to upper Little League players (ages 9–12). Players interact with an SVG baseball field, drag fielders to their correct positions for a given situation, and get immediate coaching feedback.

Live: auto-deploys to Netlify from `main`.

---

## What the App Does

There are three modes accessible from the home screen:

### Defensive Quiz
Players are shown a game situation (e.g. "fly ball to left field, runner on 1B") and must drag 2–3 highlighted fielders to their correct positions on the field. After submitting, the app shows which positions were right or wrong, the correct zone, and a coaching explanation for each.

- **Random mode** — 10 random situations per session. At the end, shows score, accuracy %, and a review of any wrong answers.
- **My Position mode** — player picks their position (e.g. SS) and is tested only on that position across all situations.

### Baserunning Quiz
Tap-to-answer multiple-choice questions about baserunning decisions (2-out rules, tag-up rules, force plays, wild pitches, reading the ball). Shows explanation after each answer. 10 questions per session.

### Coach Settings
Coaches configure team-specific decisions that vary by team: who covers 2B on steals, bunt rotation, cut-off assignments, first-and-third defense, etc. Settings are saved to `localStorage` and can be shared via a URL hash link (`#config=...`).

---

## File Structure

```
src/
  App.jsx                  — top-level state machine; controls which screen renders
  main.jsx                 — React entry point
  index.css                — global styles (minimal; Tailwind handles most)

  pages/
    Home.jsx               — home screen with mode buttons and team code entry
    ModeSelect.jsx         — pick Random or My Position mode before quiz
    DefensiveQuiz.jsx      — main defensive positioning quiz
    BaserunningQuiz.jsx    — multiple-choice baserunning quiz
    Coach.jsx              — coach settings panel

  components/
    Field.jsx              — SVG baseball field + player icons + drag/tap interaction
    Feedback.jsx           — per-position results shown after Check Answer
    Scoreboard.jsx         — base state diamonds + out indicators

  data/
    situations.js          — all defensive situations (positions, zones, descriptions)
    zones.js               — named SVG zones with center (x,y) and radius r
    baserunning.js         — baserunning quiz questions and answer choices
    coachDefaults.js       — coach decision options and defaults
```

---

## How Situations Work

Each situation in `situations.js` defines:
- **baseState** — which bases have runners (`{ first, second, third }`)
- **outs** — `'any'`, `'0-1'`, or `'2'`
- **playType** — `fly_ball`, `ground_ball`, `single`, `steal`, `bunt`, `wild_pitch`, `pickoff`, `rundown`
- **ballDestination** — named position from `BALL_POSITIONS` in Field.jsx (e.g. `lf-gap`, `gb-ss`)
- **positions** — one entry per fielder, each with:
  - `zone` — target zone name from zones.js
  - `description` — what this player should do
  - `quiz` — whether this position is eligible to be tested
  - `reason` — coaching rationale shown in feedback

Two helper shorthands are used throughout:
- `hold(pos, desc)` — player stays at default position, `quiz: false`
- `go(zone, desc)` — player moves to a specific zone, `quiz: true` by default

---

## How Zones Work

All zone detection is circle-based. Each zone in `zones.js` is `{ x, y, r }` — a center point and acceptance radius in SVG coordinates (viewBox `0 0 500 480`).

Key landmarks:
- Home plate: `(250, 420)`
- 2B: `(250, 213)`
- 1B: `(365, 317)`
- 3B: `(135, 317)`

Zone types and their geometry:
| Type | How to compute |
|---|---|
| Relay | 50% midpoint on the straight line between OF source and target base |
| Backup | ~45px past the target base, extending the throw line beyond the base |
| OF backup | ~45px past the ball landing spot in the home→ball direction |
| Cover | At or very near the base (`r: 45`) |
| Default/hold | At the fielder's pre-pitch default position (`r: 25–30`) |

---

## Interaction Model

The field uses a unified pointer event system (touch + mouse) attached to the SVG element:

- **Tap a highlighted player** — selects them (yellow ring)
- **Tap a spot on the field** — places the selected player there
- **Drag a highlighted player** — moves them directly

"Highlighted" players are the ones being tested this round (shown with a dashed ring and yellow badge). Non-quiz fielders are visible but not interactive.

A player's position counts as "placed" when it's been dragged more than 8px from its default, or when its default position already falls inside the correct zone.

---

## Coach Decision System

Some positioning decisions vary by team — e.g. whether SS or 1B serves as the cut-off on throws from right field. These are called **coach decisions**.

A situation can mark a position with `coachDecision: 'keyName'` to indicate its zone depends on the team's setting. The `teamConfig` object (loaded from `localStorage`) stores each decision's current value. Coach decisions are configured on the `/coach` screen and can be shared as a URL hash link.

Current configurable decisions:
- Cut-off to home from LF/CF (SS, P, or 3B)
- Cut-off to home from RF (1B, 2B, or P)
- Who covers 2B on steals
- Who covers 2B on double plays
- Bunt rotation with runner on 1B
- Bunt default throw target
- Bases-loaded ground ball priority
- First-and-third steal defense

---

## Style Guide

The app uses **Tailwind CSS utility classes** throughout. There is no custom CSS beyond the minimal global reset in `index.css`.

### Colors
The UI is dark-themed. Key color conventions:

| Use | Classes |
|---|---|
| Page background | `bg-gray-900` (implicit via body) |
| Cards / panels | `bg-gray-800 border border-gray-700 rounded-xl` |
| Primary text | `text-white` |
| Secondary text | `text-gray-400` |
| Correct / success | `text-green-400`, `bg-green-600` |
| Wrong / error | `text-red-400`, `bg-red-700` |
| Warning / caution | `text-orange-400` |
| Score / highlights | `text-yellow-400` |
| Instructional accent | `text-yellow-300 font-bold` |

Player icon colors are defined in `POSITION_COLORS` in Field.jsx:
- P = orange, C = purple, 1B = green, 2B = blue, SS = pink, 3B = yellow, LF = rose, CF = lime, RF = sky

### Typography
- Page titles / headings: `text-2xl font-bold text-white`
- Section labels: `text-sm font-bold text-gray-300` or `text-orange-400`
- Body / descriptions: `text-sm text-gray-300`
- Mono / metadata: `text-xs font-mono text-gray-400`
- Coaching reasons: italic, `text-gray-400 text-xs`

### Buttons
- **Primary action** (Check Answer, Play Again): `bg-white text-gray-900 font-bold py-3 rounded-xl` — white when active, falls back to `bg-gray-700 text-gray-400` when disabled
- **Secondary / nav** (Back to Menu, mode buttons): `bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl`
- **Destructive / back nav**: plain `text-gray-400 hover:text-white text-xl`

### Layout
- All screens: `flex flex-col min-h-dvh max-w-lg mx-auto px-3 py-4 gap-4`
- Cards / answer panels: `bg-gray-800 border border-gray-700 rounded-xl px-4 py-3`
- The SVG field is constrained to `max-h-[60vh]` so it never crowds other UI elements on short screens

### Spacing
- Use `gap-3` or `gap-4` for vertical stacking between sections
- Use `px-3 py-2` for compact card padding, `px-4 py-3` for normal
- Prefer `rounded-xl` for all cards and buttons

---

## Development

```bash
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build — run this before pushing
```

Netlify auto-deploys on every push to `main`. No backend, no environment variables needed.
