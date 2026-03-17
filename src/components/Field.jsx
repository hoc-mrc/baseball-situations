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

// Ball destination SVG positions
const BALL_POSITIONS = {
  lf:          { x: 130, y: 148 },
  cf:          { x: 250, y: 118 },
  rf:          { x: 370, y: 148 },
  infield:     { x: 235, y: 355 },
  '2b':        { x: 250, y: 213 },
  '1b':        { x: 365, y: 317 },
  '3b':        { x: 135, y: 317 },
  home:        { x: 250, y: 420 },
  'lf-line':   { x: 75,  y: 195 },
  'lf-gap':    { x: 175, y: 128 },
  'rf-line':   { x: 425, y: 195 },
  'rf-gap':    { x: 325, y: 128 },
  'cf-left':   { x: 190, y: 118 },
  'cf-right':  { x: 310, y: 118 },
  'lf-shallow':{ x: 130, y: 205 },
  'rf-shallow':{ x: 370, y: 205 },
  'gb-ss':     { x: 188, y: 272 },
  'gb-2b':     { x: 312, y: 272 },
}

// Play types that have a batted-ball trajectory from home plate
const BATTED_BALL_TYPES = new Set(['fly_ball', 'single', 'ground_ball', 'bunt'])

function Baseball({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Shadow */}
      <circle r="11" fill="black" opacity="0.25" transform="translate(1,1)" />
      {/* Ball */}
      <circle r="10" fill="white" stroke="#ccc" strokeWidth="0.5" />
      {/* Red stitching — two curved lines */}
      <path d="M -3 -7 Q 0 -3 -3 1" fill="none" stroke="#cc2200" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M  3 -7 Q 0 -3  3 1" fill="none" stroke="#cc2200" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M -3  3 Q 0  7 -3 9" fill="none" stroke="#cc2200" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M  3  3 Q 0  7  3 9" fill="none" stroke="#cc2200" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  )
}

function BallIndicator({ ballDestination, playType }) {
  if (!ballDestination || !playType) return null
  const dest = BALL_POSITIONS[ballDestination]
  if (!dest) return null

  const HOME = { x: 250, y: 420 }
  const showTrajectory = BATTED_BALL_TYPES.has(playType)
  const isFlyBall = playType === 'fly_ball' || playType === 'single'

  // Midpoint for the arc control point — lifted upward for fly balls
  const mx = (HOME.x + dest.x) / 2
  const my = (HOME.y + dest.y) / 2 - (isFlyBall ? 55 : 0)

  const pathD = isFlyBall
    ? `M ${HOME.x} ${HOME.y} Q ${mx} ${my} ${dest.x} ${dest.y}`
    : `M ${HOME.x} ${HOME.y} L ${dest.x} ${dest.y}`

  return (
    <g>
      {showTrajectory && (
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.8"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
      )}
      <Baseball x={dest.x} y={dest.y} />
    </g>
  )
}

function BaseballField({ runners = {}, ballDestination, playType }) {
  // Outfield mowing stripes — concentric arc bands centered on home plate
  // Unit vectors along each foul line: (93,279) and (407,279) are r=211 from (250,420)
  const HX = 250, HY = 420
  const LX = -0.7440, LY = -0.6682   // left foul line direction
  const RX =  0.7440, RY = -0.6682   // right foul line direction
  const GRASS_R = 188                  // inner edge of warning track
  const N = 9
  const stripes = Array.from({ length: N }, (_, i) => {
    const r0 = (i / N) * GRASS_R
    const r1 = ((i + 1) / N) * GRASS_R
    const fill = i % 2 === 0 ? '#286114' : '#2f7018'
    const xl1 = (HX + r1 * LX).toFixed(1), yl1 = (HY + r1 * LY).toFixed(1)
    const xr1 = (HX + r1 * RX).toFixed(1), yr1 = (HY + r1 * RY).toFixed(1)
    const r1s = r1.toFixed(1)
    if (i === 0)
      return <path key={i} fill={fill} d={`M ${HX} ${HY} L ${xl1} ${yl1} A ${r1s} ${r1s} 0 0 1 ${xr1} ${yr1} Z`} />
    const xl0 = (HX + r0 * LX).toFixed(1), yl0 = (HY + r0 * LY).toFixed(1)
    const xr0 = (HX + r0 * RX).toFixed(1), yr0 = (HY + r0 * RY).toFixed(1)
    const r0s = r0.toFixed(1)
    return <path key={i} fill={fill} d={`M ${xl0} ${yl0} A ${r0s} ${r0s} 0 0 1 ${xr0} ${yr0} L ${xr1} ${yr1} A ${r1s} ${r1s} 0 0 0 ${xl1} ${yl1} Z`} />
  })

  return (
    <g>
      {/* 0 — Background (foul territory) */}
      <rect x="0" y="0" width="500" height="480" fill="#183d0e" />

      {/* 1 — Warning track sector (brown band at outer edge) */}
      <path d="M 250 420 L 93 279 A 211 211 0 0 1 407 279 Z" fill="#9a7040" />

      {/* 2 — Outfield grass with mowing stripes */}
      {stripes}

      {/* 3 — Infield dirt circle */}
      <circle cx="250" cy="317" r="100" fill="#c49055" />

      {/* 4 — Infield grass diamond */}
      <polygon points="250,213 365,317 250,420 135,317" fill="#2f7018" />

      {/* 5 — Base paths */}
      <line x1="250" y1="420" x2="365" y2="317" stroke="#a0804a" strokeWidth="2" />
      <line x1="365" y1="317" x2="250" y2="213" stroke="#a0804a" strokeWidth="2" />
      <line x1="250" y1="213" x2="135" y2="317" stroke="#a0804a" strokeWidth="2" />
      <line x1="135" y1="317" x2="250" y2="420" stroke="#a0804a" strokeWidth="2" />

      {/* 6 — Foul lines */}
      <line x1="250" y1="420" x2="93"  y2="279" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <line x1="250" y1="420" x2="407" y2="279" stroke="white" strokeWidth="1.5" opacity="0.6" />

      {/* 7 — Outfield wall */}
      <path d="M 93 279 A 211 211 0 0 1 407 279" fill="none" stroke="#4a2808" strokeWidth="10" strokeLinecap="round" />

      {/* 8 — Pitcher's mound */}
      <ellipse cx="250" cy="321" rx="14" ry="11" fill="#b88848" stroke="#987030" strokeWidth="1" />

      {/* 9 — Bases (white rotated squares) */}
      <rect x="-7" y="-7" width="14" height="14" fill="white" rx="1" transform="translate(365,317) rotate(45)" />
      <rect x="-7" y="-7" width="14" height="14" fill="white" rx="1" transform="translate(250,213) rotate(45)" />
      <rect x="-7" y="-7" width="14" height="14" fill="white" rx="1" transform="translate(135,317) rotate(45)" />

      {/* 10 — Home plate + batter's boxes */}
      <polygon points="250,431 262,421 262,411 238,411 238,421" fill="white" />
      <rect x="263" y="409" width="12" height="20" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />
      <rect x="225" y="409" width="12" height="20" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />

      {/* 11 — Runner indicators (save public/runner.png — must be transparent PNG) */}
      {runners.first  && <image href="/runner.png" x="349" y="267" width="66" height="66" />}
      {runners.second && <image href="/runner.png" x="217" y="163" width="66" height="66" />}
      {runners.third  && <image href="/runner.png" x="85"  y="267" width="66" height="66" />}

      {/* 12 — Ball indicator */}
      <BallIndicator ballDestination={ballDestination} playType={playType} />
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
  ballDestination = null,   // where the ball was hit (lf, cf, rf, infield, etc.)
  playType = null,          // fly_ball, ground_ball, steal, etc.
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
      <BaseballField runners={baseState} ballDestination={ballDestination} playType={playType} />

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
