export default function Home({ onNavigate, teamConfig, onSetTeamCode }) {
  function handleTeamCode() {
    const code = prompt('Enter your team code (or leave blank for defaults):')
    if (code !== null) onSetTeamCode(code.trim())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-8 gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-2">⚾</div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Baseball Situations</h1>
        <p className="text-gray-400 mt-1 text-sm">Study defensive plays and baserunning at home</p>
      </div>

      {/* Main mode cards */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={() => onNavigate('modeSelect')}
          className="w-full bg-green-700 hover:bg-green-600 active:bg-green-800 text-white rounded-2xl px-6 py-5 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <div className="font-bold text-lg">Defensive Quiz</div>
              <div className="text-green-200 text-sm">Drag players to the right spot</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('baserunning')}
          className="w-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white rounded-2xl px-6 py-5 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏃</span>
            <div>
              <div className="font-bold text-lg">Baserunning Quiz</div>
              <div className="text-blue-200 text-sm">Know when to run and when to hold</div>
            </div>
          </div>
        </button>
      </div>

      {/* Team & Coach section */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        <button
          onClick={handleTeamCode}
          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors"
        >
          <span>
            {teamConfig._code
              ? <><span className="text-green-400">✓</span> Team: <span className="font-mono font-bold">{teamConfig._code}</span></>
              : 'Enter Team Code'
            }
          </span>
          <span className="text-gray-500">→</span>
        </button>

        <button
          onClick={() => onNavigate('coach')}
          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors"
        >
          <span>⚙️ Coach Settings</span>
          <span className="text-gray-500">→</span>
        </button>
      </div>

      <p className="text-gray-600 text-xs text-center max-w-xs">
        Coaches: set your team's defensive system in Coach Settings, then share the team code with players.
      </p>
    </div>
  )
}
