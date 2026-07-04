import { BehaviorSubject, forkJoin, map, shareReplay, switchMap } from 'rxjs';
import { pokeService } from '#service';
import type { PokemonData } from '#service/types';
import type { DeckSetup } from './poke-memory-game-store-types';

class PokeMemoryGameStore {
  deckSetup$ = new BehaviorSubject<DeckSetup>({
    items: 2,
    groups: 2,
  });

  pokemons$ = this.deckSetup$.pipe(
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

  selectDeck({ items, groups }: DeckSetup) {
    return this.deckSetup$.next({
      items,
      groups,
    });
  }
}

export const pokeMemoryGameStore = new PokeMemoryGameStore();
