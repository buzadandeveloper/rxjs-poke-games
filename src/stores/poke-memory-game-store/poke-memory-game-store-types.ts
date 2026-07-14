import type { ResponseStatus } from '#types';

export type DeckSetup = {
  items: number;
  groups: number;
};

export type PokemonMap = {
  id: number;
  name: string;
  src: string;
};

export type GameState = {
  deckSetup: DeckSetup;
  status: ResponseStatus;
  deck: PokemonMap[];
  selectedPokemons: any;
};
