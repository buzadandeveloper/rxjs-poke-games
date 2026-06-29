import { apiClient } from '#lib/api-client';
import type { PokemonData, PokemonsData, PokemonsParams } from './types';

class PokeService {
  getPokemons(queryParams: PokemonsParams) {
    return apiClient.get<PokemonsData>('pokemon', queryParams);
  }

  getPokemon(name: string) {
    return apiClient.get<PokemonData>(`pokemon/${name}`);
  }
}

export const pokeService = new PokeService();
