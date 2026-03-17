import { useRef, useState, useCallback } from 'react'
import { ZONES } from '../data/zones.js'

// Default positions for each player on the field before the pitch
export const DEFAULT_POSITIONS = {
  P:    { x: 250, y: 325 },
  C:    { x: 250, y: 408 },
  '1B': { x: 378, y: 303 },
  '2B': { x: 308, y: 267 },
  SS:   { x: 192, y: 267 },
  '3B': { x: 122, y: 303 },
  LF:   { x: 115, y: 158 },
  CF:   { x: 250, y: 118 },
  RF:   { x: 385, y: 158 },
}

const POSITION_COLORS = {
  P:    '#f97316', // orange
  C:    '#a78bfa', // purple
  '1B': '#34d399', // green
  '2B': '#60a5fa', // blue
  SS:   '#f472b6', // pink
  '3B': '#facc15', // yellow
  LF:   '#fb7185', // rose
  CF:   '#4ade80', // lime
  RF:   '#38bdf8', // sky
}

function BaseballField({ runners = {} }) {
  return (
    <g>
      {/* Outfield grass */}
      <path d="M 25 370 Q 140 15 250 12 Q 360 15 475 370 Z" fill="#3a7d44" />
      {/* Infield grass (inside the bases) */}
      <polygon points="250,213 365,317 250,420 135,317" fill="#3f8b4a" />
      {/* Infield dirt circle */}
      <circle cx="250" cy="340" r="108" fill="#c8a96e" />
      {/* Cover infield grass inside dirt circle */}
      <polygon
        points="250,213 365,317 250,420 135,317"
        fill="#3f8b4a"
        clipPath="url(#infield-clip)"
      />
      {/* Base paths */}
      <line x1="250" y1="420" x2="365" y2="317" stroke="#d4b483" strokeWidth="2" />
      <line x1="365" y1="317" x2="250" y2="213" stroke="#d4b483" strokeWidth="2" />
      <line x1="250" y1="213" x2="135" y2="317" stroke="#d4b483" strokeWidth="2" />
      <line x1="135" y1="317" x2="250" y2="420" stroke="#d4b483" strokeWidth="2" />
      {/* Foul lines */}
      <line x1="250" y1="420" x2="25" y2="195" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="250" y1="420" x2="475" y2="195" stroke="white" strokeWidth="1.5" opacity="0.6" />
      {/* Outfield wall */}
      <path d="M 25 370 Q 140 15 250 12 Q 360 15 475 370" fill="none" stroke="#7c5c35" strokeWidth="8" strokeLinecap="round" />
      {/* Pitcher's mound */}
      <ellipse cx="250" cy="333" rx="14" ry="10" fill="#b8996e" />
      {/* Bases */}
      <rect x="-8" y="-8" width="16" height="16" fill="white" rx="1" transform="translate(365,317) rotate(45)" />
      <rect x="-8" y="-8" width="16" height="16" fill="white" rx="1" transform="translate(250,213) rotate(45)" />
      <rect x="-8" y="-8" width="16" height="16" fill="white" rx="1" transform="translate(135,317) rotate(45)" />
      {/* Home plate pentagon */}
      <polygon points="250,430 263,419 263,409 237,409 237,419" fill="white" />
      {/* Base runner indicators */}
      {runners.first  && <circle cx="365" cy="317" r="10" fill="#ff4444" opacity="0.85" />}
      {runners.second && <circle cx="250" cy="213" r="10" fill="#ff4444" opacity="0.85" />}
      {runners.third  && <circle cx="135" cy="317" r="10" fill="#ff4444" opacity="0.85" />}
      {/* Ball destination indicator */}
    </g>
  )
}

function PlayerIcon({ id, x, y, label, color, draggable, answered, correct, onPointerDown }) {
  const isCorrect = answered && correct === true
  const isWrong   = answered && correct === false

  const ringColor = draggable && !answered ? '#fff' : isCorrect ? '#22c55e' : isWrong ? '#ef4444' : 'transparent'
  const bgColor   = draggable && !answered ? color : isCorrect ? '#22c55e' : isWrong ? '#ef4444' : '#475569'
  const opacity   = (!draggable && !answered) ? 0.45 : 1

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: draggable && !answered ? 'grab' : 'default', opacity }}
      onPointerDown={draggable && !answered ? onPointerDown : undefined}
      className={draggable && !answered ? 'player-icon' : 'player-icon not-draggable'}
    >
      {/* Glow ring for draggable quiz positions */}
      {draggable && !answered && (
        <circle r="20" fill="none" stroke={ringColor} strokeWidth="2.5" strokeDasharray="4 2" />
      )}
      {/* Result ring after answer */}
      {answered && (
        <circle r="20" fill="none" stroke={ringColor} strokeWidth="3" />
      )}
      {/* Main circle */}
      <circle r="16" fill={bgColor} />
      {/* Label */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={label.length > 2 ? '9' : '11'}
        fontWeight="700"
        fill="white"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {label}
      </text>
      {/* Quiz badge */}
      {draggable && !answered && (
        <circle cx="14" cy="-14" r="6" fill="#fbbf24" />
      )}
    </g>
  )
}

export default function Field({
  quizPositions = [],       // positions being tested this round
  playerPositions,          // { P: {x,y}, C: {x,y}, ... } — current drag positions
  onPositionChange,         // (pos, x, y) => void
  answered = false,         // true after Check Answer
  correctZones = {},        // { SS: 'relay-lf-to-2b', ... }
  baseState = {},
  myPosition = null,        // highlight only this position if set
}) {
  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(null) // { pos, startSvgX, startSvgY }

  const getSVGCoords = useCallback((clientX, clientY) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const scaleX = 500 / rect.width
    const scaleY = 480 / rect.height
    return {
      x: Math.max(10, Math.min(490, (clientX - rect.left) * scaleX)),
      y: Math.max(10, Math.min(470, (clientY - rect.top)  * scaleY)),
    }
  }, [])

  const handlePointerDown = useCallback((pos, e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(pos)
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return
    e.preventDefault()
    const { x, y } = getSVGCoords(e.clientX, e.clientY)
    onPositionChange?.(dragging, x, y)
  }, [dragging, getSVGCoords, onPositionChange])

  const handlePointerUp = useCallback(() => {
    setDragging(null)
  }, [])

  // Determine correctness of each quiz position
  function getCorrectness(pos) {
    if (!answered) return null
    const zoneName = correctZones[pos]
    if (!zoneName) return null
    const zone = ZONES[zoneName]
    if (!zone) return null
    const { x, y } = playerPositions[pos] || DEFAULT_POSITIONS[pos]
    const dx = x - zone.x
    const dy = y - zone.y
    return Math.sqrt(dx * dx + dy * dy) <= zone.r
  }

  const positions = Object.keys(DEFAULT_POSITIONS)

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 480"
      className="w-full max-w-lg mx-auto select-none touch-none"
      style={{ maxHeight: '60vh' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <BaseballField runners={baseState} />

      {/* Zone hints after answering */}
      {answered && quizPositions.map(pos => {
        const zoneName = correctZones[pos]
        if (!zoneName) return null
        const zone = ZONES[zoneName]
        if (!zone) return null
        const isCorrect = getCorrectness(pos)
        return (
          <circle
            key={`zone-${pos}`}
            cx={zone.x}
            cy={zone.y}
            r={zone.r}
            fill={isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}
            stroke={isCorrect ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)'}
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />
        )
      })}

      {/* Players */}
      {positions.map(pos => {
        const isDraggable = quizPositions.includes(pos)
        const highlight = myPosition ? pos === myPosition : isDraggable
        const coords = (playerPositions && playerPositions[pos]) || DEFAULT_POSITIONS[pos]
        const correctness = isDraggable ? getCorrectness(pos) : null

        return (
          <PlayerIcon
            key={pos}
            id={pos}
            x={coords.x}
            y={coords.y}
            label={pos}
            color={POSITION_COLORS[pos]}
            draggable={isDraggable}
            answered={answered}
            correct={correctness}
            onPointerDown={(e) => handlePointerDown(pos, e)}
          />
        )
      })}

      {/* Correct target markers (shown after wrong answer) */}
      {answered && quizPositions.map(pos => {
        const isCorrect = getCorrectness(pos)
        if (isCorrect) return null
        const zoneName = correctZones[pos]
        if (!zoneName) return null
        const zone = ZONES[zoneName]
        if (!zone) return null
        return (
          <g key={`target-${pos}`} transform={`translate(${zone.x}, ${zone.y})`}>
            <circle r="8" fill="#22c55e" opacity="0.9" />
            <text textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="700" fill="white">
              {pos}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
