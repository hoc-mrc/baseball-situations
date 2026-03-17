import { useState, useCallback, useEffect } from 'react'
import Field, { DEFAULT_POSITIONS } from '../components/Field.jsx'
import Scoreboard from '../components/Scoreboard.jsx'
import Feedback, { AllPositionsModal } from '../components/Feedback.jsx'
import { SITUATIONS, pickRandomQuizPositions } from '../data/situations.js'
import { ZONES } from '../data/zones.js'

function shuffleAndCycle(arr) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled
}

const PLAY_TYPE_ICONS = {
  fly_ball:    '🔵',
  ground_ball: '⚡',
  single:      '📍',
  steal:       '🏃',
  bunt:        '🎯',
  wild_pitch:  '💥',
  pickoff:     '🎣',
}

export default function DefensiveQuiz({ mode = 'random', myPosition = null, teamConfig, onBack, onScoreUpdate }) {
  const [queue, setQueue]                   = useState(() => shuffleAndCycle(SITUATIONS))
  const [currentIndex, setCurrentIndex]     = useState(0)
  const [quizPositions, setQuizPositions]   = useState([])
  const [playerPositions, setPlayerPositions] = useState({})
  const [answered, setAnswered]             = useState(false)
  const [showAllModal, setShowAllModal]     = useState(false)
  const [score, setScore]                   = useState(0)
  const [situationNum, setSituationNum]     = useState(1)
  const [correctCount, setCorrectCount]     = useState(0)
  const [totalAnswered, setTotalAnswered]   = useState(0)

  const situation = queue[currentIndex % queue.length]

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
    quizPositions.forEach(pos => {
      const zoneName = situation.positions[pos]?.zone
      if (!zoneName) return
      const zone = ZONES[zoneName]
      if (!zone) return
      const { x, y } = playerPositions[pos] || DEFAULT_POSITIONS[pos]
      const dx = x - zone.x
      const dy = y - zone.y
      if (Math.sqrt(dx * dx + dy * dy) <= zone.r) gained++
    })
    setScore(s => s + gained)
    setCorrectCount(c => c + gained)
    setTotalAnswered(t => t + quizPositions.length)
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

  // Has the player placed all quiz positions away from default?
  const allMoved = quizPositions.every(pos => {
    const curr = playerPositions[pos]
    const def  = DEFAULT_POSITIONS[pos]
    if (!curr) return false
    const dx = curr.x - def.x
    const dy = curr.y - def.y
    return Math.sqrt(dx * dx + dy * dy) > 8
  })

  const icon = PLAY_TYPE_ICONS[situation.playType] || '⚾'

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto px-3 py-3 gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xl px-1">←</button>
        <span className="text-gray-400 text-xs font-mono">
          {mode === 'position' ? `MY POSITION: ${myPosition}` : 'RANDOM MODE'}
        </span>
        <div className="text-yellow-400 font-bold text-sm">⭐ {score}</div>
      </div>

      {/* Scoreboard */}
      <Scoreboard
        baseState={situation.baseState}
        outs={0}
        situationNum={situationNum}
        total={SITUATIONS.length}
        score={score}
      />

      {/* Situation description */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
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
            ? <>Drag <span className="text-yellow-300 font-bold">{myPosition}</span> to the correct position</>
            : <>Drag the <span className="text-yellow-300 font-bold">highlighted players</span> ({quizPositions.join(', ')}) to their correct spots</>
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
      />

      {/* Action area */}
      {!answered ? (
        <button
          onClick={handleCheck}
          className={`w-full font-bold py-3.5 rounded-xl text-base transition-all ${
            allMoved
              ? 'bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200'
              : 'bg-gray-700 text-gray-400 cursor-default'
          }`}
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
      <div className="w-full bg-gray-800 rounded-full h-1">
        <div
          className="bg-green-500 h-1 rounded-full transition-all"
          style={{ width: `${totalAnswered > 0 ? Math.min(100, (correctCount / totalAnswered) * 100) : 0}%` }}
        />
      </div>
    </div>
  )
}
