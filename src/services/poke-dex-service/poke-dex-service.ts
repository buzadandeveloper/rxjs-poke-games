import { apiClient } from '#lib/api-client';
import type { PokemonData, PokemonsData, PokemonsParams } from './poke-dex-service-types';

class PokeDexService {
  getPokemons(queryParams: PokemonsParams) {
    return apiClient.get<PokemonsData>('pokemon', queryParams);
  }

  getPokemon(name: string) {
    return apiClient.get<PokemonData>(`pokemon/${name}`);
  }
}

export const pokeService = new PokeDexService();
