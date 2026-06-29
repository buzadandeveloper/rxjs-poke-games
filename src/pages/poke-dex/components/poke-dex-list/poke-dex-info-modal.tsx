import type { Pokemon } from '#stores/poke-dex-store/poke-dex-store-types.ts';
import type { PokemonStatName } from '#service/types';
import { pokeDexStore } from '#stores';
import { PokeDexFigure } from './poke-dex-figure';
import { PokeDexName } from './poke-dex-name';

interface PokeDexInfoModal {
  pokemon: Pokemon | null;
}

export const PokeDexInfoModal = ({ pokemon }: PokeDexInfoModal) => {
  const handleCloseModal = () => pokeDexStore.selectPokemon(null);

  if (!pokemon) return null;

  return (
    <dialog className="modal" open={pokemon.isSelected}>
      <div className="card bg-base-100 border border-base-200 w-70 shadow-sm relative overflow-hidden">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleCloseModal}
        >
          ✕
        </button>
        <PokeDexFigure name={pokemon.name} src={pokemon.src} />
        <div className="card-body p-4 gap-3">
          <PokeDexName id={pokemon.id} name={pokemon.name} />

          <div className="flex items-center justify-between">
            <span className="text-xs text-base-content/50">POWER</span>
            <div className="badge badge-warning badge-sm font-bold px-1 text-white">
              {pokemon.power}
            </div>
          </div>

          <div className="divider my-0" />

          <div className="flex flex-col gap-2">
            {Object.entries(pokemon.stats).map(([key, val]) => {
              const statsKey = key as PokemonStatName;

              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-base-content/50 w-8 shrink-0">
                    {POKEMON_STATS[statsKey].label}
                  </span>
                  <progress
                    className={`progress ${POKEMON_STATS[statsKey].color} flex-1 h-2`}
                    value={val}
                    max={POKEMON_STATS[statsKey].max}
                  />
                  <span className="text-xs font-semibold text-base-content/70 w-6 text-right">
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </dialog>
  );
};

const POKEMON_STATS: Record<
  PokemonStatName,
  {
    label: string;
    color: string;
    max: number;
  }
> = {
  hp: {
    label: 'HP',
    color: 'progress-success',
    max: 255,
  },
  attack: {
    label: 'ATK',
    color: 'progress-warning',
    max: 190,
  },
  defense: {
    label: 'DEF',
    color: 'progress-info',
    max: 250,
  },
  'special-attack': {
    label: 'SpA',
    color: 'progress-secondary',
    max: 194,
  },
  'special-defense': {
    label: 'SpD',
    color: 'progress-accent',
    max: 250,
  },
  speed: {
    label: 'SPD',
    color: 'progress-error',
    max: 200,
  },
};
