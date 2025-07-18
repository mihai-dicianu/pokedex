import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from 'types/pokemon.type';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';

@Component({
    selector: 'app-pokemon-detail',
    imports: [PokemonInfoComponent],
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
            <!-- Q: Should these become a separate button/tab component? Maybe use existing lib? -->
            <button class="bg-cyan-300 p-2 rounded-md">Tab 1</button>
            <button class="bg-cyan-300 p-2 rounded-md">Tab 2</button>
            <button class="bg-cyan-300 p-2 rounded-md">Tab 3</button>
        </div>

        <div class="grow bg-gray-200 p-2 rounded-md">Tab content goes here</div>
    `,
})
export class PokemonDetailContainer implements OnInit{
    private readonly route = inject(ActivatedRoute);
    readonly pokemon = signal<Pokemon | undefined>(undefined);

    constructor() {
        injectTwHostClass(() => 'flex flex-col gap-4 p-5 pt-20');
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.pokemon.set(data['pokemon']);
        });
    }
}
