function Base({ filled }) {
  return (
    <div
      className={`w-5 h-5 rotate-45 border-2 ${filled ? 'bg-orange-400 border-orange-300' : 'bg-transparent border-gray-500'}`}
    />
  )
}

export default function Scoreboard({ baseState = {}, outs = 0, situationNum = 1, total = 1, score = 0 }) {
  return (
    <div className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm font-mono">
      {/* Situation counter */}
      <div className="text-gray-400 text-xs">
        <span className="text-white font-bold">{situationNum}</span>
        <span className="text-gray-500">/{total}</span>
      </div>

      {/* Base diagram */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex justify-center">
          <Base filled={!!baseState.second} />
        </div>
        <div className="flex gap-3">
          <Base filled={!!baseState.third} />
          <div className="w-5 h-5" /> {/* home placeholder */}
          <Base filled={!!baseState.first} />
        </div>
      </div>

      {/* Outs */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-gray-500 text-xs">OUTS</span>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border ${i < outs ? 'bg-red-500 border-red-400' : 'bg-transparent border-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <div className="text-gray-400 text-xs">SCORE</div>
        <div className="text-yellow-400 font-bold">{score}</div>
      </div>
    </div>
  )
}
