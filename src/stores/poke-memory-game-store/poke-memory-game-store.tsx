import {
  BehaviorSubject,
  catchError,
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
import type { DeckSetup } from './poke-memory-game-store-types';
import { RESPONSE_STATUS } from '#types';

class PokeMemoryGameStore {
  deckSetup$ = new BehaviorSubject<DeckSetup>({
    items: 2,
    groups: 2,
  });

  pokemons$ = this.deckSetup$.pipe(
    distinctUntilChanged((prev, curr) => prev.items === curr.items),
    switchMap(({ items }) =>
      pokeService
        .getPokemons({
          offset: this.#randomOffset(),
          limit: items,
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

  #randomOffset() {
    return Math.floor(Math.random() * 600) + 1;
  }

  #mapPokemon(response: PokemonData) {
    return {
      id: response.id,
      name: response.name,
      src: response.sprites.other.home.front_default,
    };
  }

  selectDeck(updates: Partial<DeckSetup>) {
    return this.deckSetup$.next({
      ...this.deckSetup$.value,
      ...updates,
    });
  }
}

export const pokeMemoryGameStore = new PokeMemoryGameStore();
