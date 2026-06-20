import { PokeDexCard } from './poke-dex-card';
import { pokeDexStore } from '#stores';
import { useObservableState } from 'observable-hooks';
import { PokeDexInfoModal } from './poke-dex-info-modal';
import { getRequestStatus } from '#utils';

export const PokeDexList = () => {
  const pokemonsState = useObservableState(pokeDexStore.pokemons$, null);

  const { isLoading, isPending } = getRequestStatus(pokemonsState?.status);
  const selectedPokemon = pokemonsState?.results.find((pokemon) => pokemon.isSelected);

  return (
    <div>
      <PokeDexInfoModal pokemon={selectedPokemon || null} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-primary">
          <span className="loading loading-ring loading-xl" />
        </div>
      )}
      <div className="flex flex-col justify-between gap-4 h-full">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {pokemonsState?.results.map((pokemon, index) => (
            <PokeDexCard key={index} pokemon={pokemon} />
          ))}
        </div>
        {!isLoading && !pokemonsState?.reachedMaxPokemons && (
          <div className="flex justify-center">
            <button
              className="btn btn-md"
              onClick={() => pokeDexStore.loadMorePokemons()}
              disabled={isPending}
            >
              {isPending && <span className="loading loading-spinner loading-sm"></span>}
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
