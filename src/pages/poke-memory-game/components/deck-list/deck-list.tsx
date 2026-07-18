import { pokeMemoryGameStore } from '#stores';
import { useObservableState } from 'observable-hooks';
import { DeckCard } from './deck-card';
import { getRequestStatus } from '#utils';

export const DeckList = () => {
  const gameLogic = useObservableState(pokeMemoryGameStore.gameState$, null);

  const { isLoading } = getRequestStatus(gameLogic?.status);

  console.log(gameLogic);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex gap-4">
      {gameLogic?.deck.map((pokemon, index) => (
        <DeckCard
          key={index}
          name={pokemon.name}
          src={pokemon.src}
          isFlipped={pokemon.isFlipped}
          onSelectCard={() => pokeMemoryGameStore.selectMatch(index)}
        />
      ))}
    </div>
  );
};
