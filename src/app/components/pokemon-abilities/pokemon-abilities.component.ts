import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Ability, Pokedex, Pokemon } from 'pokeapi-js-wrapper';
import { EnglishContentPipe } from 'util/english-content.pipe';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';

@Component({
  selector: 'app-pokemon-abilities',
  imports: [CommonModule, EnglishContentPipe, RouterModule],
  template: `
  <div class="flex flex-col gap-4 justify-start items-start">
    @for (ability of abilities; track $index) {
      <div class="flex flex-col items-start gap-2">

      <div class="flex flex-wrap items-baseline gap-2">
        <span class="text-2xl font-bold">{{ability.name.replace('-', ' ') | titlecase}}</span>
        <select (change)="onPokemonSelect($event)" class="bg-black underline text-white inline-block">
                <option selected disabled>Other pokemon</option>
                @for (pokemon of ability.pokemon; track $index) {
                  @if (pokemon.pokemon.name !== this.pokemon().name) {
    
                    <option 
                      (click)="navigateToPokemon(pokemon.pokemon.name)" 
                      [value]="pokemon.pokemon.name"
                    >
                      {{pokemon.pokemon.name}}
                    </option>
                  }
                }
              </select>
      </div>

        <div class="flex items-start gap-2">
          <span class="bg-white text-black rounded-full px-2">i</span>
          <p>{{ability.effect_entries | englishContent:'short_effect'}}</p>
        </div>

      </div>
    }
  </div>

  `,
})
export class PokemonAbilitiesComponent {
  readonly pokemon = input.required<Pokemon>();
  readonly pokedex = new Pokedex();
  abilities: Ability[] = [];
  readonly router = inject(Router);
  constructor() {
    injectTwHostClass(() => 'flex flex-col gap-2 justify-start items-start');
  }

  async ngOnChanges() {
    const abilities = await this.pokedex.getAbilityByName(this.pokemon().abilities.map(ability => ability.ability.name));
    this.abilities = abilities;
  }

  navigateToPokemon(pokemon: string) {
    console.log('Navigating to:', pokemon);
    // Navigate to main route with auxiliary outlet
  }

  onPokemonSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedPokemon = select.value;
    
    if (selectedPokemon) {
      this.abilities = [];
      this.router.navigate([{ outlets: { detail: [selectedPokemon] } }]);
    }
  }
}
