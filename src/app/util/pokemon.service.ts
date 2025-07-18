import { Injectable } from '@angular/core';
import { NamedAPIResourceList, Pokedex, Pokemon } from 'pokeapi-js-wrapper';
import { Observable, catchError, from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PokemonService {
    pokedex = new Pokedex();

    /**
     * Get a Pokemon by name
     */
    async getPokemon(name: string): Promise<Pokemon> {
        try {
            return await this.pokedex.getPokemonByName(name);
        } catch (error) {
            console.error(`Failed to fetch Pokemon ${name}:`, error);
            throw new Error(`Failed to fetch Pokemon: ${name}`);
        }
    }

    /**
     * Get a list of Pokemon with pagination
     */
    async getPokemonList(offset: number, limit: number): Promise<NamedAPIResourceList> {
        try {
            return await this.pokedex.getPokemonsList({ offset, limit });
        } catch (error) {
            console.error('Failed to fetch Pokemon list:', error);
            throw new Error('Failed to fetch Pokemon list');
        }
    }

}