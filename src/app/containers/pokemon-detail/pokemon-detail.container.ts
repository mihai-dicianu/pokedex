import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonAbilitiesComponent } from 'components/pokemon-abilities/pokemon-abilities.component';
import { PokemonStatsComponent } from 'components/pokemon-stats/pokemon-stats.component';
import { Pokedex, Pokemon } from 'pokeapi-js-wrapper';
import { ClickSoundDirective } from 'util/click-sound.directive';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';

@Component({
    selector: 'app-pokemon-detail',
    imports: [PokemonInfoComponent, CommonModule, PokemonAbilitiesComponent, PokemonStatsComponent, ClickSoundDirective],
    template: `
        <div class="w-full bg-black text-white h-60 p-2 rounded-md shadow-inner">
            @if (pokemon(); as pokemonInfo) {
                <app-pokemon-info [pokemonInfo]="pokemonInfo" />
            }
        </div>

        <!-- 
            TODO: make these tabs do something 
            - Look at https://github.com/Gabb-c/pokenode-ts and use data (+ types) from one of these endpoints
            - Implement something like moves, abilities, stats, ... whatever you think is cool
            - Be creative, do something you like
        -->
        <div class="flex flex-row *:flex-auto gap-2">
            <button clickSound class="bg-cyan-300 p-2 rounded-md cursor-pointer" [class.bg-cyan-500]="tabNumber() === 0" (click)="tabNumber.set(0)">Abilities</button>
            <button clickSound class="bg-cyan-300 p-2 rounded-md cursor-pointer" [class.bg-cyan-500]="tabNumber() === 1" (click)="tabNumber.set(1)">Stats</button>
            <button clickSound class="bg-cyan-300 p-2 rounded-md cursor-pointer" [class.bg-cyan-500]="tabNumber() === 2" (click)="tabNumber.set(2)">Moves</button>
        </div>

        <div class="grow overflow-y-auto bg-black text-white p-2 rounded-md space-y-4">
            @if (pokemon(); as pokemonInfo) {
                @if (tabNumber() === 0) {
                    <app-pokemon-abilities [pokemon]="pokemonInfo" />
                } @else if (tabNumber() === 1) {
                    <app-pokemon-stats [pokemon]="pokemonInfo" />
                } @else if (tabNumber() === 2) {
                    <!-- <app-pokemon-moves [pokemon]="pokemonInfo" /> -->
                }
            }
        </div>
    `,
})
export class PokemonDetailContainer implements OnInit{
    private readonly route = inject(ActivatedRoute);
    readonly pokemon = signal<Pokemon | undefined>(undefined);
    readonly pokedex = new Pokedex();
    readonly tabNumber = signal(0);

    constructor() {
        injectTwHostClass(() => 'flex flex-col gap-4 p-5 pt-20 max-w-full overflow-hidden');
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const pokemonId = params.get('pokemonId');
            this.pokedex.getPokemonByName(pokemonId).then(pokemon => {
                this.pokemon.set(pokemon);
            });
        });

    }
}
