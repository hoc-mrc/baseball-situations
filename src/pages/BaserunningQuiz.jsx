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

export default function BaserunningQuiz({ onBack }) {
  const [queue]                = useState(() => shuffle(BASERUNNING_QUESTIONS))
  const [index, setIndex]      = useState(0)
  const [selected, setSelected]= useState(null) // choice id
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
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-base"
          >
            Play Again
          </button>
          <button onClick={onBack} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl text-base">
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
        <span className="text-gray-400 text-sm font-semibold">
          Baserunning Quiz <span className="text-gray-600">{index + 1}/{queue.length}</span>
        </span>
        <div className="text-yellow-400 font-bold text-sm">⭐ {score}/{total}</div>
      </div>

      {/* Category badge */}
      <div className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-bold border ${categoryClass}`}>
        {question.category}
      </div>

      {/* Situation box */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
        <p className="text-white text-sm leading-relaxed">{question.situation}</p>
      </div>

      {/* Question */}
      <div className="text-gray-300 font-semibold text-sm">{question.question}</div>

      {/* Answer choices */}
      <div className="flex flex-col gap-3">
        {question.choices.map(choice => {
          let style = 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 active:bg-gray-600'

          if (answered) {
            if (choice.correct) {
              style = 'bg-green-900/60 border-green-600 text-green-200'
            } else if (choice.id === selected && !choice.correct) {
              style = 'bg-red-900/60 border-red-600 text-red-200'
            } else {
              style = 'bg-gray-900/40 border-gray-700 text-gray-500'
            }
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              disabled={answered}
              className={`w-full text-left border rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${style}`}
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
        <div className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-3">
          <div className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wide">Why?</div>
          <p className="text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-base transition-colors"
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
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${total > 0 ? (score / total) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}
