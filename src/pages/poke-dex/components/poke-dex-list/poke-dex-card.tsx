import type { Pokemon } from '#stores/poke-dex-store/poke-dex-store-types.ts=';
import { pokeDexStore } from '#stores';
import { PokeDexFigure } from './poke-dex-figure';
import { PokeDexName } from './poke-dex-name';

interface PokeDexCardProps {
  pokemon: Pokemon;
}

export const PokeDexCard = ({ pokemon }: PokeDexCardProps) => {
  const handleSelectPokemon = () => pokeDexStore.selectPokemon(pokemon.id);

  return (
    <div className="card bg-base-100 border border-base-200 w-auto shadow-sm relative">
      <PokeDexFigure name={pokemon.name} src={pokemon.src} />
      <div className="card-body p-4 gap-3">
        <PokeDexName id={pokemon.id} name={pokemon.name} />
        <button className="btn btn-primary btn-sm" onClick={handleSelectPokemon}>
          Details
        </button>
      </div>
    </div>
  );
};
