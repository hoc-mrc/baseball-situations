import { useState } from 'react'
import { COACH_DECISIONS } from '../data/coachDefaults.js'

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

    // Generate shareable URL
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
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <label className="block text-sm font-bold text-gray-300 mb-2">Team Name / Code</label>
        <input
          type="text"
          value={teamName}
          onChange={e => { setTeamName(e.target.value); setSaved(false) }}
          placeholder="e.g. Cardinals 12U"
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Decision settings */}
      {Object.entries(COACH_DECISIONS).map(([key, decision]) => (
        <div key={key} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="font-bold text-white text-sm mb-1">{decision.label}</div>
          <div className="text-gray-400 text-xs mb-3">{decision.description}</div>
          <div className="flex flex-col gap-2">
            {decision.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleChange(key, opt.value)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                  decisions[key] === opt.value
                    ? 'bg-blue-700 border-blue-500 text-white font-semibold'
                    : 'bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {decisions[key] === opt.value && '✓ '}{opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Save + Share */}
      <div className="flex gap-2 pb-6">
        <button
          onClick={handleSave}
          className={`flex-1 font-bold py-3 rounded-xl transition-colors ${
            saved ? 'bg-green-700 text-green-200' : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
        <button
          onClick={handleCopyLink}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
        >
          📋 Copy Team Link
        </button>
      </div>
    </div>
  )
}
