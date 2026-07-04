import { useObservableState } from 'observable-hooks';
import { pokeMemoryGameStore } from '#stores';
import { SelectDeck } from './components';

export const PokeMemoryGamePage = () => {
  const game = useObservableState(pokeMemoryGameStore.pokemons$, null);

  console.log(game);

  return (
    <div>
      <SelectDeck />
    </div>
  );
};
