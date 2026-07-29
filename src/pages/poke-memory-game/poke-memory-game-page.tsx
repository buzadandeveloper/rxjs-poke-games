import { DeckList, GameWinDialog, SelectDeck } from './components';

export const PokeMemoryGamePage = () => {
  return (
    <div className="flex flex-col gap-4 items-center h-full">
      <SelectDeck />
      <div className="flex flex-1 items-center justify-center">
        <DeckList />
      </div>
      <GameWinDialog />
    </div>
  );
};
