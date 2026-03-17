// SVG coordinate system: viewBox "0 0 500 480"
// Home plate at bottom (250, 420), 2B at top (250, 213)
// Field oriented with home at bottom, outfield at top

export const FIELD = {
  home:  { x: 250, y: 420 },
  first: { x: 365, y: 317 },
  second:{ x: 250, y: 213 },
  third: { x: 135, y: 317 },
  mound: { x: 250, y: 330 },
}

// Named zones with center (x,y) and acceptance radius r
// Larger r = more forgiving drop zone
// Relay centers: ~40% of the way from OF source toward target base (on the throw line)
// Backup centers: ~45px beyond the target base on the extension of the throw line
export const ZONES = {
  // ── DEFAULT / HOLD positions ───────────────────────────────────────────
  'default-P':  { x: 250, y: 325, r: 28 },
  'default-C':  { x: 250, y: 408, r: 25 },
  'default-1B': { x: 378, y: 303, r: 25 },
  'default-2B': { x: 308, y: 267, r: 25 },
  'default-SS': { x: 192, y: 267, r: 25 },
  'default-3B': { x: 122, y: 303, r: 25 },
  'default-LF': { x: 115, y: 158, r: 30 },
  'default-CF': { x: 250, y: 118, r: 30 },
  'default-RF': { x: 385, y: 158, r: 30 },

  // ── BASE COVERAGE ──────────────────────────────────────────────────────
  'cover-1b':   { x: 365, y: 317, r: 45 },
  'cover-2b':   { x: 250, y: 213, r: 45 },
  'cover-3b':   { x: 135, y: 317, r: 45 },
  'cover-home': { x: 250, y: 420, r: 45 },

  // ── RELAY positions ────────────────────────────────────────────────────
  // Relay at 50% midpoint between OF source and target base (on the throw line)
  'relay-lf-to-2b': { x: 182, y: 185, r: 58 },  // LF(115,158)↔2B(250,213)
  'relay-cf-to-2b': { x: 250, y: 165, r: 58 },  // CF(250,118)↔2B(250,213)
  'relay-rf-to-2b': { x: 317, y: 185, r: 58 },  // RF(385,158)↔2B(250,213)

  // Relay between outfield and 3B (50% midpoint)
  'relay-lf-to-3b': { x: 125, y: 237, r: 58 },  // LF(115,158)↔3B(135,317)
  'relay-cf-to-3b': { x: 192, y: 217, r: 58 },  // CF(250,118)↔3B(135,317)
  'relay-rf-to-3b': { x: 260, y: 237, r: 58 },  // RF(385,158)↔3B(135,317)

  // Relay/cutoff between outfield and home (50% midpoint — shallow outfield)
  'relay-lf-to-home': { x: 182, y: 289, r: 58 },  // LF(115,158)↔home(250,420)
  'relay-cf-to-home': { x: 250, y: 269, r: 58 },  // CF(250,118)↔home(250,420)
  'relay-rf-to-home': { x: 318, y: 289, r: 58 },  // RF(385,158)↔home(250,420)

  // ── PITCHER BACKUPS ────────────────────────────────────────────────────
  // P behind the target — extension of the throw line PAST the target base
  'p-backup-2b':   { x: 250, y: 261, r: 55 },  // behind 2B, extension of CF relay→2B
  'p-backup-3b':   { x: 95,  y: 345, r: 55 },  // behind 3B toward LF foul line
  'p-backup-home': { x: 250, y: 460, r: 55 },  // behind home plate, past y=420
  'p-backup-1b':   { x: 410, y: 317, r: 55 },  // behind 1B on 3B→1B throw extension
  'p-cover-home':  { x: 250, y: 400, r: 50 },  // pitcher covers home (WP)

  // ── CATCHER BACKUP ─────────────────────────────────────────────────────
  'c-backup-1b': { x: 358, y: 368, r: 55 },    // C follows runner to back up 1B

  // ── OUTFIELDER BACKUPS ─────────────────────────────────────────────────
  // CF backs up LF: ball home(250,420)→LF(115,158), behind LF in that direction
  'cf-back-lf':   { x: 92,  y: 120, r: 55 },
  // CF backs up RF: ball home(250,420)→RF(385,158), behind RF in that direction
  'cf-back-rf':   { x: 405, y: 118, r: 55 },
  // LF backs up CF from left: ball home→CF(250,118), LF behind CF on left side
  'lf-back-cf':   { x: 185, y: 100, r: 55 },
  // RF backs up CF from right: RF behind CF on right side
  'rf-back-cf':   { x: 315, y: 100, r: 55 },
  'lf-back-3b':   { x: 108, y: 272, r: 55 },   // LF backs up 3B
  'lf-back-home': { x: 205, y: 440, r: 55 },   // LF backs up home (not used in quiz)
  'cf-back-2b':   { x: 250, y: 175, r: 55 },   // CF backs up 2B
  'rf-back-1b':   { x: 395, y: 248, r: 55 },   // RF backs up 1B
  'rf-back-2b':   { x: 320, y: 190, r: 55 },   // RF backs up 2B area
  'lf-back-2b':   { x: 180, y: 190, r: 55 },   // LF backs up 2B area

  // Safety backup (OF shifts toward infield)
  'of-safety-left':  { x: 158, y: 272, r: 58 },
  'of-safety-right': { x: 342, y: 272, r: 58 },

  // ── SS / 2B BACKUP FOR 3B ──────────────────────────────────────────────
  // SS backs up 3B: C(250,420)→3B(135,317), behind 3B on that throw line
  'ss-backup-3b': { x: 102, y: 287, r: 55 },

  // ── BUNT POSITIONS ─────────────────────────────────────────────────────
  'charge-bunt-p':  { x: 250, y: 365, r: 62 }, // P charges toward home
  'charge-bunt-1b': { x: 328, y: 358, r: 62 }, // 1B charges
  'charge-bunt-3b': { x: 172, y: 358, r: 62 }, // 3B charges
  'cover-1b-bunt':  { x: 365, y: 318, r: 48 }, // 2B covers 1B when 1B charges
  'cover-3b-bunt':  { x: 135, y: 318, r: 48 }, // SS covers 3B (bunt 1B&2B)

  // ── STEAL COVERAGE ──────────────────────────────────────────────────────
  'ss-cover-2b-steal': { x: 248, y: 212, r: 48 },

  // ── FIRST & THIRD ──────────────────────────────────────────────────────
  'p-cut-first-third': { x: 250, y: 355, r: 58 }, // P cuts throw from C
}
