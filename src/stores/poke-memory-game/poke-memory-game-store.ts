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
import { loadBestTurns, saveBestTurns, shuffle } from '#utils';
import { MAX_REACHABLE_POKEMONS } from '#constants';

const CARD_FLIP_DURATION = 700;

const DEFAULT_DECK_SETUP = {
  characters: 2,
  groups: 2,
};

const INITIAL_STATE = {
  status: RESPONSE_STATUS.idle,
  flippedPokemons: [],
  deckSetup: DEFAULT_DECK_SETUP,
  pokemons: [],
  deck: [],
  matchedPokemons: [],
  turns: 0,
  bestTurns: loadBestTurns(DEFAULT_DECK_SETUP.characters, DEFAULT_DECK_SETUP.groups),
  isGameOver: false,
};

class PokeMemoryGameStore {
  initialGameState$ = new BehaviorSubject<GameState>(INITIAL_STATE);

  pokemons$ = this.initialGameState$.pipe(
    distinctUntilChanged((prev, curr) => prev.deckSetup.characters === curr.deckSetup.characters),
    switchMap((gameState) =>
      pokeService
        .getPokemons({
          offset: this.#randomOffset(),
          limit: gameState.deckSetup.characters,
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

    if (state.isGameOver) return;

    this.initialGameState$.next({
      ...state,
      flippedPokemons: [],
      deck: state.deck.map((pokemon) => ({ ...pokemon, isFlipped: false })),
    });

    setTimeout(() => {
      const deck = updates.characters
        ? []
        : updates.groups
          ? this.#createDeck(state.pokemons, updates.groups)
          : state.deck;

      const deckSetup = {
        ...state.deckSetup,
        ...updates,
      };

      this.initialGameState$.next({
        ...INITIAL_STATE,
        deckSetup,
        pokemons: state.pokemons,
        deck,
        bestTurns: loadBestTurns(deckSetup.characters, deckSetup.groups),
      });
    }, CARD_FLIP_DURATION);
  }

  flipCard(index: number) {
    const state = this.initialGameState$.value;

    if (state.isGameOver || state.deck[index].isFlipped) return;

    const deck = [...state.deck];

    deck[index] = {
      ...deck[index],
      isFlipped: true,
    };

    const flippedPokemons = [...state.flippedPokemons, deck[index]];

    const turns = state.turns + 1;

    if (flippedPokemons.length <= state.deckSetup.groups) {
      this.initialGameState$.next({
        ...state,
        flippedPokemons,
        deck,
        turns,
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
        const isGameOver = updatedMatchedDeck.every((pokemon) => pokemon.isMatched);

        if (isGameOver) {
          const bestTurns =
            state.bestTurns === 0 || turns < state.bestTurns ? turns : state.bestTurns;
          saveBestTurns(state.deckSetup.characters, state.deckSetup.groups, bestTurns);
        }

        this.initialGameState$.next({
          ...state,
          flippedPokemons: [],
          matchedPokemons: [...state.matchedPokemons, ...deckMatched],
          deck: updatedMatchedDeck,
          turns,
          bestTurns: loadBestTurns(state.deckSetup.characters, state.deckSetup.groups),
          isGameOver,
        });
      } else {
        const revertDeck = deck.map((pokemon) => {
          const flippedPokemon = flippedPokemons.find((flipped) => flipped.id === pokemon.id);
          return flippedPokemon ? { ...pokemon, isFlipped: false } : pokemon;
        });

        setTimeout(() => {
          this.initialGameState$.next({
            ...state,
            flippedPokemons: [],
            deck: revertDeck,
            turns,
          });
        }, 1000);
      }
    }
  }

  newGame() {
    const state = this.initialGameState$.value;

    this.initialGameState$.next({
      ...state,
      deck: state.deck.map((pokemon) => ({ ...pokemon, isFlipped: false })),
    });

    setTimeout(() => {
      this.initialGameState$.next({
        ...INITIAL_STATE,
        deckSetup: state.deckSetup,
        pokemons: state.pokemons,
        deck: this.#createDeck(state.pokemons, state.deckSetup.groups),
        bestTurns: loadBestTurns(state.deckSetup.characters, state.deckSetup.groups),
        isGameOver: false,
      });
    }, CARD_FLIP_DURATION);
  }
}

export const pokeMemoryGameStore = new PokeMemoryGameStore();
