const POSITIONS = ['P', 'C', '1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF']

const POSITION_NAMES = {
  P: 'Pitcher', C: 'Catcher', '1B': 'First Base', '2B': 'Second Base',
  SS: 'Shortstop', '3B': 'Third Base', LF: 'Left Field', CF: 'Center Field', RF: 'Right Field',
}

const CARD = { background: '#1a1a2e', border: '1px solid #2d2d4e' }
const BTN_PRIMARY = { background: '#e91e8c', boxShadow: '0 0 16px rgba(233,30,140,0.35)' }
const BTN_GRID = { background: '#16213e', border: '1px solid #2d2d4e' }

export default function ModeSelect({ onStart, onBack }) {
  return (
    <div className="flex flex-col min-h-dvh px-4 py-6 gap-6 max-w-sm mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xl">←</button>
        <h2 className="text-xl font-bold text-white">Defensive Quiz</h2>
      </div>

      {/* Mode A: Random positions */}
      <div className="rounded-2xl p-5" style={CARD}>
        <h3 className="font-bold text-white text-base mb-1">Random Positions Mode</h3>
        <p className="text-gray-400 text-sm mb-4">
          Each play, 2–3 randomly chosen positions are tested. Great for learning the whole field.
        </p>
        <button
          onClick={() => onStart({ mode: 'random', position: null })}
          className="w-full text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          style={BTN_PRIMARY}
        >
          Start Random Quiz
        </button>
      </div>

      {/* Mode B: My position */}
      <div className="rounded-2xl p-5" style={CARD}>
        <h3 className="font-bold text-white text-base mb-1">My Position Mode</h3>
        <p className="text-gray-400 text-sm mb-4">
          Choose your position and only study what YOU do on each play.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => onStart({ mode: 'position', position: pos })}
              className="text-white rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 hover:brightness-125"
              style={BTN_GRID}
            >
              <div className="text-base">{pos}</div>
              <div className="text-gray-400 text-xs font-normal truncate px-1">{POSITION_NAMES[pos].split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
