// Baserunning quiz — simple tap-to-answer format
// Each scenario has a situation, a question, and answer choices
// The "why" explanation is shown after answering

export const BASERUNNING_QUESTIONS = [
  // ── 2 OUTS RULE ────────────────────────────────────────────────────────
  {
    id: 'br-2-outs-grounder',
    category: '2 Outs',
    situation: 'You are on 1B. There are 2 outs. The batter hits a ground ball to the shortstop.',
    question: 'What do you do?',
    choices: [
      { id: 'run',  label: 'Run immediately', correct: true },
      { id: 'hold', label: 'Wait and see if it gets through', correct: false },
      { id: 'tag',  label: 'Tag up and wait', correct: false },
    ],
    explanation: 'With 2 outs, you always run on contact. The inning ends if the fielder catches the ball or throws you out at 1B anyway, so there\'s no reason to hold.',
  },
  {
    id: 'br-2-outs-fly-ball',
    category: '2 Outs',
    situation: 'You are on 2B. There are 2 outs. The batter hits a fly ball to center field.',
    question: 'What do you do?',
    choices: [
      { id: 'run',  label: 'Run immediately when the ball is hit', correct: true },
      { id: 'tag',  label: 'Tag up and wait for the catch', correct: false },
      { id: 'hold', label: 'Hold at 2B and see what happens', correct: false },
    ],
    explanation: 'With 2 outs, you run on contact — even on a fly ball. If it\'s caught, the inning ends anyway. If it drops in, you\'re already running and can score.',
  },

  // ── TAG-UP RULE ─────────────────────────────────────────────────────────
  {
    id: 'br-tag-up-deep-fly',
    category: 'Tag Up',
    situation: 'You are on 3B. There is 1 out. The batter hits a deep fly ball to left field.',
    question: 'What do you do?',
    choices: [
      { id: 'tag',  label: 'Tag up; go after the catch', correct: true },
      { id: 'run',  label: 'Run as soon as the ball is hit', correct: false },
      { id: 'hold', label: 'Hold at 3B', correct: false },
    ],
    explanation: 'With a runner on 3B and fewer than 2 outs, you tag up on a deep fly ball. Stay on the bag until the catch, then sprint home. On a deep ball you have a great chance to score.',
  },
  {
    id: 'br-tag-up-shallow-fly',
    category: 'Tag Up',
    situation: 'You are on 3B. There is 1 out. The batter hits a shallow fly ball to left field — the outfielder is charging in.',
    question: 'What do you do?',
    choices: [
      { id: 'hold', label: 'Hold at 3B — the throw would beat you', correct: true },
      { id: 'tag',  label: 'Tag up and try to score', correct: false },
      { id: 'run',  label: 'Run immediately', correct: false },
    ],
    explanation: 'On a shallow fly ball, the outfielder is close and can make a quick throw. Tagging up and trying to score is risky. Watch the coach\'s signal — on a shallow fly, hold unless the coach waves you home.',
  },
  {
    id: 'br-tag-up-2b',
    category: 'Tag Up',
    situation: 'You are on 2B. There is 0 outs. The batter hits a fly ball to right field.',
    question: 'What do you do?',
    choices: [
      { id: 'tag',  label: 'Tag up; try to advance to 3B after the catch', correct: true },
      { id: 'run',  label: 'Run when the ball is hit', correct: false },
      { id: 'hold', label: 'Hold at 2B no matter what', correct: false },
    ],
    explanation: 'With fewer than 2 outs, you must tag up on fly balls. On a ball to right field (the fielder is far from 3B), you can often advance to 3B after the catch. Read the depth of the fly ball and watch your 3B coach.',
  },

  // ── THE FORCE RULE ──────────────────────────────────────────────────────
  {
    id: 'br-no-force-2b-grounder-ss',
    category: 'Force Play',
    situation: 'You are on 2B. There is NO runner on 1B. There is 1 out. The batter hits a ground ball to the shortstop.',
    question: 'What do you do?',
    choices: [
      { id: 'hold', label: 'Hold at 2B — do NOT run', correct: true },
      { id: 'run',  label: 'Run to 3B immediately', correct: false },
      { id: 'tag',  label: 'Tag up and see if it\'s caught', correct: false },
    ],
    explanation: 'There is no force on you because 1B is empty. If you run to 3B, the SS can throw to 3B and tag you out. HOLD at 2B unless you are sure you can make it safely. This is one of the most common baserunning mistakes at this age.',
  },
  {
    id: 'br-force-2b-grounder-ss',
    category: 'Force Play',
    situation: 'You are on 2B. There IS a runner on 1B. There is 1 out. The batter hits a ground ball.',
    question: 'What do you do?',
    choices: [
      { id: 'run',  label: 'Run — you are forced to 3B', correct: true },
      { id: 'hold', label: 'Hold at 2B', correct: false },
      { id: 'tag',  label: 'Tag up', correct: false },
    ],
    explanation: 'With a runner on 1B, you are FORCED to advance to 3B on a ground ball. The runner on 1B must go to 2B, so you must go to 3B. Run hard!',
  },
  {
    id: 'br-force-1b-grounder',
    category: 'Force Play',
    situation: 'You are on 1B. The batter hits a ground ball anywhere in the infield.',
    question: 'What do you do?',
    choices: [
      { id: 'run',  label: 'Run — you are always forced to 2B', correct: true },
      { id: 'hold', label: 'Hold at 1B and see if it goes through', correct: false },
      { id: 'tag',  label: 'Tag up', correct: false },
    ],
    explanation: 'A runner on 1B is ALWAYS forced to 2B when the batter hits a ground ball. The batter-runner takes 1B, so you must advance. Run hard — and run wide to avoid the throw to 2B.',
  },

  // ── WILD PITCH / PASSED BALL ────────────────────────────────────────────
  {
    id: 'br-wp-runner-3b',
    category: 'Wild Pitch',
    situation: 'You are on 3B taking your secondary lead. There is 1 out. The pitch bounces hard away from the catcher and rolls toward the dugout.',
    question: 'What do you do?',
    choices: [
      { id: 'read',  label: 'Read the ball, look to your 3B coach — if they send you, commit fully and slide', correct: true },
      { id: 'run',   label: 'Break for home immediately without looking at the coach', correct: false },
      { id: 'hold',  label: 'Hold at 3B and wait for the next pitch', correct: false },
    ],
    explanation: 'On a wild pitch from 3B, you should already be in your secondary lead. Read how far the ball gets away and look to your 3B coach. If the coach sends you, commit fully — no hesitating halfway — and slide at home. Hesitating or stopping halfway is the worst outcome: you\'re caught in no man\'s land.',
  },
  {
    id: 'br-wp-runner-2b',
    category: 'Wild Pitch',
    situation: 'You are on 2B. There is 1 out. The pitch bounces away from the catcher.',
    question: 'What do you do?',
    choices: [
      { id: 'read', label: 'Read how far the ball goes — advance if it gets away far enough', correct: true },
      { id: 'run',  label: 'Always run to 3B immediately', correct: false },
      { id: 'hold', label: 'Never move on a wild pitch', correct: false },
    ],
    explanation: 'On a wild pitch with a runner on 2B, read how far the ball travels. If it rolls far enough, you can advance to 3B. If it stays close, hold — the catcher can recover and throw to 3B. Watch your 3B coach.',
  },

  // ── READING THE OUTFIELD ────────────────────────────────────────────────
  {
    id: 'br-line-drive-hold',
    category: 'Reading the Ball',
    situation: 'You are on 1B. The batter hits a hard line drive right at the left fielder.',
    question: 'What do you do?',
    choices: [
      { id: 'hold', label: 'Freeze — wait to see if it\'s caught', correct: true },
      { id: 'run',  label: 'Run immediately to 2B', correct: false },
      { id: 'tag',  label: 'Tag up right away', correct: false },
    ],
    explanation: 'On a line drive, FREEZE until you know if it\'s caught. If you run and the fielder catches it, they can throw to 1B for an easy double play. If you hold and it drops in, you can still advance.',
  },
  {
    id: 'br-line-drive-gaps',
    category: 'Reading the Ball',
    situation: 'You are on 1B with 1 out. The batter hits a line drive into the gap in left-center — it\'s clearly going to fall in.',
    question: 'What do you do?',
    choices: [
      { id: 'run',  label: 'Run hard — you should score or get to 3B easily', correct: true },
      { id: 'hold', label: 'Stop at 2B and wait', correct: false },
      { id: 'tag',  label: 'Tag up at 1B', correct: false },
    ],
    explanation: 'A ball in the gap is a base hit for sure. Run hard! A runner on 1B on a hit to the gap should be thinking about scoring (or at minimum reaching 3B). Read the ball and run as hard as you can.',
  },
]

export const BASERUNNING_CATEGORIES = [
  '2 Outs',
  'Tag Up',
  'Force Play',
  'Wild Pitch',
  'Reading the Ball',
]
