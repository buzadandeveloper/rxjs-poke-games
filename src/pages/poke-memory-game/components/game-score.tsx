import { useObservableState } from 'observable-hooks';
import { pokeMemoryGameStore } from '#stores';

export const GameScore = () => {
  const gameState = useObservableState(pokeMemoryGameStore.gameState$, null);
  return (
    <div className="stats stats-horizontal grid-cols-2 border border-base-300 bg-base-100 shadow-sm w-full">
      <div className="stat px-5 py-3 text-center">
        <div className="stat-title">Turns</div>
        <div className="stat-value text-primary text-3xl tabular-nums">{gameState?.turns || 0}</div>
      </div>
      <div className="stat px-5 py-3 text-center">
        <div className="stat-title">Best turns</div>
        <div className="stat-value text-warning/70 text-3xl tabular-nums">
          {gameState?.bestTurns || 0}
        </div>
      </div>
    </div>
  );
};
