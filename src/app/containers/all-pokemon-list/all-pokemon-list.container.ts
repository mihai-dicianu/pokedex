import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NamedAPIResource, Pokedex } from 'pokeapi-js-wrapper';
import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';

@Component({
    selector: 'app-all-pokemon-list',
    imports: [PokemonListComponent, CommonModule],
    template: `
     
        <app-pokemon-list 
        [pokemonList]="allPokemon()" 
        [count]="count" 
        [offset]="offset" 
        (onPreviousPage)="onPreviousPage()" 
        (onNextPage)="onNextPage()" 
        > 
            @if (loading()) {
                <div class="flex justify-center items-center h-64">
                    <div class="text-white text-xl">Loading Pokémon...</div>
                </div>
            } @else if (error()) {
                <div class="flex flex-col items-center justify-center h-64 text-white">
                    <div class="text-xl mb-4">Error loading Pokémon</div>
                    <div class="text-sm mb-4">{{ error()?.message }}</div>
                    <button 
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        (click)="retry()"
                    >
                        Retry
                    </button>
                </div>
            }
        </app-pokemon-list>
        
    `,
})
export class AllPokemonListContainer implements OnInit{
    pokedex = new Pokedex();

    offset = 0;
    limit = 20;
    count = 0;

    allPokemon = signal<NamedAPIResource[]>([]);
    loading = signal(true);
    error = signal<Error | null>(null);

    constructor() {
    }

    ngOnInit(): void {
        this.getPokemonList();
    }
    

    async getPokemonList() {
        const startTime = Date.now();
        const MIN_LOADING_TIME = 1000; 
        
        try {
            this.error.set(null);
            this.loading.set(true);
            this.allPokemon.set([]);
            
            const response = await this.pokedex.getPokemonsList({ offset: this.offset, limit: this.limit });
            
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < MIN_LOADING_TIME) {
                await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
            }
            
            this.allPokemon.set(response.results);
            this.count = response.count;
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            this.error.set(error instanceof Error ? error : new Error('Failed to load Pokémon'));
        } finally {
            this.loading.set(false);
        }
    }
    
    retry() {
        this.getPokemonList();
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