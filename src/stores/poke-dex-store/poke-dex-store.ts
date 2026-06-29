import { pokeService } from '#services';
import {
  BehaviorSubject,
  catchError,
  combineLatestWith,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import type {
  PokemonData,
  PokemonsParams,
  PokemonStatName,
} from '#services/poke-dex-service/poke-dex-service-types';
import type { Pokemon, PokemonsState } from './poke-dex-store-types';
import { RESPONSE_STATUS } from '#types';

const POKEMONS_LIMIT = 20;
const MAX_REACHABLE_POKEMONS = 600;

class PokeDexStore {
  #params$: BehaviorSubject<PokemonsParams> = new BehaviorSubject({
    limit: POKEMONS_LIMIT,
    offset: 0,
  });
  #selectedPokemon$ = new BehaviorSubject<null | number>(null);

  #pokemonsCache = new Map<number, Pokemon>();

  #pokemonsData$: Observable<PokemonsState> = this.#params$.pipe(
    switchMap((params) =>
      pokeService.getPokemons(params).pipe(
        switchMap(({ response }) => {
          const requests = response.results.map((pokemon) =>
            pokeService
              .getPokemon(pokemon.name)
              .pipe(map(({ response }) => this.#mapPokemon(response))),
          );

          return forkJoin(requests).pipe(
            map((response) =>
              response.map((pokemon) => this.#pokemonsCache.set(pokemon.id, pokemon)),
            ),
          );
        }),
        map(() => ({
          status: RESPONSE_STATUS.success,
          reachedMaxPokemons: this.#pokemonsCache.size === MAX_REACHABLE_POKEMONS,
          results: Array.from(this.#pokemonsCache.values()),
        })),
        startWith({
          status: this.#pokemonsCache.size ? RESPONSE_STATUS.pending : RESPONSE_STATUS.loading,
          reachedMaxPokemons: false,
          results: Array.from(this.#pokemonsCache.values()),
        }),
        catchError((error) =>
          of({
            status: RESPONSE_STATUS.error,
            reachedMaxPokemons: false,
            results: [],
            error,
          }),
        ),
      ),
    ),
    shareReplay(1),
  );

  pokemons$ = this.#pokemonsData$.pipe(
    combineLatestWith(this.#selectedPokemon$),
    map(([pokemonsState, selectedPokemon]) => ({
      ...pokemonsState,
      results: pokemonsState.results.map((pokemon) => ({
        ...pokemon,
        isSelected: pokemon.id === selectedPokemon,
      })),
    })),
  );

  #mapPokemon(response: PokemonData) {
    return {
      id: response.id,
      name: response.name,
      src: response.sprites.front_default,
      stats: response.stats.reduce(
        (acc, stat) => ({
          ...acc,
          [stat.stat.name]: stat.base_stat,
        }),
        {} as Record<PokemonStatName, number>,
      ),
      power: response.stats.reduce((acc, stat) => acc + stat.base_stat, 0),
    };
  }

  selectPokemon(id: number | null) {
    this.#selectedPokemon$.next(id);
  }

  loadMorePokemons() {
    this.#params$.next({
      ...this.#params$.value,
      offset: this.#params$.value.offset + POKEMONS_LIMIT,
    });
  }
}

export const pokeDexStore = new PokeDexStore();
