import { useState } from 'react'
import { BASERUNNING_QUESTIONS } from '../data/baserunning.js'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

const CATEGORY_COLORS = {
  '2 Outs':           'bg-red-900/40 border-red-700 text-red-300',
  'Tag Up':           'bg-blue-900/40 border-blue-700 text-blue-300',
  'Force Play':       'bg-purple-900/40 border-purple-700 text-purple-300',
  'Wild Pitch':       'bg-orange-900/40 border-orange-700 text-orange-300',
  'Reading the Ball': 'bg-teal-900/40 border-teal-700 text-teal-300',
}

const CARD = { background: '#1a1a2e', border: '1px solid #2d2d4e' }
const BTN_PRIMARY = { background: '#e91e8c', boxShadow: '0 0 16px rgba(233,30,140,0.35)' }

export default function BaserunningQuiz({ onBack }) {
  const [queue]                = useState(() => shuffle(BASERUNNING_QUESTIONS))
  const [index, setIndex]      = useState(0)
  const [selected, setSelected]= useState(null)
  const [answered, setAnswered]= useState(false)
  const [score, setScore]      = useState(0)
  const [total, setTotal]      = useState(0)

  const sessionDone = index >= queue.length
  const question = queue[Math.min(index, queue.length - 1)]

  function handleSelect(choice) {
    if (answered) return
    setSelected(choice.id)
    setAnswered(true)
    if (choice.correct) setScore(s => s + 1)
    setTotal(t => t + 1)
  }

  function handleNext() {
    setIndex(i => i + 1)
    setSelected(null)
    setAnswered(false)
  }

  const categoryClass = CATEGORY_COLORS[question.category] || 'bg-gray-800 border-gray-600 text-gray-300'

  if (sessionDone) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    return (
      <div className="flex flex-col min-h-dvh max-w-lg mx-auto px-4 py-4 gap-4">
        <div className="text-center mt-8">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-white text-2xl font-bold">Session Complete!</div>
          <div className="text-gray-300 text-lg mt-1">{score} / {total} correct ({pct}%)</div>
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => {
              setIndex(0)
              setScore(0)
              setTotal(0)
              setSelected(null)
              setAnswered(false)
            }}
            className="w-full text-white font-bold py-3 rounded-xl text-base transition-all active:scale-95"
            style={BTN_PRIMARY}
          >
            Play Again
          </button>
          <button
            onClick={onBack}
            className="w-full font-bold py-3 rounded-xl text-base text-gray-300 transition-colors hover:brightness-125"
            style={CARD}
          >
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto px-4 py-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xl">←</button>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#b5f23d' }}>
          Baserunning Quiz <span className="text-gray-600 normal-case tracking-normal">{index + 1}/{queue.length}</span>
        </span>
        <div className="font-bold text-sm" style={{ color: '#e91e8c' }}>⭐ {score}/{total}</div>
      </div>

      {/* Category badge */}
      <div className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-bold border ${categoryClass}`}>
        {question.category}
      </div>

      {/* Situation box */}
      <div className="rounded-2xl p-4" style={CARD}>
        <p className="text-white text-sm leading-relaxed">{question.situation}</p>
      </div>

      {/* Question */}
      <div className="text-gray-300 font-semibold text-sm">{question.question}</div>

      {/* Answer choices */}
      <div className="flex flex-col gap-3">
        {question.choices.map(choice => {
          let style
          let className = 'w-full text-left border rounded-xl px-4 py-3.5 text-sm font-medium transition-all'

          if (answered) {
            if (choice.correct) {
              style = { background: 'rgba(21,128,61,0.3)', border: '1px solid #16a34a', color: '#bbf7d0' }
            } else if (choice.id === selected && !choice.correct) {
              style = { background: 'rgba(153,27,27,0.4)', border: '1px solid #dc2626', color: '#fecaca' }
            } else {
              style = { background: 'rgba(13,13,15,0.4)', border: '1px solid #2d2d4e', color: '#6b7280' }
            }
          } else {
            style = { background: '#1a1a2e', border: '1px solid #2d2d4e', color: '#e2e8f0' }
            className += ' hover:brightness-125 active:scale-[0.98]'
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              disabled={answered}
              className={className}
              style={style}
            >
              <div className="flex items-center gap-2">
                {answered && choice.correct && <span>✓</span>}
                {answered && choice.id === selected && !choice.correct && <span>✗</span>}
                {choice.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="rounded-xl px-4 py-3" style={CARD}>
          <div className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wide">Why?</div>
          <p className="text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full text-white font-bold py-3.5 rounded-xl text-base transition-all active:scale-95"
          style={BTN_PRIMARY}
        >
          Next Question →
        </button>
      )}

      {/* Progress */}
      <div className="mt-auto">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Accuracy</span>
          <span>{total > 0 ? Math.round((score / total) * 100) : 0}%</span>
        </div>
        <div className="w-full rounded-full h-1.5" style={{ background: '#1a1a2e' }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${total > 0 ? (score / total) * 100 : 0}%`, background: '#b5f23d' }}
          />
        </div>
      </div>
    </div>
  )
}
