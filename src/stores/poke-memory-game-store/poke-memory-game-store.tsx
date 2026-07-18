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

class PokeMemoryGameStore {
  initialGameState$ = new BehaviorSubject<GameState>({
    status: RESPONSE_STATUS.idle,
    flippedPokemons: [],
    deckSetup: {
      items: 2,
      groups: 2,
    },
    pokemons: [],
    deck: [],
  });

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
    const deck = updates.groups
      ? this.#createDeck(this.initialGameState$.value.pokemons, updates.groups)
      : this.initialGameState$.value.deck;

    return this.initialGameState$.next({
      ...this.initialGameState$.value,
      deckSetup: {
        ...this.initialGameState$.value.deckSetup,
        ...updates,
      },
      deck,
    });
  }

  selectMatch(index: number) {
    this.initialGameState$.next({
      ...this.initialGameState$.value,
      deck: this.initialGameState$.value.deck.map((poke, idx) => ({
        ...poke,
        isFlipped: index === idx || poke.isFlipped,
      })),
    });
  }
}

export const pokeMemoryGameStore = new PokeMemoryGameStore();
