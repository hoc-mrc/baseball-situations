import { ZONES } from '../data/zones.js'
import { DEFAULT_POSITIONS } from './Field.jsx'

function checkCorrect(pos, playerPositions, correctZones) {
  const zoneName = correctZones[pos]
  if (!zoneName) return null
  const zone = ZONES[zoneName]
  if (!zone) return null
  const { x, y } = playerPositions[pos] || DEFAULT_POSITIONS[pos]
  const dx = x - zone.x
  const dy = y - zone.y
  return Math.sqrt(dx * dx + dy * dy) <= zone.r
}

function getRuleTip(zoneName) {
  if (!zoneName) return null
  if (zoneName.startsWith('relay-')) return '💡 Relay: position halfway between the ball and the throw target'
  if (zoneName.startsWith('p-backup-') || zoneName.startsWith('ss-backup-') || zoneName.includes('-back-')) return '💡 Backup: get behind the target on the throw line extension'
  if (zoneName.startsWith('cover-')) return '💡 Coverage: get to the base'
  if (zoneName.startsWith('charge-bunt-')) return '💡 Charge: attack the bunt aggressively'
  return null
}

export default function Feedback({ situation, quizPositions, playerPositions, correctZones, onNext, onShowAll }) {
  if (!situation) return null

  const results = quizPositions.map(pos => ({
    pos,
    correct: checkCorrect(pos, playerPositions, correctZones),
    description: situation.positions[pos]?.description || '',
    reason: situation.positions[pos]?.reason || '',
    zoneName: correctZones[pos] || '',
  }))

  const allCorrect = results.every(r => r.correct)
  const numCorrect = results.filter(r => r.correct).length

  return (
    <div className="flex flex-col gap-3">
      {/* Result header */}
      <div className={`rounded-xl p-3 text-center font-bold text-lg ${allCorrect ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-orange-900/40 text-orange-300 border border-orange-700'}`}>
        {allCorrect
          ? '✓ Nice work!'
          : `${numCorrect} of ${quizPositions.length} correct`}
      </div>

      {/* Per-position results */}
      <div className="flex flex-col gap-2">
        {results.map(({ pos, correct, description, reason, zoneName }) => {
          const tip = !correct ? getRuleTip(zoneName) : null
          return (
            <div
              key={pos}
              className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${correct ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}
            >
              <span className={`font-bold text-xs mt-0.5 min-w-[28px] text-center rounded px-1 py-0.5 ${correct ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
                {pos}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className={correct ? 'text-green-200' : 'text-red-200'}>
                  {correct ? '✓ ' : '✗ '}{description}
                </span>
                {reason && (
                  <span className="text-gray-400 text-xs italic">{reason}</span>
                )}
                {tip && (
                  <span className="text-yellow-400 text-xs mt-0.5">{tip}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Show all positions link */}
      <button
        onClick={onShowAll}
        className="text-xs text-gray-400 underline underline-offset-2 text-center py-1 hover:text-gray-200"
      >
        Show all 9 positions for this play
      </button>

      {/* Coach note if present */}
      {situation.coachNote && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg px-3 py-2 text-xs text-yellow-300">
          <span className="font-bold">⚠ Coach Decision: </span>{situation.coachNote}
        </div>
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        className="w-full text-white font-bold py-3 rounded-xl text-base transition-all active:scale-95"
        style={{ background: '#e91e8c', boxShadow: '0 0 16px rgba(233,30,140,0.35)' }}
      >
        Next Situation →
      </button>
    </div>
  )
}

// Modal to show all 9 positions
export function AllPositionsModal({ situation, onClose }) {
  if (!situation) return null
  const ALL_POS = ['P', 'C', '1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF']
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div
        className="rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-4"
        style={{ background: '#0d0d0f', border: '1px solid #2d2d4e' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-bold text-white mb-3 text-center">{situation.title} — All Positions</h3>
        <p className="text-xs text-gray-400 mb-3 text-center">{situation.ballDescription}</p>
        <div className="flex flex-col gap-1.5">
          {ALL_POS.map(pos => {
            const posData = situation.positions[pos]
            if (!posData) return null
            return (
              <div key={pos} className="flex flex-col gap-0.5 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-xs rounded px-1.5 py-0.5 min-w-[28px] text-center text-gray-200 mt-0.5" style={{ background: '#2d2d4e' }}>{pos}</span>
                  <span className="text-gray-300">{posData.description}</span>
                  {posData.coachDecision && <span className="text-yellow-400 text-xs ml-auto shrink-0">⚠️</span>}
                </div>
                {posData.reason && (
                  <span className="text-gray-500 text-xs italic ml-10">{posData.reason}</span>
                )}
              </div>
            )
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-white rounded-xl py-2 font-bold transition-colors hover:brightness-125"
          style={{ background: '#1a1a2e' }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
