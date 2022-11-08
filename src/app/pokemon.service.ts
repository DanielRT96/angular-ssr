import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from './pokemon';

type PokemonListResponse = {
  count: number;
  next: string;
  previous: string | null;
  results: { name: string; url: string }[];
};

const POKEMONS_LIST_KEY = makeStateKey('pokemons');
const POKEMON_DETAILS_KEY = makeStateKey('pokemon_details');
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient, private transferState: TransferState) {}

  listPokemons(): Observable<Pokemon[]> {
    let pokemonsList = this.transferState.get(POKEMONS_LIST_KEY, null as any);
    if (pokemonsList) return of(pokemonsList);

    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=10&offset=0`)
      .pipe(
        map(({ results }) => {
          let pokemonList: Pokemon[] = [];

          results.forEach((result) => {
            let pokemon = new Pokemon();
            pokemon.name = result.name;
            pokemon.id = Number(result.url[result.url.length - 2]);

            pokemonList.push(pokemon);
          });
          this.transferState.set(POKEMONS_LIST_KEY, pokemonList as any);
          return pokemonList;
        })
      );
  }

  getPokemonDetails(id: number): Observable<Pokemon> {
    let pokemonDetails: Pokemon = this.transferState.get(
      POKEMON_DETAILS_KEY,
      null as any
    );
    if (pokemonDetails && pokemonDetails.id === id) {
      return of(pokemonDetails);
    }

    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`).pipe(
      map(({ name, id, types, stats }) => {
        let pokemon = new Pokemon();
        pokemon.name = name;
        pokemon.id = id;
        pokemon.types = types;
        pokemon.stats = stats;

        this.transferState.get(POKEMON_DETAILS_KEY, pokemon as any);

        return pokemon;
      })
    );
  }
}
