import { Component, OnInit, signal } from '@angular/core';

import { NamedAPIResource, Pokedex } from 'pokeapi-js-wrapper';
import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';

@Component({
    selector: 'app-all-pokemon-list',
    imports: [PokemonListComponent],
    template: ` <app-pokemon-list [pokemonList]="allPokemon()" [count]="count" [offset]="offset" (onPreviousPage)="onPreviousPage()" (onNextPage)="onNextPage()" /> `,
})
export class AllPokemonListContainer implements OnInit{
    pokedex = new Pokedex();

    offset = 0;
    limit = 20;
    count = 0;

    allPokemon = signal<NamedAPIResource[]>([]);

    constructor() {
        this.pokedex.getPokemonsList({ offset: 0, limit: 20 }).then(response => {
            console.log(response);
            this.allPokemon.set(response.results);
            this.count = response.count;
        });
    }

    ngOnInit(): void {
        this.pokedex.getPokemonsList({ offset: 0, limit: 20 }).then(response => {
            console.log(response);
            this.allPokemon.set(response.results);
        });
    }

    getPokemonList() {
        this.pokedex.getPokemonsList({ offset: this.offset, limit: this.limit }).then(response => {
            this.allPokemon.set(response.results);
        });
    }

    onNextPage() {
        if (this.offset + this.limit > this.count) {
            return;
        }
        this.offset += this.limit;
        this.getPokemonList();
    }

    onPreviousPage() {
        if (this.offset - this.limit < 0) {
            return;
        }
        this.offset -= this.limit;
        this.getPokemonList();
    }
}