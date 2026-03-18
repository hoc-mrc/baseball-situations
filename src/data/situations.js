// Each situation maps all 9 positions to:
//   zone: string — target zone name from zones.js
//   description: string — what this player should do
//   quiz: bool — eligible to be a random quiz target
//   coachDecision: null | string — key into teamConfig.decisions if answer varies by team
//   reason: string — coaching explanation shown after answer

// Helper shorthands
const hold = (pos, desc, reason = '') => ({ zone: `default-${pos}`, description: desc, quiz: false, coachDecision: null, reason })

const go = (zone, desc, quiz = true, coachDecision = null, reason = '') => ({ zone, description: desc, quiz, coachDecision, reason })

export const SITUATIONS = [

  // ══════════════════════════════════════════════════════════════════
  // SECTION 1 — FLY BALLS, NO RUNNERS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'fly-lf-no-runners',
    title: 'Fly Ball to Left Field',
    section: '1.1',
    baseState: { first: false, second: false, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'lf-gap',
    ballDescription: 'Deep fly ball to left-center gap — drops in front of LF, no runners on base',
    positions: {
      P:   go('p-backup-2b', 'Back up between mound and 2B', true, null, 'Position behind 2B on the relay throw line — backup if the throw sails past the bag.'),
      C:   go('c-backup-1b', 'Follow batter-runner; back up overthrow at 1B', true, null, 'Trail the batter-runner up the line — stop any errant throw at 1B from rolling into the dugout.'),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B; receive throw', false),
      SS:  go('relay-lf-to-2b', 'Move into relay position between LF and 2B', true, null, 'Relay sets up halfway between outfielder and 2B — keeps the throw strong all the way to the bag.'),
      '3B':hold('3B', 'Stay near 3B'),
      LF:  hold('LF', 'Catch the ball; throw hard to SS (relay) toward 2B'),
      CF:  go('cf-back-lf-gap', 'Back up LF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  go('of-safety-right', 'Shift toward infield as safety backup', false),
    },
  },

  {
    id: 'fly-cf-no-runners',
    title: 'Fly Ball to Center Field',
    section: '1.2',
    baseState: { first: false, second: false, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'cf-left',
    ballDescription: 'Deep fly ball to left-center — drops in front of CF, no runners on base',
    positions: {
      P:   go('p-backup-2b', 'Back up 2B area', true, null, 'Position behind 2B on the relay throw line — backup if the throw sails past the bag.'),
      C:   hold('C', 'Stay near home'),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-cf-to-2b', 'Move into relay position between CF and 2B', true, null, 'Relay sets up halfway between outfielder and 2B — keeps the throw strong all the way to the bag.'),
      '3B':hold('3B', 'Stay near 3B'),
      LF:  go('lf-back-cf', 'Back up CF from the left side', true, null, 'Rotate behind CF in case the ball gets past — prevents it from rolling to the wall.'),
      CF:  hold('CF', 'Catch the ball; throw to SS relay toward 2B'),
      RF:  go('rf-back-cf', 'Back up CF from the right side', true, null, 'Rotate behind CF in case the ball gets past — prevents it from rolling to the wall.'),
    },
  },

  {
    id: 'fly-rf-no-runners',
    title: 'Fly Ball to Right Field',
    section: '1.3',
    baseState: { first: false, second: false, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'rf-gap',
    ballDescription: 'Deep fly ball to right-center gap — drops in front of RF, no runners on base',
    positions: {
      P:   go('p-backup-2b', 'Back up between mound and 2B', true, null, 'Position behind 2B on the relay throw line — backup if the throw sails past the bag.'),
      C:   hold('C', 'Stay near home'),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('relay-rf-to-2b', 'Move out as relay between RF and 2B', true, null, 'Relay sets up halfway between outfielder and 2B — keeps the throw strong all the way to the bag.'),
      SS:  go('cover-2b', 'Cover 2B; receive throw', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '3B':hold('3B', 'Stay near 3B'),
      LF:  go('of-safety-left', 'Shift toward infield as safety backup', false),
      CF:  go('cf-back-rf-gap', 'Back up RF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  hold('RF', 'Catch the ball; throw to 2B relay toward SS covering 2B'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 2 — FLY BALLS, RUNNER ON 1B
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'fly-lf-runner-1b',
    title: 'Fly Ball to Left Field',
    section: '2.1',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'lf-line',
    ballDescription: 'Deep fly ball down the left field line — drops for a hit, runner on 1B',
    positions: {
      P:   go('p-backup-3b', 'Back up 3B on the relay throw', true, null, 'Runner on 1B was running and reaches 3B on the drop — P trails behind 3B on the throw line.'),
      C:   go('cover-home', 'Cover home; runner may try to score', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B; receive throw', false),
      SS:  go('relay-lf-to-3b', 'Move into relay between LF and 3B', true, null, 'Runner heading to 3B — SS gets halfway between LF and 3B on the throw line.'),
      '3B':go('cover-3b', 'Cover 3B; receive throw', false),
      LF:  hold('LF', 'Field the ball; throw hard to SS relay toward 3B'),
      CF:  go('cf-back-lf-line', 'Back up LF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  go('of-safety-right', 'Shift toward infield', false),
    },
  },

  {
    id: 'fly-cf-runner-1b',
    title: 'Fly Ball to Center Field',
    section: '2.2',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'cf-right',
    ballDescription: 'Deep fly ball to right-center — drops for a hit, runner on 1B',
    positions: {
      P:   go('p-backup-3b', 'Back up 3B on the relay throw', true, null, 'Runner on 1B was running and reaches 3B on the drop — P trails behind 3B on the throw line.'),
      C:   go('cover-home', 'Cover home; runner may try to score', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B; receive throw', false),
      SS:  go('relay-cf-to-3b', 'Move into relay between CF and 3B', true, null, 'Runner heading to 3B — SS gets halfway between CF and 3B on the throw line.'),
      '3B':go('cover-3b', 'Cover 3B; receive throw', false),
      LF:  go('lf-back-cf', 'Back up CF from the left', true, null, 'Rotate behind CF in case the ball gets past — prevents it from rolling to the wall.'),
      CF:  hold('CF', 'Field the ball; throw hard to SS relay toward 3B'),
      RF:  go('rf-back-cf', 'Back up CF from the right', true, null, 'Rotate behind CF in case the ball gets past — prevents it from rolling to the wall.'),
    },
  },

  {
    id: 'fly-rf-runner-1b',
    title: 'Fly Ball to Right Field',
    section: '2.3',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'rf-line',
    ballDescription: 'Deep fly ball down the right field line — drops for a hit, runner on 1B',
    positions: {
      P:   go('p-backup-3b', 'Back up 3B on the relay throw', true, null, 'Runner on 1B was running and reaches 3B on the drop — P trails behind 3B on the throw line.'),
      C:   go('cover-home', 'Cover home; runner may try to score', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('relay-rf-to-3b', 'Move out as relay between RF and 3B', true, null, 'Runner heading to 3B — 2B gets halfway between RF and 3B on the throw line.'),
      SS:  go('cover-2b', 'Cover 2B', false),
      '3B':go('cover-3b', 'Cover 3B; receive throw', false),
      LF:  go('of-safety-left', 'Shift toward infield', false),
      CF:  go('cf-back-rf-line', 'Back up RF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  hold('RF', 'Field the ball; throw hard to 2B relay toward 3B'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 3 — FLY BALLS, RUNNER ON 2B (TAG-UP)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'fly-lf-runner-2b-tagup',
    title: 'Fly Ball to Left Field',
    section: '3.1',
    baseState: { first: false, second: true, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'lf-gap',
    ballDescription: 'Medium fly ball to left-center gap — caught by LF, runner on 2B tagging up to score',
    positions: {
      P:   go('p-backup-home', 'Sprint to back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home; prepare for tag play', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-lf-to-home', 'Move into relay between LF and home', true, 'cutoffHomeLFCF', 'Any outfield ball scores the runner from 2B — SS gets halfway between the outfielder and home to relay or cut the throw.'),
      '3B':go('cover-3b', 'Cover 3B; remind runner of tag-up timing', false),
      LF:  hold('LF', 'Catch; hard throw to SS relay toward home'),
      CF:  go('cf-back-lf-gap', 'Back up LF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  go('of-safety-right', 'Shift toward infield', false),
    },
  },

  {
    id: 'fly-cf-runner-2b-tagup',
    title: 'Fly Ball to Center Field',
    section: '3.2',
    baseState: { first: false, second: true, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'cf-left',
    ballDescription: 'Medium fly ball to straightaway center — caught by CF, runner on 2B tagging up to score',
    positions: {
      P:   go('p-backup-home', 'Sprint to back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home; prepare for tag play', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-cf-to-home', 'Move into relay between CF and home', true, 'cutoffHomeLFCF', 'Any outfield ball scores the runner from 2B — SS gets halfway between the outfielder and home to relay or cut the throw.'),
      '3B':go('cover-3b', 'Cover 3B', false),
      LF:  go('lf-back-cf', 'Back up CF from the left', true, null, 'Rotate behind CF in case the ball gets past — prevents it from rolling to the wall.'),
      CF:  hold('CF', 'Catch; throw to SS relay toward home'),
      RF:  go('rf-back-cf', 'Back up CF from the right', true, null, 'Rotate behind CF in case the ball gets past — prevents it from rolling to the wall.'),
    },
  },

  {
    id: 'fly-rf-runner-2b-tagup',
    title: 'Fly Ball to Right Field',
    section: '3.3',
    baseState: { first: false, second: true, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'rf-gap',
    ballDescription: 'Medium fly ball to right-center gap — caught by RF, runner on 2B tagging up to score',
    positions: {
      P:   go('p-backup-home', 'Sprint to back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home; prepare for tag play', false),
      '1B':go('relay-rf-to-home', 'Move out as relay between RF and home', true, 'cutoffHomeRF', 'Any outfield ball scores the runner from 2B — 1B gets halfway between RF and home to relay or cut the throw.'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('cover-3b', 'Cover 3B or back up', false),
      '3B':go('cover-3b', 'Cover 3B', false),
      LF:  go('of-safety-left', 'Shift toward infield', false),
      CF:  go('cf-back-rf-gap', 'Back up RF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  hold('RF', 'Catch; throw to 1B relay toward home'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 4 — FLY BALLS, RUNNERS ON 1B & 2B
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'fly-lf-runners-1b-2b',
    title: 'Fly Ball to Left Field',
    section: '4.1',
    baseState: { first: true, second: true, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'lf-line',
    ballDescription: 'Deep fly ball down the left field line — drops for a hit, runners on 1B and 2B',
    positions: {
      P:   go('p-backup-home', 'Back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-lf-to-home', 'Relay between LF and home', true, 'cutoffHomeLFCF', 'Any outfield ball scores the runner from 2B — SS gets halfway between the outfielder and home to relay or cut the throw.'),
      '3B':go('cover-3b', 'Cover 3B', false),
      LF:  hold('LF', 'Catch; throw to SS relay toward home'),
      CF:  go('cf-back-lf-line', 'Back up LF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  go('of-safety-right', 'Shift toward infield', false),
    },
  },

  {
    id: 'fly-cf-runners-1b-2b',
    title: 'Fly Ball to Center Field',
    section: '4.2',
    baseState: { first: true, second: true, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'cf-right',
    ballDescription: 'Deep fly ball to right-center — drops for a hit, runners on 1B and 2B',
    positions: {
      P:   go('p-backup-home', 'Back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-cf-to-home', 'Relay between CF and home', true, 'cutoffHomeLFCF', 'Any outfield ball scores the runner from 2B — SS gets halfway between the outfielder and home to relay or cut the throw.'),
      '3B':go('cover-3b', 'Cover 3B', false),
      LF:  go('lf-back-cf', 'Back up CF from the left', true, null, 'Rotate behind CF in case the ball gets past — prevents it from rolling to the wall.'),
      CF:  hold('CF', 'Catch; throw to SS relay toward home'),
      RF:  go('rf-back-cf', 'Back up CF from the right', true, null, 'Rotate behind CF in case the ball gets past — prevents it from rolling to the wall.'),
    },
  },

  {
    id: 'fly-rf-runners-1b-2b',
    title: 'Fly Ball to Right Field',
    section: '4.3',
    baseState: { first: true, second: true, third: false },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'rf-line',
    ballDescription: 'Deep fly ball down the right field line — drops for a hit, runners on 1B and 2B',
    positions: {
      P:   go('p-backup-home', 'Back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('relay-rf-to-home', 'Move out as relay toward RF', true, 'cutoffHomeRF', 'Any outfield ball scores the runner from 2B — 2B gets halfway between RF and home to relay or cut the throw.'),
      SS:  go('cover-2b', 'Cover 2B', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '3B':go('cover-3b', 'Cover 3B', false),
      LF:  go('of-safety-left', 'Shift toward infield', false),
      CF:  go('cf-back-rf-line', 'Back up RF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  hold('RF', 'Catch; throw to 2B relay toward home'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 5 — GROUND BALLS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'gb-no-runners',
    title: 'Ground Ball',
    section: '5.1',
    baseState: { first: false, second: false, third: false },
    outs: 'any',
    playType: 'ground_ball',
    ballDestination: 'gb-ss',
    ballDescription: 'Ground ball to shortstop — no runners on base',
    positions: {
      P:   go('p-backup-1b', 'Cover 1B if 1B fields the ball; back up on throws from left side', true, null, 'Back up behind 1B on throws from the left side — stops wild throws from going into the outfield.'),
      C:   go('cover-home', 'Cover home plate', false),
      '1B':hold('1B', 'Field ball or cover 1B bag; receive throw'),
      '2B':hold('2B', 'Field ball or cover your area'),
      SS:  hold('SS', 'Field ball or cover your area'),
      '3B':hold('3B', 'Field ball; throw to 1B'),
      LF:  go('lf-back-3b', 'Back up 3B and SS on hard-hit balls', true, null, 'Sprint behind 3B on the throw line — backs up any errant throw from the outfield or wild infield throw.'),
      CF:  go('cf-back-2b', 'Back up the middle of the infield', true, null, 'Position behind 2B — back up any through-ball or overthrow in the middle of the diamond.'),
      RF:  go('rf-back-1b', 'Back up 1B and 2B area', true, null, 'Sprint behind 1B on throws from the infield — stops wild throws from going into the dugout.'),
    },
  },

  {
    id: 'gb-runner-1b-dp',
    title: 'Ground Ball — Double Play',
    section: '5.2',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'ground_ball',
    ballDestination: 'gb-ss',
    ballDescription: 'Ground ball to shortstop — runner on 1B (double play opportunity)',
    coachNote: 'Who covers 2B depends on your team\'s DP assignment (see Coach Settings)',
    positions: {
      P:   go('p-backup-1b', 'Field if hit to P; back up 1B on relay throws', true, null, 'Back up behind 1B on throws from the left side — stops wild throws from going into the outfield.'),
      C:   go('cover-home', 'Cover home plate', false),
      '1B':hold('1B', 'Cover 1B bag; receive final throw for double play'),
      '2B':go('cover-2b', 'Cover 2B; receive throw, pivot, relay to 1B for DP', true, 'dpCoverage2B', 'Must be at the bag ready to receive the throw and apply the tag.'),
      SS:  hold('SS', 'Field ball; throw to 2B to start the double play'),
      '3B':hold('3B', 'Field ball if hit to 3B; throw to 2B for DP'),
      LF:  go('lf-back-3b', 'Back up 3B area', true, null, 'Sprint behind 3B on the throw line — backs up any errant throw from the outfield or wild infield throw.'),
      CF:  go('cf-back-2b', 'Back up 2B area', true, null, 'Position behind 2B — back up any through-ball or overthrow in the middle of the diamond.'),
      RF:  go('rf-back-1b', 'Back up 1B area', true, null, 'Sprint behind 1B on throws from the infield — stops wild throws from going into the dugout.'),
    },
  },

  {
    id: 'gb-runners-1b-2b-dp',
    title: 'Ground Ball — Double Play',
    section: '5.3',
    baseState: { first: true, second: true, third: false },
    outs: 'any',
    playType: 'ground_ball',
    ballDestination: 'gb-ss',
    ballDescription: 'Ground ball to shortstop — runners on 1B and 2B (force at every base)',
    positions: {
      P:   hold('P', 'Field if ball comes to you; throw to 2B or 3B per situation'),
      C:   go('cover-home', 'Cover home plate', false),
      '1B':hold('1B', 'Cover 1B; receive final throw for DP'),
      '2B':go('cover-2b', 'Cover 2B; pivot and relay to 1B', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      SS:  hold('SS', 'Field ball; throw to 2B or 3B'),
      '3B':hold('3B', 'Field ball if to 3B; throw to 2B or home'),
      LF:  go('lf-back-3b', 'Back up 3B', true, null, 'Sprint behind 3B on the throw line — backs up any errant throw from the outfield or wild infield throw.'),
      CF:  go('cf-back-2b', 'Back up 2B area', true, null, 'Position behind 2B — back up any through-ball or overthrow in the middle of the diamond.'),
      RF:  go('rf-back-1b', 'Back up 1B area', true, null, 'Sprint behind 1B on throws from the infield — stops wild throws from going into the dugout.'),
    },
  },

  {
    id: 'gb-bases-loaded',
    title: 'Ground Ball — Bases Loaded',
    section: '5.4',
    baseState: { first: true, second: true, third: true },
    outs: 'any',
    playType: 'ground_ball',
    ballDestination: 'gb-ss',
    ballDescription: 'Ground ball to shortstop — bases loaded (force at every base)',
    coachNote: 'Default: throw home for force out, C relays to 1B for DP. Confirm with coach.',
    positions: {
      P:   hold('P', 'Field if ball comes to you; throw home (force) per team plan'),
      C:   go('cover-home', 'Receive throw at home; relay to 1B for DP', false),
      '1B':hold('1B', 'Cover 1B; receive relay for DP'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  hold('SS', 'Field ball; throw home or to 2B'),
      '3B':hold('3B', 'Field ball if to 3B; throw home'),
      LF:  go('lf-back-3b', 'Back up 3B', true, null, 'Sprint behind 3B on the throw line — backs up any errant throw from the outfield or wild infield throw.'),
      CF:  go('cf-back-2b', 'Back up 2B area', true, null, 'Position behind 2B — back up any through-ball or overthrow in the middle of the diamond.'),
      RF:  go('rf-back-1b', 'Back up 1B', true, null, 'Sprint behind 1B on throws from the infield — stops wild throws from going into the dugout.'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 6 — SINGLES WITH RUNNERS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'single-lf-runner-1b',
    title: 'Single to Left Field',
    section: '6.1',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'single',
    ballDestination: 'lf-shallow',
    ballDescription: 'Shallow single that drops in front of LF — runner on 1B charging to 3B',
    positions: {
      P:   go('p-backup-3b', 'Trail toward 3B; back up', true, null, 'Trail behind 3B on the throw line — backs up any errant throw from the outfield.'),
      C:   go('cover-home', 'Stay at home; be ready', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-lf-to-3b', 'Move into relay between LF and 3B', true, null, 'Runner heading to 3B — relay player gets halfway between outfielder and 3B on the throw line.'),
      '3B':go('cover-3b', 'Cover 3B; receive throw', false),
      LF:  hold('LF', 'Field ball; throw to SS relay toward 3B or hold runner at 2B'),
      CF:  go('cf-back-lf-shallow', 'Back up LF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  go('of-safety-right', 'Shift toward infield', false),
    },
  },

  {
    id: 'single-rf-runner-1b',
    title: 'Single to Right Field',
    section: '6.2',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'single',
    ballDestination: 'rf-shallow',
    ballDescription: 'Shallow single that drops in front of RF — runner on 1B charging to 3B',
    positions: {
      P:   go('p-backup-3b', 'Back up 3B', true, null, 'Trail behind 3B on the throw line — backs up any errant throw from the outfield.'),
      C:   go('cover-home', 'Stay at home; be ready', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('relay-rf-to-3b', 'Move out as relay between RF and 3B', true, null, 'Runner heading to 3B — relay player gets halfway between outfielder and 3B on the throw line.'),
      SS:  go('cover-2b', 'Cover 2B', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '3B':go('cover-3b', 'Cover 3B; receive throw', false),
      LF:  go('of-safety-left', 'Shift toward infield', false),
      CF:  go('cf-back-rf-shallow', 'Back up RF', true, null, 'CF is closest — sprint behind in the ball\'s direction to cut off any misplay before it reaches the wall.'),
      RF:  hold('RF', 'Field ball; throw to 2B relay toward 3B'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 7 — BUNT DEFENSE
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'bunt-runner-1b',
    title: 'Bunt Defense',
    section: '7.1',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'bunt',
    ballDestination: 'home',
    ballDescription: 'Bunt — runner on 1B (get lead runner or take out at 1B)',
    coachNote: 'Bunt rotation varies by team. Confirm who charges with your coach.',
    positions: {
      P:   go('charge-bunt-p', 'Charge and field; throw to 2B (lead runner) or 1B', true, 'buntRotation1B', 'Attack the bunt aggressively — field it quickly and throw to the called base.'),
      C:   hold('C', 'Pop up; direct traffic; field if bunt is near plate'),
      '1B':go('charge-bunt-1b', 'Charge; throw to 2B if fielding; cover 1B if not', true, 'buntRotation1B', 'Attack the bunt aggressively — field it quickly and throw to the called base.'),
      '2B':go('cover-1b-bunt', 'Cover 1B (since 1B is charging)', true, null, '1B is charging the bunt, so 2B must race to cover the bag for the throw.'),
      SS:  go('cover-2b', 'Cover 2B', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '3B':go('charge-bunt-3b', 'Charge aggressively from bag', true, null, 'Attack the bunt aggressively — field it quickly and throw to the called base.'),
      LF:  go('lf-back-3b', 'Back up 3B', true, null, 'LF moves in behind 3B — backup for a wild throw from the catcher.'),
      CF:  go('cf-back-2b', 'Back up 2B', false),
      RF:  go('rf-back-1b', 'Back up 1B', false),
    },
  },

  {
    id: 'bunt-runners-1b-2b',
    title: 'Bunt Defense',
    section: '7.2',
    baseState: { first: true, second: true, third: false },
    outs: 'any',
    playType: 'bunt',
    ballDestination: 'home',
    ballDescription: 'Bunt — runners on 1B and 2B (try for force at 3B)',
    coachNote: 'Goal is force at 3B if possible, otherwise take the out at 1B.',
    positions: {
      P:   go('charge-bunt-p', 'Charge; throw to 3B (force) if close enough; otherwise 1B', true, null, 'Attack the bunt aggressively — field it quickly and throw to the called base.'),
      C:   hold('C', 'Direct traffic; field if near plate; call the throw'),
      '1B':go('charge-bunt-1b', 'Charge; throw to 3B if fielding; cover 1B if not', true, null, 'Attack the bunt aggressively — field it quickly and throw to the called base.'),
      '2B':go('cover-1b-bunt', 'Cover 1B (since 1B is charging)', true, null, '1B is charging the bunt, so 2B must race to cover the bag for the throw.'),
      SS:  go('cover-3b-bunt', 'Sprint to cover 3B', true, null, '3B is charging, so SS sprints to cover 3B for the force play.'),
      '3B':go('charge-bunt-3b', 'Charge; if NOT fielding, retreat quickly to 3B', true, null, 'Attack the bunt aggressively — field it quickly and throw to the called base.'),
      LF:  go('lf-back-3b', 'Back up 3B', true, null, 'LF moves in behind 3B — backup for a wild throw from the catcher.'),
      CF:  go('cf-back-2b', 'Back up 2B', false),
      RF:  go('rf-back-1b', 'Back up 1B', false),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 8 — STEALS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'steal-2b',
    title: 'Steal of Second Base',
    section: '8.1',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'steal',
    ballDestination: '2b',
    ballDescription: 'Runner on 1B stealing 2B',
    coachNote: 'Who covers 2B (SS or 2B) depends on your team\'s steal coverage setting.',
    positions: {
      P:   hold('P', 'Deliver the pitch; do not obstruct the throw lane'),
      C:   hold('C', 'Receive pitch cleanly; quick throw to 2B'),
      '1B':hold('1B', 'Hold runner; release on pitch'),
      '2B':go('ss-cover-2b-steal', 'Cover 2B OR hold (based on team assignment)', true, 'stealCoverage2B', 'Must be at the bag ready to receive the throw and apply the tag.'),
      SS:  go('ss-cover-2b-steal', 'Cover 2B; receive throw; apply tag', true, 'stealCoverage2B', 'Must be at the bag ready to receive the throw and apply the tag.'),
      '3B':hold('3B', 'Stay near 3B'),
      LF:  go('lf-back-2b', 'Sprint to back up 2B from left-center', true, null, 'LF moves in behind 3B — backup for a wild throw from the catcher.'),
      CF:  go('cf-back-2b', 'Back up 2B from center field', true, null, 'Position behind 2B — back up any overthrow or errant throw on the steal attempt.'),
      RF:  go('rf-back-2b', 'Drift toward 2B area', false),
    },
  },

  {
    id: 'steal-3b',
    title: 'Steal of Third Base',
    section: '8.2',
    baseState: { first: false, second: true, third: false },
    outs: 'any',
    playType: 'steal',
    ballDestination: '3b',
    ballDescription: 'Runner on 2B stealing 3B',
    positions: {
      P:   hold('P', 'Deliver pitch; be alert'),
      C:   hold('C', 'Receive pitch; quick throw to 3B'),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('ss-backup-3b', 'Back up 3B in case of wild throw', true, null, 'LF rotates behind 3B — backup for a wild throw from the catcher.'),
      '3B':go('cover-3b', 'Cover 3B; receive throw; apply quick tag', false),
      LF:  go('lf-back-3b', 'Back up 3B', true, null, 'LF rotates behind 3B — backup for a wild throw from the catcher.'),
      CF:  hold('CF', 'Back up'),
      RF:  hold('RF', 'Back up'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 9 — FIRST & THIRD STEAL DEFENSE
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'first-third-steal',
    title: 'First & Third Steal Defense',
    section: '9',
    baseState: { first: true, second: false, third: true },
    outs: 'any',
    playType: 'steal',
    ballDestination: '2b',
    ballDescription: 'Runner on 1B steals while runner on 3B watches for chance to score',
    coachNote: 'This is the highest-variation situation. Your team\'s system is set in Coach Settings.',
    positions: {
      P:   go('p-cut-first-third', 'Sprint toward home — cut the throw or back up home per team system', true, 'firstThirdDefense', 'Regardless of system, P moves toward home. Either you cut the throw for a play at the plate, or you back up home if C throws through.'),
      C:   hold('C', 'Execute throw per team\'s first-and-third system'),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B; receive the throw', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      SS:  go('cover-2b', 'Move toward 2B — always', true, null, 'SS always moves toward 2B on a 1st-and-3rd play regardless of team system. You may cut the throw, let it go, or cover the bag — but you always move there.'),
      '3B':hold('3B', 'Stay at 3B; hold the runner'),
      LF:  go('lf-back-3b', 'Back up 3B', true, null, 'LF rotates behind 3B — backup for a wild throw from the catcher.'),
      CF:  go('cf-back-2b', 'Back up 2B', false),
      RF:  go('rf-back-1b', 'Back up 1B', false),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 10 — WILD PITCH / PASSED BALL
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'wp-pb-runner-3b',
    title: 'Wild Pitch / Passed Ball',
    section: '10.1',
    baseState: { first: false, second: false, third: true },
    outs: 'any',
    playType: 'wild_pitch',
    ballDestination: 'home',
    ballDescription: 'Wild pitch or passed ball — runner on 3B',
    positions: {
      P:   go('p-cover-home', 'Sprint immediately to cover home plate; receive throw from C', true, null, 'C is chasing the ball — P must get to home plate first to receive the throw and apply the tag.'),
      C:   hold('C', 'Chase the ball; field it cleanly; throw to P at home'),
      '1B':go('p-backup-home', 'Sprint in to back up home plate behind P', true, null, 'If P misses the throw or the ball gets away, you are the last line of defense — stop it from rolling to the backstop.'),
      '2B':hold('2B', 'Hold position'),
      SS:  hold('SS', 'Hold position — the play is at home, not 3B'),
      '3B':hold('3B', 'Stay near 3B bag'),
      LF:  hold('LF', 'Hold position — LF backs up 3B or 2B only, not home'),
      CF:  hold('CF', 'Back up'),
      RF:  hold('RF', 'Back up'),
    },
  },

  {
    id: 'wp-pb-runner-2b',
    title: 'Wild Pitch / Passed Ball',
    section: '18.1',
    baseState: { first: false, second: true, third: false },
    outs: 'any',
    playType: 'wild_pitch',
    ballDestination: '3b',
    ballDescription: 'Wild pitch or passed ball — runner on 2B trying to advance to 3B',
    positions: {
      P:   go('p-backup-3b', 'Back up 3B', true, null, 'Trail behind 3B on the throw line — backs up any errant throw from the catcher.'),
      C:   hold('C', 'Chase ball; throw to 3B'),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('cover-3b', 'Sprint to cover 3B; receive throw', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '3B':go('cover-3b', 'Cover 3B bag', false),
      LF:  go('lf-back-3b', 'Back up 3B', true, null, 'LF rotates behind 3B — backup for a wild throw from the catcher.'),
      CF:  hold('CF', 'Back up'),
      RF:  hold('RF', 'Back up'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 14 — GROUND BALLS WITH RUNNER ON 3B
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'gb-runner-3b-less-than-2-outs',
    title: 'Ground Ball — "Look Runner Back"',
    section: '14.1',
    baseState: { first: false, second: false, third: true },
    outs: '0-1',
    playType: 'ground_ball',
    ballDestination: 'gb-3b',
    ballDescription: 'Ground ball to third base — runner on 3B, fewer than 2 outs',
    coachNote: 'Infield plays at normal or drawn-in depth. Confirm with coach.',
    positions: {
      P:   hold('P', 'Field if ball comes to you; LOOK at runner on 3B briefly; throw to 1B (or home if runner breaks)'),
      C:   go('cover-home', 'Set up at home; be ready for tag if runner breaks', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '1B':hold('1B', 'Cover 1B; receive throw for out'),
      '2B':hold('2B', 'Cover 2B'),
      SS:  go('ss-backup-3b', 'Back up 3B; communicate runner\'s position', true, null, 'Trail behind 3B — communicates the runner\'s position and backs up any errant throw.'),
      '3B':hold('3B', 'Field ball if hit to 3B; look runner back; throw to 1B or home'),
      LF:  go('lf-back-3b', 'Back up 3B', false),
      CF:  go('cf-back-2b', 'Back up 2B area', false),
      RF:  go('rf-back-1b', 'Back up 1B', false),
    },
  },

  {
    id: 'gb-runner-3b-2-outs',
    title: 'Ground Ball — 2 Outs',
    section: '14.2',
    baseState: { first: false, second: false, third: true },
    outs: '2',
    playType: 'ground_ball',
    ballDestination: 'gb-ss',
    ballDescription: 'Ground ball to shortstop — runner on 3B, 2 outs',
    positions: {
      P:   hold('P', 'Field if ball comes to you; throw to 1B — get the out'),
      C:   go('cover-home', 'Cover home (runner will score; focus is on getting the 3rd out)', false),
      '1B':hold('1B', 'Cover 1B; receive throw'),
      '2B':hold('2B', 'Cover 2B'),
      SS:  hold('SS', 'Field if to SS; throw to 1B'),
      '3B':hold('3B', 'Field ball if to 3B; throw to 1B'),
      LF:  go('lf-back-3b', 'Back up 3B area', false),
      CF:  go('cf-back-2b', 'Back up 2B', false),
      RF:  go('rf-back-1b', 'Back up 1B', false),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 15 — GROUND BALLS, ADDITIONAL RUNNER COMBOS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'gb-runner-2b-less-than-2-outs',
    title: 'Ground Ball — Runner on 2B',
    section: '15.1',
    baseState: { first: false, second: true, third: false },
    outs: '0-1',
    playType: 'ground_ball',
    ballDestination: 'gb-ss',
    ballDescription: 'Ground ball to shortstop — runner on 2B, fewer than 2 outs',
    positions: {
      P:   hold('P', 'Field if ball comes to you; throw to 1B (runner on 2B has no force—cannot be thrown out on a routine grounder)'),
      C:   go('cover-home', 'Cover home; be ready if runner attempts to score on a wild throw', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '1B':hold('1B', 'Cover 1B; receive throw'),
      '2B':hold('2B', 'Cover 2B area'),
      SS:  hold('SS', 'Field ball; throw to 1B'),
      '3B':hold('3B', 'Field ball if to 3B; look at runner'),
      LF:  go('lf-back-3b', 'Back up 3B area', true, null, 'LF backs up 3B on the infield throw — stops any wild throw from letting the runner on 2B advance to 3B.'),
      CF:  go('cf-back-2b', 'Back up 2B', false),
      RF:  go('rf-back-1b', 'Back up 1B', true, null, 'RF sprints behind 1B on the throw — stops any overthrow from letting the batter-runner advance into scoring position.'),
    },
  },

  {
    id: 'gb-runners-1b-3b',
    title: 'Ground Ball — Runners on 1B & 3B',
    section: '15.2',
    baseState: { first: true, second: false, third: true },
    outs: '0-1',
    playType: 'ground_ball',
    ballDestination: 'gb-ss',
    ballDescription: 'Ground ball to shortstop — runners on 1B and 3B',
    coachNote: 'Going for the DP means the run on 3B likely scores. Confirm with coach.',
    positions: {
      P:   hold('P', 'Field if ball comes to you; look at runner on 3B; go for DP at 2B (or throw home if runner breaks)'),
      C:   go('cover-home', 'Cover home; call "Home!" if runner on 3B breaks early', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '1B':hold('1B', 'Cover 1B; receive final throw for DP'),
      '2B':go('cover-2b', 'Cover 2B; receive throw, pivot, relay to 1B', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      SS:  hold('SS', 'Field ball; throw to 2B for DP; call position of runner on 3B'),
      '3B':hold('3B', 'Field ball if to 3B; look at runner on 3B; throw to 2B'),
      LF:  go('lf-back-3b', 'Back up 3B', false),
      CF:  go('cf-back-2b', 'Back up 2B', false),
      RF:  go('rf-back-1b', 'Back up 1B', false),
    },
  },

  {
    id: 'gb-runners-2b-3b',
    title: 'Ground Ball — Runners on 2B & 3B',
    section: '15.3',
    baseState: { first: false, second: true, third: true },
    outs: '0-1',
    playType: 'ground_ball',
    ballDestination: 'gb-2b',
    ballDescription: 'Ground ball to second base — runners on 2B and 3B',
    positions: {
      P:   hold('P', 'Field if ball comes to you; look at runners; throw to 1B'),
      C:   go('cover-home', 'Cover home; be ready if runner on 3B breaks', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      '1B':hold('1B', 'Cover 1B; receive throw'),
      '2B':hold('2B', 'Field the ground ball; look at runners; throw to 1B'),
      SS:  go('cover-2b', 'Cover 2B — flow to the bag as 2B fields the ball', true, null, '2B fields the ball away from the bag; SS covers 2B in case of a play there.'),
      '3B':hold('3B', 'Hold at 3B; watch the runner'),
      LF:  go('lf-back-3b', 'Back up 3B', false),
      CF:  go('cf-back-2b', 'Back up 2B', false),
      RF:  go('rf-back-1b', 'Back up 1B', false),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 16 — FLY BALLS, ADDITIONAL SITUATIONS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'fly-runner-3b-tagup',
    title: 'Fly Ball — Runner on 3B (Tag-Up)',
    section: '16.1',
    baseState: { first: false, second: false, third: true },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'cf-right',
    ballDescription: 'Medium fly ball to right-center — caught by CF, runner on 3B tagging up to score',
    positions: {
      P:   go('p-backup-home', 'Sprint to back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home; prepare for tag play', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-cf-to-home', 'Move into relay between OF and home', true, 'cutoffHomeLFCF', 'Any outfield ball scores the runner from 3B — SS gets halfway between the outfielder and home to relay or cut the throw.'),
      '3B':hold('3B', 'Cover 3B; watch runner does not leave early'),
      LF:  hold('LF', 'Back up CF (or catch if ball to LF); throw toward relay/home'),
      CF:  hold('CF', 'Catch; throw to SS relay toward home'),
      RF:  hold('RF', 'Back up CF (or catch if ball to RF); throw toward relay/home'),
    },
  },

  {
    id: 'fly-runners-1b-3b',
    title: 'Fly Ball — Runners on 1B & 3B',
    section: '16.2',
    baseState: { first: true, second: false, third: true },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'cf-right',
    ballDescription: 'Medium fly ball to right-center — drops for a hit, runners on 1B and 3B tagging up',
    positions: {
      P:   go('p-backup-home', 'Back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-cf-to-home', 'Relay between OF and home', true, 'cutoffHomeLFCF', 'Any outfield ball scores the runner from 3B — SS gets halfway between the outfielder and home to relay or cut the throw.'),
      '3B':go('cover-3b', 'Cover 3B; watch both runners\' tag-up timing', false),
      LF:  hold('LF', 'Back up (or catch if to LF); throw toward home'),
      CF:  hold('CF', 'Catch; throw to SS relay toward home'),
      RF:  hold('RF', 'Back up (or catch if to RF); throw toward home'),
    },
  },

  {
    id: 'fly-bases-loaded',
    title: 'Fly Ball — Bases Loaded',
    section: '16.3',
    baseState: { first: true, second: true, third: true },
    outs: 'any',
    playType: 'fly_ball',
    ballDestination: 'cf-right',
    ballDescription: 'Medium fly ball to right-center — drops for a hit, bases loaded (all runners may tag up)',
    positions: {
      P:   go('p-backup-home', 'Back up home plate', true, null, 'Sprint behind home plate in line with the throw — stops any overthrow from letting the runner advance.'),
      C:   go('cover-home', 'Set up at home', false),
      '1B':hold('1B', 'Cover 1B'),
      '2B':go('cover-2b', 'Cover 2B', false),
      SS:  go('relay-cf-to-home', 'Relay between OF and home', true, 'cutoffHomeLFCF', 'Any outfield ball scores the runner from 3B — SS gets halfway between the outfielder and home to relay or cut the throw.'),
      '3B':go('cover-3b', 'Cover 3B', false),
      LF:  hold('LF', 'Back up or catch; throw toward home'),
      CF:  hold('CF', 'Catch; throw to relay toward home'),
      RF:  hold('RF', 'Back up or catch; throw toward home'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 17 — RUNDOWN
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'rundown-runner-3b',
    title: 'Rundown: Runner on 3B',
    section: '17.1',
    baseState: { first: false, second: false, third: true },
    outs: 'any',
    playType: 'rundown',
    ballDestination: 'home',
    ballDescription: 'Runner on 3B gets caught in a pickle — C chases the runner back toward 3B',
    positions: {
      P:   go('cover-home',      'Sprint to home plate; be ready to receive the throw and apply the tag', true, null, 'One fielder must always be at the plate in a rundown — P is closest and gets there first.'),
      C:   hold('C',             'Initiate the rundown; chase the runner toward 3B; throw to 3B when committed'),
      '1B':go('p-backup-home',   'Sprint in to back up home plate behind P', true, null, 'If P misses the catch or the runner breaks back to home, you stop the ball from rolling away.'),
      '2B':hold('2B',            'Stay near 2B; alert if other runners try to advance'),
      SS:  go('ss-backup-3b',    'Trail behind 3B on the throw-line extension to back up overthrows', true, null, 'Position behind 3B on the home→3B line extension — stops any wild throw from rolling into the outfield.'),
      '3B':hold('3B',            'Hold at 3B; receive the throw; apply the tag and run the runner back if needed'),
      LF:  go('lf-back-3b',      'Come in shallow to back up 3B from the outfield side', true, null, 'LF moves toward 3B as second line of defense — catches any overthrow that gets past SS.'),
      CF:  hold('CF',            'Hold position'),
      RF:  hold('RF',            'Hold position'),
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // SECTION 18 — CATCHER BACK-PICK
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'backpick-1b',
    title: 'Catcher Back-Pick to First',
    section: '18.1',
    baseState: { first: true, second: false, third: false },
    outs: 'any',
    playType: 'pickoff',
    ballDestination: '1b',
    ballDescription: 'Runner on 1B takes aggressive lead — catcher fires back to 1B after receiving pitch',
    positions: {
      P:   go('p-backup-1b', 'Sprint behind 1B to back up in case of overthrow', true, null, 'Back up behind 1B on throws from the left side — stops wild throws from going into the outfield.'),
      C:   hold('C', 'Receive pitch; if runner has big lead, fire to 1B'),
      '1B':hold('1B', 'Set up at inside corner of bag; receive throw; apply quick tag'),
      '2B':go('cover-2b', 'Cover 2B in case runner retreats or advances', true, null, 'Must be at the bag ready to receive the throw and apply the tag.'),
      SS:  hold('SS', 'Hold position'),
      '3B':hold('3B', 'Hold position'),
      LF:  hold('LF', 'Back up'),
      CF:  hold('CF', 'Back up'),
      RF:  go('rf-back-1b', 'Back up 1B in case of overthrow', false),
    },
  },
]

// Build a lookup by id
export const SITUATION_MAP = Object.fromEntries(SITUATIONS.map(s => [s.id, s]))

// Get all quiz-eligible positions for a situation (respecting coach decisions)
export function getQuizPositions(situation, teamConfig, myPosition = null) {
  const entries = Object.entries(situation.positions)

  if (myPosition) {
    const entry = situation.positions[myPosition]
    if (!entry) return []
    return [myPosition]
  }

  // Return positions marked quiz:true, resolved with coach config
  return entries
    .filter(([, val]) => val.quiz)
    .map(([pos]) => pos)
}

// Pick 2–3 random positions to test this round
export function pickRandomQuizPositions(situation, teamConfig, count = 3) {
  const eligible = getQuizPositions(situation, teamConfig)
  const shuffled = [...eligible].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
