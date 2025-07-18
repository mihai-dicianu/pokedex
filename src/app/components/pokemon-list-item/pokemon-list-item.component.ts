import { UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SimplePokemon } from 'types/simple-pokemon.type';

@Component({
    selector: 'app-pokemon-list-item',
    template: `
        <a 
            [routerLink]="['', { outlets: { detail: [pokemon().name] } }]"
            class="block p-2 rounded text-white no-underline hover:bg-gray-200/30"
        >
            {{ index() + 1 }}
            {{ pokemon().name | uppercase }}
        </a>
    `,
    imports: [RouterLink, UpperCasePipe],
})
export class PokemonListItemComponent {
    readonly index = input.required<number>();
    readonly pokemon = input.required<SimplePokemon>();
}
