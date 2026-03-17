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
  'cover-1b':   { x: 365, y: 317, r: 32 },
  'cover-2b':   { x: 250, y: 213, r: 32 },
  'cover-3b':   { x: 135, y: 317, r: 32 },
  'cover-home': { x: 250, y: 420, r: 32 },

  // ── RELAY positions ────────────────────────────────────────────────────
  // Relay between outfield and 2B
  'relay-lf-to-2b': { x: 180, y: 248, r: 42 },
  'relay-cf-to-2b': { x: 250, y: 238, r: 42 },
  'relay-rf-to-2b': { x: 320, y: 248, r: 42 },

  // Relay between outfield and 3B
  'relay-lf-to-3b': { x: 172, y: 285, r: 42 },
  'relay-cf-to-3b': { x: 218, y: 270, r: 42 },
  'relay-rf-to-3b': { x: 315, y: 268, r: 42 },

  // Relay/cutoff between outfield and home
  'relay-lf-to-home': { x: 190, y: 338, r: 45 },
  'relay-cf-to-home': { x: 250, y: 328, r: 45 },
  'relay-rf-to-home': { x: 310, y: 338, r: 45 },

  // ── PITCHER BACKUPS ────────────────────────────────────────────────────
  'p-backup-2b':   { x: 250, y: 292, r: 42 },  // between mound and 2B
  'p-backup-3b':   { x: 192, y: 335, r: 42 },  // trail toward 3B
  'p-backup-home': { x: 250, y: 385, r: 40 },  // behind home
  'p-backup-1b':   { x: 375, y: 342, r: 42 },  // trail toward 1B
  'p-cover-home':  { x: 250, y: 400, r: 38 },  // pitcher covers home (WP)

  // ── CATCHER BACKUP ─────────────────────────────────────────────────────
  'c-backup-1b': { x: 358, y: 368, r: 42 },    // C follows runner to back up 1B

  // ── OUTFIELDER BACKUPS ─────────────────────────────────────────────────
  'cf-back-lf':   { x: 183, y: 135, r: 42 },   // CF backs up LF
  'cf-back-rf':   { x: 317, y: 135, r: 42 },   // CF backs up RF
  'lf-back-3b':   { x: 108, y: 272, r: 42 },   // LF backs up 3B
  'lf-back-home': { x: 205, y: 440, r: 45 },   // LF backs up home
  'cf-back-2b':   { x: 250, y: 175, r: 42 },   // CF backs up 2B
  'rf-back-1b':   { x: 395, y: 248, r: 42 },   // RF backs up 1B
  'rf-back-2b':   { x: 320, y: 190, r: 42 },   // RF backs up 2B area
  'lf-back-2b':   { x: 180, y: 190, r: 42 },   // LF backs up 2B area

  // Safety backup (OF shifts toward infield)
  'of-safety-left':  { x: 158, y: 272, r: 45 },
  'of-safety-right': { x: 342, y: 272, r: 45 },

  // ── SS / 2B BACKUP FOR 3B ──────────────────────────────────────────────
  'ss-backup-3b': { x: 152, y: 300, r: 42 },

  // ── BUNT POSITIONS ─────────────────────────────────────────────────────
  'charge-bunt-p':  { x: 250, y: 365, r: 48 }, // P charges toward home
  'charge-bunt-1b': { x: 328, y: 358, r: 48 }, // 1B charges
  'charge-bunt-3b': { x: 172, y: 358, r: 48 }, // 3B charges
  'cover-1b-bunt':  { x: 365, y: 318, r: 35 }, // 2B covers 1B when 1B charges
  'cover-3b-bunt':  { x: 135, y: 318, r: 35 }, // SS covers 3B (bunt 1B&2B)

  // ── STEAL COVERAGE ──────────────────────────────────────────────────────
  'ss-cover-2b-steal': { x: 248, y: 212, r: 35 },

  // ── FIRST & THIRD ──────────────────────────────────────────────────────
  'p-cut-first-third': { x: 250, y: 355, r: 45 }, // P cuts throw from C
}
