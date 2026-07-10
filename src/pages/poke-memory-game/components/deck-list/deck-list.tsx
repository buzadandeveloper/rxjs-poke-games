import { pokeMemoryGameStore } from '#stores';
import { useObservableState } from 'observable-hooks';
import { DeckCard } from './deck-card';
import { getRequestStatus } from '#utils';

export const DeckList = () => {
  const pokemons = useObservableState(pokeMemoryGameStore.pokemons$, null);

  const { isLoading } = getRequestStatus(pokemons?.status);

  console.log(pokemons);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex gap-4">
      {pokemons?.results.map((pokemon, index) => (
        <DeckCard key={index} src={pokemon.src} />
      ))}
    </div>
  );
};
