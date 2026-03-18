export default function Home({ onNavigate, teamConfig, onSetTeamCode }) {
  function handleTeamCode() {
    const code = prompt('Enter your team code (or leave blank for defaults):')
    if (code !== null) onSetTeamCode(code.trim())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-10 gap-8" style={{ background: '#0d0d0f' }}>

      {/* Hero */}
      <div className="text-center flex flex-col items-center gap-3">
        {/* Baseball graphic */}
        <div className="relative mb-1">
          <div
            className="text-7xl"
            style={{ filter: 'drop-shadow(0 0 18px rgba(233, 30, 140, 0.6))' }}
          >
            ⚾
          </div>
        </div>

        {/* Title */}
        <div style={{ fontFamily: "'Nunito', sans-serif" }}>
          <div className="text-4xl font-black text-white leading-none tracking-tight">
            BASEBALL
          </div>
          <div
            className="text-4xl font-black leading-none tracking-tight"
            style={{ color: '#e91e8c' }}
          >
            SITUATIONS
          </div>
        </div>

        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          Study defensive plays and baserunning at home
        </p>
      </div>

      {/* Main mode buttons */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        <button
          onClick={() => onNavigate('modeSelect')}
          className="w-full rounded-2xl px-6 py-5 text-center transition-all active:scale-95"
          style={{
            background: '#e91e8c',
            boxShadow: '0 0 24px rgba(233, 30, 140, 0.45)',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <div className="font-black text-2xl text-white leading-tight">Defensive Quiz</div>
          <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Drag players to the right spot
          </div>
        </button>

        <button
          onClick={() => onNavigate('baserunning')}
          className="w-full rounded-2xl px-6 py-5 text-center transition-all active:scale-95"
          style={{
            background: '#b5f23d',
            boxShadow: '0 0 24px rgba(181, 242, 61, 0.35)',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <div className="font-black text-2xl leading-tight" style={{ color: '#0d0d0f' }}>
            Baserunning Quiz
          </div>
          <div className="text-sm mt-1" style={{ color: 'rgba(13,13,15,0.6)' }}>
            Know when to run and when to hold
          </div>
        </button>
      </div>

      {/* Team & Coach section */}
      <div className="w-full max-w-sm flex flex-col gap-2">
        <button
          onClick={handleTeamCode}
          className="w-full rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors"
          style={{ background: '#1a1a2e', border: '1px solid #2d2d4e', color: '#94a3b8' }}
        >
          <span>
            {teamConfig._code
              ? <><span style={{ color: '#b5f23d' }}>✓</span> Team: <span className="font-mono font-bold text-white">{teamConfig._code}</span></>
              : 'Enter Team Code'
            }
          </span>
          <span style={{ color: '#4a4a6a' }}>→</span>
        </button>

        <button
          onClick={() => onNavigate('coach')}
          className="w-full rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors"
          style={{ background: '#1a1a2e', border: '1px solid #2d2d4e', color: '#94a3b8' }}
        >
          <span>⚙️ Coach Settings</span>
          <span style={{ color: '#4a4a6a' }}>→</span>
        </button>
      </div>

      <p className="text-xs text-center max-w-xs" style={{ color: '#374151' }}>
        Coaches: set your team's defensive system in Coach Settings, then share the team code with players.
      </p>
    </div>
  )
}
