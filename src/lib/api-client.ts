import { Observable } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';

const BASE_URL = 'https://pokeapi.co/api/v2';

class ApiClient {
  #url: string = BASE_URL;
  static #instance: ApiClient;

  private constructor() {}

  static getInstance() {
    if (!ApiClient.#instance) ApiClient.#instance = new ApiClient();

    return ApiClient.#instance;
  }

  get<T = any>(endpoint: string, queryParams?: Record<string, any>): Observable<AjaxResponse<T>> {
    return ajax<T>({
      url: `${this.#url}/${endpoint}`,
      method: 'GET',
      queryParams,
    });
  }
}

export const apiClient = ApiClient.getInstance();
