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
  // Relay between outfield and 2B (~40% from OF toward 2B, on the throw line)
  'relay-lf-to-2b': { x: 169, y: 180, r: 58 },  // LF(115,158)→2B(250,213) at 40%
  'relay-cf-to-2b': { x: 250, y: 156, r: 58 },  // CF(250,118)→2B(250,213) at 40%
  'relay-rf-to-2b': { x: 331, y: 180, r: 58 },  // RF(385,158)→2B(250,213) at 40%

  // Relay between outfield and 3B (~40% from OF toward 3B, on the throw line)
  'relay-lf-to-3b': { x: 123, y: 222, r: 58 },  // LF(115,158)→3B(135,317) at 40%
  'relay-cf-to-3b': { x: 204, y: 198, r: 58 },  // CF(250,118)→3B(135,317) at 40%
  'relay-rf-to-3b': { x: 285, y: 222, r: 58 },  // RF(385,158)→3B(135,317) at 40%

  // Relay/cutoff between outfield and home (infield cutoff ~65% from OF toward home)
  'relay-lf-to-home': { x: 200, y: 328, r: 58 },  // LF→home cutoff, infield
  'relay-cf-to-home': { x: 250, y: 315, r: 58 },  // CF→home cutoff, infield
  'relay-rf-to-home': { x: 300, y: 328, r: 58 },  // RF→home cutoff, infield

  // ── PITCHER BACKUPS ────────────────────────────────────────────────────
  // P behind the target on extension of the throw line
  'p-backup-2b':   { x: 260, y: 248, r: 55 },  // behind 2B on CF relay extension
  'p-backup-3b':   { x: 95,  y: 345, r: 55 },  // behind 3B toward LF foul line
  'p-backup-home': { x: 250, y: 385, r: 55 },  // behind home
  'p-backup-1b':   { x: 405, y: 325, r: 55 },  // behind 1B past right side
  'p-cover-home':  { x: 250, y: 400, r: 50 },  // pitcher covers home (WP)

  // ── CATCHER BACKUP ─────────────────────────────────────────────────────
  'c-backup-1b': { x: 358, y: 368, r: 55 },    // C follows runner to back up 1B

  // ── OUTFIELDER BACKUPS ─────────────────────────────────────────────────
  'cf-back-lf':   { x: 183, y: 135, r: 55 },   // CF backs up LF
  'cf-back-rf':   { x: 317, y: 135, r: 55 },   // CF backs up RF
  'lf-back-3b':   { x: 108, y: 272, r: 55 },   // LF backs up 3B
  'lf-back-home': { x: 205, y: 440, r: 55 },   // LF backs up home
  'cf-back-2b':   { x: 250, y: 175, r: 55 },   // CF backs up 2B
  'rf-back-1b':   { x: 395, y: 248, r: 55 },   // RF backs up 1B
  'rf-back-2b':   { x: 320, y: 190, r: 55 },   // RF backs up 2B area
  'lf-back-2b':   { x: 180, y: 190, r: 55 },   // LF backs up 2B area

  // Safety backup (OF shifts toward infield)
  'of-safety-left':  { x: 158, y: 272, r: 58 },
  'of-safety-right': { x: 342, y: 272, r: 58 },

  // ── SS / 2B BACKUP FOR 3B ──────────────────────────────────────────────
  'ss-backup-3b': { x: 152, y: 300, r: 55 },

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
