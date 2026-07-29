import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { pokeService } from '#service';
import type { PokemonData } from '#service/types';
import type { DeckSetup, GameState, PokemonMap } from './poke-memory-game-store-types';
import { RESPONSE_STATUS } from '#types';
import { shuffle } from '#utils';
import { MAX_REACHABLE_POKEMONS } from '#constants';

const INITIAL_STATE = {
  status: RESPONSE_STATUS.idle,
  flippedPokemons: [],
  deckSetup: {
    items: 2,
    groups: 2,
  },
  pokemons: [],
  deck: [],
  matchedPokemons: [],
  gameOver: false,
};

class PokeMemoryGameStore {
  initialGameState$ = new BehaviorSubject<GameState>(INITIAL_STATE);

  pokemons$ = this.initialGameState$.pipe(
    distinctUntilChanged((prev, curr) => prev.deckSetup.items === curr.deckSetup.items),
    switchMap((gameState) =>
      pokeService
        .getPokemons({
          offset: this.#randomOffset(),
          limit: gameState.deckSetup.items,
        })
        .pipe(
          switchMap(({ response }) => {
            const request = response.results.map((pokemon) =>
              pokeService
                .getPokemon(pokemon.name)
                .pipe(map(({ response }) => this.#mapPokemon(response))),
            );

            return forkJoin(request);
          }),
          map((response) => {
            this.initialGameState$.next({
              ...this.initialGameState$.value,
              pokemons: response,
              deck: this.#createDeck(response, this.initialGameState$.value.deckSetup.groups),
            });

            return {
              status: RESPONSE_STATUS.success,
              results: response,
            };
          }),
          startWith({
            status: RESPONSE_STATUS.loading,
            results: [],
          }),
          catchError((error) =>
            of({
              status: RESPONSE_STATUS.error,
              results: [],
              error,
            }),
          ),
        ),
    ),
    shareReplay(),
  );

  gameState$ = combineLatest([this.initialGameState$, this.pokemons$]).pipe(
    map(([gameState, pokemons]) => {
      return {
        ...gameState,
        status: pokemons.status,
      };
    }),
  );

  #createDeck(results: PokemonMap[], groups: number) {
    let deck: PokemonMap[] = [];

    for (let i = 0; i < groups; i++) deck = [...deck, ...results];

    return shuffle(deck);
  }

  #randomOffset() {
    return Math.floor(Math.random() * MAX_REACHABLE_POKEMONS) + 1;
  }

  #mapPokemon(response: PokemonData): PokemonMap {
    const img = new Image();
    img.src = response.sprites.other.home.front_default;

    return {
      id: response.id,
      name: response.name,
      src: img.src,
      isFlipped: false,
      isMatched: false,
    };
  }

  selectDeck(updates: Partial<DeckSetup>) {
    const state = this.initialGameState$.value;

    const deck = updates.groups ? this.#createDeck(state.pokemons, updates.groups) : state.deck;

    return this.initialGameState$.next({
      ...INITIAL_STATE,
      deckSetup: {
        ...state.deckSetup,
        ...updates,
      },
      pokemons: state.pokemons,
      deck,
    });
  }

  flipCard(index: number) {
    const state = this.initialGameState$.value;

    if (state.deck[index].isFlipped) return;

    const deck = [...state.deck];

    deck[index] = {
      ...deck[index],
      isFlipped: true,
    };

    const flippedPokemons = [...state.flippedPokemons, deck[index]];

    if (flippedPokemons.length <= state.deckSetup.groups) {
      this.initialGameState$.next({
        ...state,
        flippedPokemons,
        deck,
      });
    }

    if (flippedPokemons.length === state.deckSetup.groups) {
      const isMatch = flippedPokemons.every((pokemon) => pokemon.id === flippedPokemons[0].id);

      if (isMatch) {
        const deckMatched = flippedPokemons.map((pokemon) => ({
          ...pokemon,
          isMatched: true,
        }));
        const updatedMatchedDeck = deck.map((pokemon) => {
          const matchedPokemon = deckMatched.find((matched) => matched.id === pokemon.id);
          return matchedPokemon ? matchedPokemon : pokemon;
        });

        this.initialGameState$.next({
          ...state,
          flippedPokemons: [],
          matchedPokemons: [...state.matchedPokemons, ...deckMatched],
          deck: updatedMatchedDeck,
          gameOver: state.matchedPokemons.length === state.pokemons.length,
        });
      } else {
        setTimeout(() => {
          this.initialGameState$.next({
            ...state,
            flippedPokemons: [],
            deck: deck.map((pokemon) => ({
              ...pokemon,
              isFlipped: false,
            })),
          });
        }, 1000);
      }
    }
  }
}

export const pokeMemoryGameStore = new PokeMemoryGameStore();
