import { useState, useCallback, useEffect } from 'react'
import Field, { DEFAULT_POSITIONS } from '../components/Field.jsx'
import Scoreboard from '../components/Scoreboard.jsx'
import Feedback, { AllPositionsModal } from '../components/Feedback.jsx'
import { SITUATIONS, pickRandomQuizPositions } from '../data/situations.js'
import { ZONES } from '../data/zones.js'

function pickTen(arr) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, 10)
}

const PLAY_TYPE_ICONS = {
  fly_ball:    '🔵',
  ground_ball: '⚡',
  single:      '📍',
  steal:       '🏃',
  bunt:        '🎯',
  wild_pitch:  '💥',
  pickoff:     '🎣',
  rundown:     '↔️',
}

export default function DefensiveQuiz({ mode = 'random', myPosition = null, teamConfig, onBack, onScoreUpdate }) {
  const [queue, setQueue]                   = useState(() => pickTen(SITUATIONS))
  const [currentIndex, setCurrentIndex]     = useState(0)
  const [quizPositions, setQuizPositions]   = useState([])
  const [playerPositions, setPlayerPositions] = useState({})
  const [answered, setAnswered]             = useState(false)
  const [showAllModal, setShowAllModal]     = useState(false)
  const [score, setScore]                   = useState(0)
  const [situationNum, setSituationNum]     = useState(1)
  const [correctCount, setCorrectCount]     = useState(0)
  const [totalAnswered, setTotalAnswered]   = useState(0)
  const [wrongSituations, setWrongSituations] = useState([]) // { situation, wrongPositions }

  const sessionDone = currentIndex >= queue.length
  const situation = queue[Math.min(currentIndex, queue.length - 1)]

  // Load a new situation
  const loadSituation = useCallback((sit, pos, teamCfg) => {
    // Reset player positions to defaults
    setPlayerPositions({ ...DEFAULT_POSITIONS })
    setAnswered(false)
    setShowAllModal(false)

    if (mode === 'position' && pos) {
      setQuizPositions([pos])
    } else {
      const picked = pickRandomQuizPositions(sit, teamCfg, 3)
      setQuizPositions(picked.length > 0 ? picked : ['SS'])
    }
  }, [mode])

  useEffect(() => {
    loadSituation(situation, myPosition, teamConfig)
  }, [currentIndex]) // eslint-disable-line

  const handlePositionChange = useCallback((pos, x, y) => {
    setPlayerPositions(prev => ({ ...prev, [pos]: { x, y } }))
  }, [])

  function handleCheck() {
    setAnswered(true)
    // Score: +1 per correct position
    let gained = 0
    const wrongPositions = []
    quizPositions.forEach(pos => {
      const zoneName = situation.positions[pos]?.zone
      if (!zoneName) return
      const zone = ZONES[zoneName]
      if (!zone) return
      const { x, y } = playerPositions[pos] || DEFAULT_POSITIONS[pos]
      const dx = x - zone.x
      const dy = y - zone.y
      if (Math.sqrt(dx * dx + dy * dy) <= zone.r) {
        gained++
      } else {
        wrongPositions.push(pos)
      }
    })
    setScore(s => s + gained)
    setCorrectCount(c => c + gained)
    setTotalAnswered(t => t + quizPositions.length)
    if (wrongPositions.length > 0) {
      setWrongSituations(prev => [...prev, { situation, wrongPositions }])
    }
  }

  function handleNext() {
    setCurrentIndex(i => i + 1)
    setSituationNum(n => n + 1)
  }

  // Build correctZones map (resolved with team config for coach-decision positions)
  function buildCorrectZones() {
    const zones = {}
    quizPositions.forEach(pos => {
      const posData = situation.positions[pos]
      if (!posData) return
      zones[pos] = posData.zone
    })
    return zones
  }

  const correctZones = buildCorrectZones()

  // Has the player placed all quiz positions? A position counts as ready if:
  // (a) it's been dragged >8px from default, OR
  // (b) its default position is already inside the correct zone (no drag needed)
  const allMoved = quizPositions.every(pos => {
    const curr = playerPositions[pos]
    const def  = DEFAULT_POSITIONS[pos]
    if (!curr) return false
    const dx = curr.x - def.x
    const dy = curr.y - def.y
    if (Math.sqrt(dx * dx + dy * dy) > 8) return true
    // Check if default is already within the correct zone
    const zoneName = correctZones[pos]
    if (!zoneName) return false
    const zone = ZONES[zoneName]
    if (!zone) return false
    const zDx = def.x - zone.x
    const zDy = def.y - zone.y
    return Math.sqrt(zDx * zDx + zDy * zDy) <= zone.r
  })

  const icon = PLAY_TYPE_ICONS[situation.playType] || '⚾'

  if (sessionDone) {
    const pct = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0
    return (
      <div className="flex flex-col min-h-dvh max-w-lg mx-auto px-3 py-4 gap-4">
        <div className="text-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-white text-2xl font-bold">Session Complete!</div>
          <div className="text-gray-300 text-lg mt-1">{correctCount} / {totalAnswered} correct ({pct}%)</div>
          <div className="text-gray-400 text-sm">Score: {score} points</div>
        </div>

        {/* Wrong answer review */}
        {wrongSituations.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-orange-400 font-bold text-sm">Review for next time:</div>
            {wrongSituations.map(({ situation: sit, wrongPositions }, i) => (
              <div key={i} className="rounded-xl px-3 py-2" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
                <div className="text-white font-semibold text-sm mb-1.5">{sit.title}</div>
                {wrongPositions.map(pos => (
                  <div key={pos} className="flex items-start gap-2 mt-1">
                    <span className="text-xs bg-red-700 rounded px-1.5 py-0.5 font-bold text-white min-w-[28px] text-center shrink-0">{pos}</span>
                    <span className="text-gray-300 text-xs">{sit.positions[pos]?.description}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {wrongSituations.length === 0 && (
          <div className="text-green-400 text-center font-bold">Perfect session! 🎉</div>
        )}

        <div className="flex flex-col gap-3 mt-2">
          <button
            onClick={() => {
              setQueue(pickTen(SITUATIONS))
              setCurrentIndex(0)
              setSituationNum(1)
              setScore(0)
              setCorrectCount(0)
              setTotalAnswered(0)
              setWrongSituations([])
            }}
            className="w-full text-white font-bold py-3 rounded-xl text-base transition-all active:scale-95"
            style={{ background: '#e91e8c', boxShadow: '0 0 16px rgba(233,30,140,0.35)' }}
          >
            Play Again
          </button>
          <button
            onClick={onBack}
            className="w-full font-bold py-3 rounded-xl text-base text-gray-300 hover:brightness-125"
            style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto px-3 py-3 gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xl px-1">←</button>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#e91e8c' }}>
          {mode === 'position' ? `My Position: ${myPosition}` : 'Random Mode'}
        </span>
        <div className="text-yellow-400 font-bold text-sm">⭐ {score}</div>
      </div>

      {/* Scoreboard */}
      <Scoreboard
        baseState={situation.baseState}
        outs={situation.outs === '2' ? 2 : situation.outs === '0-1' ? 1 : 0}
        situationNum={situationNum}
        total={queue.length}
        score={score}
      />

      {/* Situation description */}
      <div className="rounded-xl px-4 py-3" style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
        <div className="flex items-start gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="text-white font-bold text-sm">{situation.title}</div>
            <div className="text-gray-400 text-sm mt-0.5">{situation.ballDescription}</div>
            {situation.outs === '0-1' && (
              <div className="text-orange-400 text-xs mt-1 font-semibold">⚠ Fewer than 2 outs</div>
            )}
            {situation.outs === '2' && (
              <div className="text-red-400 text-xs mt-1 font-semibold">⚠ 2 outs</div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz prompt */}
      {!answered && (
        <div className="text-center text-sm text-gray-300">
          {mode === 'position'
            ? <>Tap or drag <span className="font-bold" style={{ color: '#b5f23d' }}>{myPosition}</span> to the correct position</>
            : <>Tap a <span className="font-bold" style={{ color: '#b5f23d' }}>highlighted player</span> ({quizPositions.join(', ')}), then tap their spot — or drag</>
          }
        </div>
      )}

      {/* Field */}
      <Field
        quizPositions={quizPositions}
        playerPositions={playerPositions}
        onPositionChange={handlePositionChange}
        answered={answered}
        correctZones={correctZones}
        baseState={situation.baseState}
        myPosition={mode === 'position' ? myPosition : null}
        ballDestination={situation.ballDestination}
        playType={situation.playType}
      />

      {/* Action area */}
      {!answered ? (
        <button
          onClick={handleCheck}
          className="w-full font-bold py-3.5 rounded-xl text-base transition-all active:scale-95"
          style={allMoved
            ? { background: '#b5f23d', color: '#0d0d0f', boxShadow: '0 0 16px rgba(181,242,61,0.35)' }
            : { background: '#1a1a2e', color: '#6b7280', cursor: 'default', border: '1px solid #2d2d4e' }
          }
          disabled={!allMoved}
        >
          {allMoved ? 'Check Answer' : 'Drag players to their positions'}
        </button>
      ) : (
        <Feedback
          situation={situation}
          quizPositions={quizPositions}
          playerPositions={playerPositions}
          correctZones={correctZones}
          onNext={handleNext}
          onShowAll={() => setShowAllModal(true)}
        />
      )}

      {/* All positions modal */}
      {showAllModal && (
        <AllPositionsModal
          situation={situation}
          onClose={() => setShowAllModal(false)}
        />
      )}

      {/* Progress bar */}
      <div className="w-full rounded-full h-1" style={{ background: '#1a1a2e' }}>
        <div
          className="h-1 rounded-full transition-all"
          style={{ width: `${totalAnswered > 0 ? Math.min(100, (correctCount / totalAnswered) * 100) : 0}%`, background: '#b5f23d' }}
        />
      </div>
    </div>
  )
}
