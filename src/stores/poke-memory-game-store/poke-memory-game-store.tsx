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
  gameState$ = new BehaviorSubject<GameState>({
    status: RESPONSE_STATUS.idle,
    selectedPokemons: [],
    deckSetup: {
      items: 2,
      groups: 2,
    },
    deck: [],
  });

  pokemons$ = this.gameState$.pipe(
    distinctUntilChanged((prev, curr) => prev.deckSetup.items === curr.deckSetup.items),
    switchMap((gameLogic) =>
      pokeService
        .getPokemons({
          offset: this.#randomOffset(),
          limit: gameLogic.deckSetup.items,
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
          map((response) => ({
            status: RESPONSE_STATUS.success,
            results: response,
          })),
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

  gameLogic$ = combineLatest([this.gameState$, this.pokemons$]).pipe(
    map(([gameState, pokemons]) => {
      let deck: PokemonMap[] = [];
      for (let i = 0; i < gameState.deckSetup.groups; i++) deck = [...deck, ...pokemons.results];

      return {
        ...gameState,
        status: pokemons.status,
        deck: shuffle(deck),
      };
    }),
  );

  #randomOffset() {
    return Math.floor(Math.random() * MAX_REACHABLE_POKEMONS) + 1;
  }

  #mapPokemon(response: PokemonData): PokemonMap {
    return {
      id: response.id,
      name: response.name,
      src: response.sprites.other.home.front_default,
    };
  }

  selectDeck(updates: Partial<DeckSetup>) {
    return this.gameState$.next({
      ...this.gameState$.value,
      deckSetup: {
        ...this.gameState$.value.deckSetup,
        ...updates,
      },
    });
  }

  selectMatch(index: number, pokemon: PokemonMap) {
    console.log('selectMatch', index, pokemon);
  }
}

export const pokeMemoryGameStore = new PokeMemoryGameStore();
