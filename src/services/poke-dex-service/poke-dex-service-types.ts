type Pokemon = {
  name: string;
  url: string;
};

export type PokemonsParams = {
  offset: number;
  limit: number;
};

export type PokemonsData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

type PokemonSprites = {
  front_default: string;
};

export type PokemonStatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: {
    name: PokemonStatName;
    url: string;
  };
};

export type PokemonData = {
  id: number;
  name: string;
  sprites: PokemonSprites;
  stats: PokemonStat[];
};
