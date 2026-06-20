import type { PokemonStatName } from '#services/poke-dex-service/poke-dex-service-types';
import type { ResponseStatus } from '#types';

type PokemonStats = Record<PokemonStatName, number>;

export type Pokemon = {
  id: number;
  name: string;
  power: number;
  src: string;
  stats: PokemonStats;
  isSelected?: boolean;
};

export type PokemonsState = {
  status: ResponseStatus;
  reachedMaxPokemons: boolean;
  results: Pokemon[];
  error?: any;
};
