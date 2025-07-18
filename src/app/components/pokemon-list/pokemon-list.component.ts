import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { NamedAPIResource } from 'pokeapi-js-wrapper';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonListItemComponent } from '../pokemon-list-item/pokemon-list-item.component';

@Component({
    selector: 'app-pokemon-list',
    template: `
        <header class="relative flex flex-row items-start z-2">
            <nav class="z-2 flex flex-row bg-[#d71f06] py-8 pl-[30px] pr-16 rounded-tl-2xl rounded-br-2xl ">
                <button class="big-button blue"></button>
            </nav>
            <div class="nav-shadow z-1 absolute left-0 bottom-0  w-6 shadow-[4px_4px_8px_4px_rgba(0,0,0,0.5)]"></div>

            <div class="top-bar">
                <button class="small-button red"></button>
                <button class="small-button yellow"></button>
                <button class="small-button green"></button>
            </div>
        </header>

        <div class="section-wrapper max-h-[calc(100%-76px)] flex flex-col flex-grow p-8 pt-0 -mt-12 bg-[#d71f06] rounded-bl-4xl">
            <section class="flex flex-col bg-black text-white flex-grow overflow-auto py-12 px-2 rounded-4xl rounded-bl-2xl rounded-tr-none shadow-[inset_0_-1px_2px_3px_#808080]">
                @for (pokemon of pokemonList(); let index = $index; track pokemon.name) {
                    <app-pokemon-list-item [index]="$index + offset()" [pokemon]="pokemon" />
                }

            </section>
            <div class="flex flex-row justify-between items-center mt-4 text-white">
                <button class="big-button blue" (click)="onPreviousPage.emit()">
                    <span class="text-2xl font-bold">
                        -
                    </span>
                </button>
                Showing {{ offset() + 1 }} - {{ offset() + 20 }} of {{ count() }}
                <button class="big-button blue" (click)="onNextPage.emit()">
                    <span class="text-2xl font-bold">+</span>
                </button>
            </div>
        </div>

        <footer>
        </footer>
    `,
    styleUrl: './pokemon-list.component.scss',
    imports: [PokemonListItemComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent {
    readonly pokemonList = input<NamedAPIResource[]>([]);
    readonly offset = input<number>(0);
    readonly count = input<number>(0);
    readonly onPreviousPage = output();
    readonly onNextPage = output();

    constructor() {
        injectTwHostClass(() => 'flex flex-col');
    }
}
