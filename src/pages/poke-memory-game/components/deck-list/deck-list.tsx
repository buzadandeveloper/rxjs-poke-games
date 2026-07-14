import { pokeMemoryGameStore } from '#stores';
import { useObservableState } from 'observable-hooks';
import { DeckCard } from './deck-card';
import { getRequestStatus } from '#utils';

export const DeckList = () => {
  const gameLogic = useObservableState(pokeMemoryGameStore.gameLogic$, null);

  const { isLoading } = getRequestStatus(gameLogic?.status);

  // const pok = pokemons?.results || []

  console.log(gameLogic);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex gap-4">
      {gameLogic?.deck.map((pokemon, index) => (
        <DeckCard
          key={index}
          name={pokemon.name}
          src={pokemon.src}
          onSelectCard={() => pokeMemoryGameStore.selectMatch(index, pokemon)}
        />
      ))}
    </div>
  );
};
