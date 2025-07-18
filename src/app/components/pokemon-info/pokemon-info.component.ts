import { Component, input } from '@angular/core';
import { Pokemon } from 'pokeapi-js-wrapper';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { TypewriterComponent } from '../../typewriter/typewriter.component';

@Component({
    selector: 'app-pokemon-info',
    imports: [TypewriterComponent],
    template: `
        <app-typewriter class="text-4xl font-bold block pb-4" [text]="pokemonInfo()?.name" />
        <app-typewriter [text]="'height: ' + pokemonInfo()?.height.toString() + ' dm'" />
        <app-typewriter [text]="'weight: ' + pokemonInfo()?.weight.toString() + ' hg'" />
        @if (pokemonInfo()?.base_experience) {
            <app-typewriter [text]="'base XP: ' + pokemonInfo()?.base_experience.toString()" />
        }

        <div class="absolute top-0 right-0 h-24 w-24">
            @if (pokemonInfo(); as pokemonInfo) {
                <div
                    class="h-full w-full bg-center bg-contain [image-rendering:pixelated] grayscale brightness-150"
                    [style.background-image]="'url(' + pokemonInfo.sprites['front_default'] + ')'"
                ></div>
            }
        </div>
    `,
})
export class PokemonInfoComponent {
    readonly pokemonInfo = input<Pokemon>();

    constructor() {
        injectTwHostClass(() => 'relative block w-full h-full');
    }
}
