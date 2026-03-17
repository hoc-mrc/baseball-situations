import { useState, useEffect } from 'react'
import Home from './pages/Home.jsx'
import ModeSelect from './pages/ModeSelect.jsx'
import DefensiveQuiz from './pages/DefensiveQuiz.jsx'
import BaserunningQuiz from './pages/BaserunningQuiz.jsx'
import Coach from './pages/Coach.jsx'
import { DEFAULT_TEAM_CONFIG } from './data/coachDefaults.js'

// Load team config from URL hash or localStorage
function loadConfig() {
  try {
    const hash = window.location.hash
    if (hash.startsWith('#config=')) {
      const encoded = hash.slice('#config='.length)
      const config = JSON.parse(atob(encoded))
      localStorage.setItem('teamConfig', JSON.stringify(config))
      // Clean hash from URL
      history.replaceState(null, '', window.location.pathname)
      return config
    }
    const stored = localStorage.getItem('teamConfig')
    if (stored) return JSON.parse(stored)
  } catch {}
  return { ...DEFAULT_TEAM_CONFIG }
}

function saveConfig(config) {
  localStorage.setItem('teamConfig', JSON.stringify(config))
}

export default function App() {
  const [screen, setScreen]       = useState('home')
  const [quizMode, setQuizMode]   = useState('random')
  const [myPosition, setMyPosition] = useState(null)
  const [teamConfig, setTeamConfig] = useState(() => loadConfig())

  // Apply team config from URL when hash changes (e.g. player taps coach's link)
  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash
      if (hash.startsWith('#config=')) {
        try {
          const encoded = hash.slice('#config='.length)
          const config = JSON.parse(atob(encoded))
          setTeamConfig(config)
          saveConfig(config)
          history.replaceState(null, '', window.location.pathname)
          alert(`Team settings loaded: ${config._code || 'your team'}`)
        } catch {}
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function handleSaveConfig(config) {
    setTeamConfig(config)
    saveConfig(config)
  }

  function handleSetTeamCode(code) {
    if (!code) return
    // Try to decode if it looks like a full config link
    try {
      if (code.includes('#config=')) {
        const encoded = code.split('#config=')[1]
        const config = JSON.parse(atob(encoded))
        handleSaveConfig(config)
        alert(`Team settings loaded: ${config._code || 'your team'}`)
        return
      }
    } catch {}
    // Otherwise just save as team name
    const config = { ...teamConfig, _code: code }
    handleSaveConfig(config)
  }

  function handleStartQuiz({ mode, position }) {
    setQuizMode(mode)
    setMyPosition(position)
    setScreen('quiz')
  }

  if (screen === 'home') {
    return (
      <Home
        onNavigate={setScreen}
        teamConfig={teamConfig}
        onSetTeamCode={handleSetTeamCode}
      />
    )
  }

  if (screen === 'modeSelect') {
    return (
      <ModeSelect
        onStart={handleStartQuiz}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'quiz') {
    return (
      <DefensiveQuiz
        mode={quizMode}
        myPosition={myPosition}
        teamConfig={teamConfig}
        onBack={() => setScreen('modeSelect')}
      />
    )
  }

  if (screen === 'baserunning') {
    return (
      <BaserunningQuiz
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'coach') {
    return (
      <Coach
        teamConfig={teamConfig}
        onSave={handleSaveConfig}
        onBack={() => setScreen('home')}
      />
    )
  }

  return null
}
