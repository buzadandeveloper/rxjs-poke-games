import type { ResponseStatus } from '#types';

export type DeckSetup = {
  characters: number;
  groups: number;
};

export type PokemonMap = {
  id: number;
  name: string;
  src: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export type GameState = {
  deckSetup: DeckSetup;
  status: ResponseStatus;
  deck: PokemonMap[];
  pokemons: PokemonMap[];
  flippedPokemons: PokemonMap[];
  matchedPokemons: PokemonMap[];
  turns: number;
  bestTurns: number;
  isGameOver: boolean;
};
