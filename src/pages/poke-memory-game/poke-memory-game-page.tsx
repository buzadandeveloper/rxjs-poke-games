import { DeckList, GameWinDialog, SelectDeck, GameScore } from './components';
import { useObservableState } from 'observable-hooks';
import { pokeMemoryGameStore } from '#stores';
import { getRequestStatus } from '#utils';

export const PokeMemoryGamePage = () => {
  const gameState = useObservableState(pokeMemoryGameStore.gameState$, null);

  const { isLoading } = getRequestStatus(gameState?.status);

  return (
    <div className="flex flex-col gap-4 items-center h-full">
      <div className="flex flex-col gap-4 max-w-[260px]">
        <SelectDeck isLoading={isLoading} />
        <GameScore />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <DeckList deck={gameState?.deck || []} isLoading={isLoading} />
      </div>
      <GameWinDialog />
    </div>
  );
};
