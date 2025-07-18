import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Pokemon } from 'pokeapi-js-wrapper';
import { PokemonService } from './pokemon.service';

export const PokemonDetailResolver: ResolveFn<Pokemon> = async (route) => {
    const pokemonService = inject(PokemonService);
    const pokemonId = route.paramMap.get('pokemonId');
    
    if (!pokemonId) {
        throw new Error('Pokemon ID is required');
    }
    
    const pokeApiPokemon = await pokemonService.getPokemon(pokemonId);
    return pokeApiPokemon;

}; 