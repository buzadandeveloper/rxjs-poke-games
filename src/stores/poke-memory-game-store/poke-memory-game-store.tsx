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
import type { DeckSetup, PokemonMap } from './poke-memory-game-store-types';
import { RESPONSE_STATUS } from '#types';
import { shuffle } from '#utils';
import { MAX_REACHABLE_POKEMONS } from '#constants';

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

  shuffledPokemons$ = combineLatest([this.pokemons$, this.deckSetup$]).pipe(
    map(([pokemons, deckSetups]) => {
      let deck: PokemonMap[] = [];

      for (let i = 0; i < deckSetups.groups; i++) deck = [...deck, ...pokemons.results];

      const shuffledDeck = shuffle<PokemonMap>(deck);

      return {
        ...pokemons,
        results: shuffledDeck,
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
    return this.deckSetup$.next({
      ...this.deckSetup$.value,
      ...updates,
    });
  }
}

export const pokeMemoryGameStore = new PokeMemoryGameStore();
