import { Component, signal } from '@angular/core';

import { NamedAPIResource } from 'pokeapi-js-wrapper';
import { PokemonService } from 'util/pokemon.service';
import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';

@Component({
    selector: 'app-all-pokemon-list',
    imports: [PokemonListComponent],
    template: ` <app-pokemon-list [pokemonList]="allPokemon()" /> `,
})
export class AllPokemonListContainer {
    allPokemon = signal<NamedAPIResource[]>([]);

    constructor(private readonly pokemonService: PokemonService) {
        this.pokemonService.getPokemonList(0, 20).then(response => {
            console.log(response);
            this.allPokemon.set(response.results);

        });
    }
}

// TODO: implement "fetch next page" so we can get more than 20 pokemons