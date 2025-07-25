import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonAbilitiesComponent } from 'components/pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from 'components/pokemon-stats/pokemon-stats.component';
import { Pokedex, Pokemon } from 'pokeapi-js-wrapper';
import { Subscription } from 'rxjs';
import { ClickSoundDirective } from 'util/click-sound.directive';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonEvolutionComponent } from '../../components/pokemon-evolution/pokemon-evolution.component';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';

@Component({
    selector: 'app-pokemon-detail',
    imports: [PokemonInfoComponent, CommonModule, PokemonAbilitiesComponent, PokemonStatsComponent, ClickSoundDirective, PokemonEvolutionComponent],
    template: `
        <div class="w-full bg-black text-white h-60 min-h-60 p-2 rounded-md shadow-inner">
            @if (loading()) {
                <div class="flex justify-center items-center h-full">
                    <div class="text-white text-xl">Loading Pokémon details...</div>
                </div>
            } @else if (error()) {
                <div class="flex flex-col items-center justify-center h-full text-white">
                    <div class="text-xl mb-4">Error loading Pokémon</div>
                    <div class="text-sm mb-4">{{ error()?.message }}</div>
                    <button 
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        (click)="retry()"
                    >
                        Retry
                    </button>
                </div>
            } @else if (pokemon() && !prompted()) {
                <div class="flex flex-col items-center justify-center h-full text-white">
                    <div class="text-xl mb-4">🔊 Sound Level Confirmation</div>
                    <div class="text-sm mb-6 text-center">
                        This app will play Pokémon cry sounds.<br>
                        Please lower your volume.
                    </div>
                    <div class="flex gap-2">
                        <button 
                            class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
                            (click)="confirmSound()"
                        >
                            ✅ Confirm
                        </button>
                        <button
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
                            (click)="disableSound()"
                        >
                            ❌ Disable
                        </button>
                    </div>
                </div>
            } @else if (pokemon()) {
                <app-pokemon-info [pokemonInfo]="pokemon()" [soundConfirmed]="soundConfirmed()" (onToggleSound)="onToggleSound()"/>
            } @else {
                <div class="flex justify-center items-center h-full">
                    <div class="text-white text-xl">No Pokémon found</div>
                </div>
            }
        </div>

        <div class="flex flex-row *:flex-auto gap-2">
            <button clickSound class="bg-cyan-300 p-2 rounded-md cursor-pointer" [class.bg-cyan-500]="tabNumber() === 0" (click)="tabNumber.set(0)">Evolution</button>
            <button clickSound class="bg-cyan-300 p-2 rounded-md cursor-pointer" [class.bg-cyan-500]="tabNumber() === 1" (click)="tabNumber.set(1)">Abilities</button>
            <button clickSound class="bg-cyan-300 p-2 rounded-md cursor-pointer" [class.bg-cyan-500]="tabNumber() === 2" (click)="tabNumber.set(2)">Stats</button>
        </div>

        <div class="grow overflow-y-auto bg-black text-white p-2 rounded-md space-y-4">
            @if(loading()) {
                <div class="flex justify-center items-center h-full">
                    <div class="text-white text-xl">Loading Pokémon details...</div>
                </div>
            } @else {    
                @if (pokemon() && prompted()) {
                    @if (tabNumber() === 0) {
                        <app-pokemon-evolution [pokemon]="pokemon()" />
                    } @else if (tabNumber() === 1) {
                        <app-pokemon-abilities [pokemon]="pokemon()" />
                    } @else if (tabNumber() === 2) {
                        <app-pokemon-stats [pokemon]="pokemon()" />
                    }
                }
            }
        </div>
    `,
})
export class PokemonDetailContainer implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private routeSubscription?: Subscription;
    
    readonly pokemon = signal<Pokemon | undefined>(undefined);
    readonly loading = signal(true);
    readonly error = signal<Error | null>(null);
    readonly prompted = signal(false);
    readonly soundConfirmed = signal(false);
    readonly pokedex = new Pokedex();
    readonly tabNumber = signal(0);

    constructor() {
        injectTwHostClass(() => 'flex flex-col gap-4 p-5 pt-20 max-w-full overflow-hidden');
    }

    ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            const pokemonId = params.get('pokemonId');
            if (pokemonId) {
                this.loadPokemon(pokemonId);
            } else {
                this.error.set(new Error('No Pokémon ID provided'));
                this.loading.set(false);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }

    confirmSound(): void {
        this.soundConfirmed.set(true);
        this.prompted.set(true);
    }

    onToggleSound(): void {
        this.soundConfirmed.set(!this.soundConfirmed());
    }

    disableSound(): void {
        this.soundConfirmed.set(false);
        this.prompted.set(true);
    }

    async loadPokemon(pokemonId: string) {
        const startTime = Date.now();
        const MIN_LOADING_TIME = 1000;
        
        try {
            this.error.set(null);
            this.loading.set(true);
            this.pokemon.set(undefined);
            
            const pokemon = await this.pokedex.getPokemonByName(pokemonId);
            
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < MIN_LOADING_TIME) {
                await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
            }
            
            this.pokemon.set(pokemon);
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
            this.error.set(error instanceof Error ? error : new Error('Failed to load Pokémon'));
        } finally {
            this.loading.set(false);
        }
    }

    retry() {
        const pokemonId = this.route.snapshot.paramMap.get('pokemonId');
        if (pokemonId) {
            this.loadPokemon(pokemonId);
        }
    }
}
