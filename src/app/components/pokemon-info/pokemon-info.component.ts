import { CommonModule } from '@angular/common';
import { Component, input, output, SimpleChanges } from '@angular/core';
import { Pokemon } from 'pokeapi-js-wrapper';
import { ClickSoundDirective } from 'util/click-sound.directive';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { TypewriterComponent } from '../../typewriter/typewriter.component';

@Component({
    selector: 'app-pokemon-info',
    imports: [CommonModule, TypewriterComponent, ClickSoundDirective],
    template: `
        <app-typewriter class="text-4xl font-bold block mb-4" [text]="pokemonInfo()?.name.replace('-', ' ') | titlecase" />

        <div class="flex gap-2 mb-4">
            @for (type of pokemonInfo().types; track type.slot) {
                <span class="px-3 py-1 rounded-full text-white capitalize" [style.background-color]="typeColors[type.type.name]">
                    {{type.type.name}}
                </span>
            }
        </div>

        <app-typewriter [text]="'height: ' + pokemonInfo()?.height.toString() + ' dm'" />
        <app-typewriter [text]="'weight: ' + pokemonInfo()?.weight.toString() + ' hg'" />
        @if (pokemonInfo()?.base_experience) {
            <app-typewriter [text]="'base XP: ' + pokemonInfo()?.base_experience.toString()" />
        }

        <button clickSound class="mt-2 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded" (click)=" onToggleSound.emit()">
            @if (soundConfirmed()) {
                🔊
            } @else {
                🔇
            }
        </button>

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
    readonly soundConfirmed = input<boolean>(false);
    readonly onToggleSound = output<void>();
    
    typeColors: { [key: string]: string } = {
        'normal': '#A8A878',
        'fire': '#F08030',
        'water': '#6890F0',
        'electric': '#F8D030',
        'grass': '#78C850',
        'ice': '#98D8D8',
        'fighting': '#C03028',
        'poison': '#A040A0',
        'ground': '#E0C068',
        'flying': '#A890F0',
        'psychic': '#F85888',
        'bug': '#A8B820',
        'rock': '#B8A038',
        'ghost': '#705898',
        'dragon': '#7038F8',
        'dark': '#705848',
        'steel': '#B8B8D0',
        'fairy': '#EE99AC'
    };

    constructor() {
        injectTwHostClass(() => 'relative block w-full h-full max-w-full');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(this.soundConfirmed() && changes['pokemonInfo'] && changes['pokemonInfo'].currentValue) {
            this.playPokemonSound();
        }
    }

    playPokemonSound(): void {
        const pokemon = this.pokemonInfo();
        
        if (pokemon?.cries?.latest) {
            const audio = new Audio(pokemon.cries.latest);
            audio.play().catch((error) => {
                console.error('Failed to play Pokemon cry:', error);
            });
        } 
    }
}
