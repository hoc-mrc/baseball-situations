# Baseball Situations — CLAUDE.md

## Project Overview

A mobile-first educational web app teaching defensive positioning to upper little league players (ages 9–12). Players drag fielder icons to their correct positions for a given situation, then get feedback.

- **Stack**: Vite + React + Tailwind CSS (static, no backend)
- **Hosting**: Netlify (auto-deploys from `main` branch via `netlify.toml`)
- **Key reference**: `situations.md` — the authoritative coaching guide for all positioning rules

---

## Architecture

### State-based routing
No React Router. A top-level `mode` state in `App.jsx` controls which screen renders (home, quiz, etc.).

### SVG field
- ViewBox: `0 0 500 480`
- Home plate: `(250, 420)`, 2B: `(250, 213)`, 1B: `(365, 317)`, 3B: `(135, 317)`
- Field is oriented with home at bottom, outfield at top
- All player positions and zone centers use these SVG coordinates

### Zone hit detection
Each zone in `src/data/zones.js` has `{ x, y, r }`. A player's answer is correct if they drop within radius `r` of center `(x, y)`.

**Zone geometry rules (enforce these strictly):**
- **Relay zones**: 50% midpoint on the straight line between the outfield source and the target base
- **Backup zones**: ~45px past the target base, on the extension of the throw line beyond the base
- **Outfield backups**: behind the target fielder in the direction the ball came from (i.e., from home plate toward the outfielder)

### Situations data (`src/data/situations.js`)
Each situation has:
```js
{
  id, title, playType, ballDescription, ballDestination, baseState, outs,
  positions: {
    P:  { zone, description, quiz, coachDecision, reason },
    C:  { ... },
    // etc.
  }
}
```

Helper functions:
```js
const hold = (pos, desc, reason = '') => ({ zone: `default-${pos}`, description: desc, quiz: false, coachDecision: null, reason })
const go   = (zone, desc, quiz = true, coachDecision = null, reason = '') => ({ zone, description: desc, quiz, coachDecision, reason })
```

- `quiz: true` = position is eligible to be tested in random mode
- `reason` = coaching rationale shown in feedback (italic, muted)
- Do **not** set `quiz: true` on the fielder who catches/fields the ball — only movement players

### Ball positions (`src/components/Field.jsx` → `BALL_POSITIONS`)
Named positions used for `ballDestination` in situations:
- Standard: `lf`, `cf`, `rf`, `infield`, `1b`, `2b`, `3b`, `home`
- Variety: `lf-gap`, `lf-line`, `lf-shallow`, `cf-left`, `cf-right`, `rf-gap`, `rf-line`, `rf-shallow`

Use variety positions to avoid the ball always appearing directly on the fielder's default position.

---

## Little League–Specific Rules

These differ from higher-level baseball and must be respected in situations:

- **No pitcher pick-offs** — runners cannot leave the base before the pitch, so pitchers never attempt pick-off moves. Use **catcher back-picks** instead (after receiving the pitch, C fires back to 1B if runner's lead is too aggressive).
- **LF coverage**: LF only backs up 3B or 2B — never backs up home plate.
- **Pitcher role on home throws**: P sprints to back up home on any throw from the outfield.
- **CF priority**: CF calls off all other outfielders; outfielders call off all infielders on fly balls.

---

## Quiz Logic

- **Random mode**: 10 situations per session (shuffled subset of all situations). Shows "Session Complete" screen at the end.
- **Position mode**: Tests only the player's assigned position across all situations.
- 3 positions are randomly selected per situation (in random mode) via `pickRandomQuizPositions()`.
- Score: +1 point per correct position placed.

---

## Feedback Rules

After answering, `Feedback.jsx` shows per-position results with:
1. **Description** — what the player should do
2. **Reason** (italic, muted) — coaching rationale, shown for both correct and wrong
3. **Rule tip** (yellow, wrong only) — derived from zone name:
   - `relay-*` → "position halfway between the ball and the throw target"
   - `p-backup-*`, `ss-backup-*`, `*-back-*` → "get behind the target on the throw line extension"
   - `cover-*` → "get to the base"
   - `charge-bunt-*` → "attack the bunt aggressively"

---

## Adding New Situations

1. Add a new entry to the `SITUATIONS` array in `src/data/situations.js`
2. Set `quiz: true` only on positions that move (not the fielder catching the ball)
3. Add `reason` strings to quizzed positions explaining the coaching rationale
4. Use a specific `ballDescription` (depth, direction, caught or dropped)
5. Use a varied `ballDestination` (e.g. `lf-gap` not just `lf`)
6. If you need a new zone, add it to `src/data/zones.js` following the geometry rules above

## Adding New Zones

Compute coordinates geometrically:
- Relay: `x = (source.x + target.x) / 2`, `y = (source.y + target.y) / 2`
- Backup: extend the throw line 45px past the target base
- Use `r: 55–58` for OF zones, `r: 45–50` for infield zones, `r: 25–30` for default/hold positions

---

## Common Commands

```bash
npm run dev      # local dev server
npm run build    # production build (check before pushing)
```
