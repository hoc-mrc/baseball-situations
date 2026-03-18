import { useState } from 'react'
import { COACH_DECISIONS } from '../data/coachDefaults.js'

const CARD = { background: '#1a1a2e', border: '1px solid #2d2d4e' }
const BTN_PRIMARY = { background: '#e91e8c', boxShadow: '0 0 16px rgba(233,30,140,0.35)' }

export default function Coach({ teamConfig, onSave, onBack }) {
  const [decisions, setDecisions] = useState({ ...teamConfig })
  const [saved, setSaved]         = useState(false)
  const [teamName, setTeamName]   = useState(teamConfig._code || '')

  function handleChange(key, value) {
    setDecisions(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave() {
    const config = { ...decisions, _code: teamName }
    onSave(config)
    setSaved(true)

    const encoded = btoa(JSON.stringify(config))
    const url = `${window.location.origin}${window.location.pathname}#config=${encoded}`
    navigator.clipboard?.writeText(url).catch(() => {})
  }

  function handleCopyLink() {
    const encoded = btoa(JSON.stringify({ ...decisions, _code: teamName }))
    const url = `${window.location.origin}${window.location.pathname}#config=${encoded}`
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard! Share it with your players.')
    }).catch(() => {
      prompt('Copy this link and share with your players:', url)
    })
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto px-4 py-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xl">←</button>
        <h2 className="text-xl font-bold text-white">⚙️ Coach Settings</h2>
      </div>

      <p className="text-gray-400 text-sm">
        Set your team's defensive system. These choices affect which answers are marked correct in the quiz.
      </p>

      {/* Team name / code */}
      <div className="rounded-xl p-4" style={CARD}>
        <label className="block text-sm font-bold text-gray-300 mb-2">Team Name / Code</label>
        <input
          type="text"
          value={teamName}
          onChange={e => { setTeamName(e.target.value); setSaved(false) }}
          placeholder="e.g. Cardinals 12U"
          className="w-full rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none"
          style={{ background: '#0d0d0f', border: '1px solid #2d2d4e' }}
        />
      </div>

      {/* Decision settings */}
      {Object.entries(COACH_DECISIONS).map(([key, decision]) => (
        <div key={key} className="rounded-xl p-4" style={CARD}>
          <div className="font-bold text-white text-sm mb-1">{decision.label}</div>
          <div className="text-gray-400 text-xs mb-3">{decision.description}</div>
          <div className="flex flex-col gap-2">
            {decision.options.map(opt => {
              const isSelected = decisions[key] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleChange(key, opt.value)}
                  className="text-left px-3 py-2 rounded-lg text-sm transition-all"
                  style={isSelected
                    ? { background: '#e91e8c', border: '1px solid #e91e8c', color: 'white', fontWeight: 600 }
                    : { background: '#0d0d0f', border: '1px solid #2d2d4e', color: '#d1d5db' }
                  }
                >
                  {isSelected && '✓ '}{opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Save + Share */}
      <div className="flex gap-2 pb-6">
        <button
          onClick={handleSave}
          className="flex-1 font-bold py-3 rounded-xl transition-all active:scale-95 text-white"
          style={saved
            ? { background: '#15803d', border: '1px solid #16a34a' }
            : BTN_PRIMARY
          }
        >
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
        <button
          onClick={handleCopyLink}
          className="flex-1 font-bold py-3 rounded-xl transition-colors text-gray-300 hover:brightness-125"
          style={CARD}
        >
          📋 Copy Team Link
        </button>
      </div>
    </div>
  )
}
