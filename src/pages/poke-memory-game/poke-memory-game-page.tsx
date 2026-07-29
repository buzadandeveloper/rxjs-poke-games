import { DeckList, GameWinDialog, SelectDeck, GameScore } from './components';

export const PokeMemoryGamePage = () => {
  return (
    <div className="flex flex-col gap-4 items-center h-full">
      <div className="flex flex-col gap-4 max-w-[260px]">
        <SelectDeck />
        <GameScore />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <DeckList />
      </div>
      <GameWinDialog />
    </div>
  );
};
