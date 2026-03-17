// Default coaching decisions (most common for youth baseball)
// Coaches can override these via the /coach page

export const COACH_DECISIONS = {
  cutoffHomeLFCF: {
    label: 'Cut-off to home from LF / CF',
    description: 'Who serves as relay/cut-off on throws from left or center field toward home?',
    options: [
      { value: 'ss',      label: 'Shortstop (most common)' },
      { value: 'pitcher', label: 'Pitcher' },
      { value: '3b',      label: 'Third Baseman' },
    ],
    default: 'ss',
  },
  cutoffHomeRF: {
    label: 'Cut-off to home from RF',
    description: 'Who serves as relay/cut-off on throws from right field toward home?',
    options: [
      { value: '1b',      label: 'First Baseman (most common)' },
      { value: '2b',      label: 'Second Baseman' },
      { value: 'pitcher', label: 'Pitcher' },
    ],
    default: '1b',
  },
  stealCoverage2B: {
    label: 'Who covers 2B on a steal?',
    description: 'Which player covers 2B when a runner steals?',
    options: [
      { value: 'ss-always',  label: 'Shortstop always (recommended for youth)' },
      { value: 'handedness', label: 'SS on RHB, 2B on LHB (traditional)' },
      { value: 'signal',     label: 'Signal system (coach/catcher calls it)' },
    ],
    default: 'ss-always',
  },
  dpCoverage2B: {
    label: 'Who covers 2B on double plays?',
    description: 'Which player covers 2B to receive the first throw on a double play?',
    options: [
      { value: 'ss-always',    label: 'Shortstop always (recommended for youth)' },
      { value: 'traditional',  label: 'Traditional split: SS on right-side balls, 2B on left-side balls' },
    ],
    default: 'ss-always',
  },
  buntRotation1B: {
    label: 'Bunt rotation — runner on 1B',
    description: 'Which players charge on a bunt with a runner on 1B?',
    options: [
      { value: 'p-1b-3b', label: 'P + 1B + 3B all charge (2B covers 1B)' },
      { value: 'p-3b',    label: 'P + 3B charge, 1B stays at bag' },
    ],
    default: 'p-1b-3b',
  },
  buntDefault: {
    label: 'Bunt default throw target',
    description: 'When fielding a bunt with a runner on 1B, what is the default throw?',
    options: [
      { value: 'lead-runner', label: 'Try to get the lead runner (2B)' },
      { value: '1b',          label: 'Always take the sure out at 1B' },
    ],
    default: 'lead-runner',
  },
  basesLoadedPriority: {
    label: 'Ground ball — bases loaded priority',
    description: 'On a ground ball with bases loaded, where does the infielder throw first?',
    options: [
      { value: 'home-dp', label: 'Home for force out, relay to 1B for DP' },
      { value: '3b-1b',   label: 'Third base for force out, relay to 1B' },
      { value: 'sure-1b', label: 'Take the sure out at 1B (conservative)' },
    ],
    default: 'home-dp',
  },
  firstThirdDefense: {
    label: 'First & Third steal defense',
    description: 'How does your team defend the first-and-third steal situation?',
    options: [
      { value: 'throw-p',       label: 'Catcher throws to Pitcher (P cuts and reads)' },
      { value: 'throw-through', label: 'Catcher throws through to 2B' },
      { value: 'fake-look',     label: 'Catcher fakes throw to 2B, looks at 3B' },
      { value: 'throw-ss',      label: 'Catcher throws to SS (SS cuts if 3B runner breaks)' },
    ],
    default: 'throw-p',
  },
}

export const DEFAULT_TEAM_CONFIG = Object.fromEntries(
  Object.entries(COACH_DECISIONS).map(([key, val]) => [key, val.default])
)
