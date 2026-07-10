import { DeckList, SelectDeck } from './components';

export const PokeMemoryGamePage = () => {
  return (
    <div className="flex flex-col gap-4 items-center h-full">
      <SelectDeck />
      <DeckList />
    </div>
  );
};
