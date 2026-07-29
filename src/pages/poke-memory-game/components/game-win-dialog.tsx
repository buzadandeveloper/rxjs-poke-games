import { pokeMemoryGameStore } from '#stores';
import { useObservableState } from 'observable-hooks';

export const GameWinDialog = () => {
  const isGameOver = useObservableState(pokeMemoryGameStore.gameState$, null)?.isGameOver;

  return (
    <dialog className="modal backdrop:bg-base-300/30 backdrop:backdrop-blur-sm" open={isGameOver}>
      <div className="modal-box text-center">
        <h2 className="text-3xl font-bold">You won!</h2>
        <div className="modal-action justify-center">
          <button className="btn btn-primary" onClick={() => pokeMemoryGameStore.newGame()}>
            New game
          </button>
        </div>
      </div>
    </dialog>
  );
};
