interface GameScoreProps {
  turns: number;
  bestTurns: number;
}

export const GameScore = ({ turns, bestTurns }: GameScoreProps) => (
  <div className="stats stats-horizontal border border-base-300 bg-base-100 shadow-sm w-full">
    <div className="stat px-5 py-3 text-center">
      <div className="stat-title">Turns</div>
      <div className="stat-value text-primary text-3xl tabular-nums">{turns}</div>
    </div>
    <div className="stat px-5 py-3 text-center">
      <div className="stat-title">Best turns</div>
      <div className="stat-value text-warning/70 text-3xl tabular-nums">{bestTurns}</div>
    </div>
  </div>
);
