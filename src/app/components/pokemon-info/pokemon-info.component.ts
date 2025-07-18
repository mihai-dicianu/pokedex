import { Component, input } from '@angular/core';
import { Pokemon } from 'pokeapi-js-wrapper';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { TypewriterComponent } from '../../typewriter/typewriter.component';

@Component({
    selector: 'app-pokemon-info',
    imports: [TypewriterComponent],
    template: `
        <app-typewriter [text]="pokemonInfo()?.name" />

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
