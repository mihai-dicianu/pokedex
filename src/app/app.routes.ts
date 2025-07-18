import { Routes } from '@angular/router';

import { AllPokemonListContainer } from './containers/all-pokemon-list/all-pokemon-list.container';
import { PokemonDetailContainer } from './containers/pokemon-detail/pokemon-detail.container';
import { PokemonDetailResolver } from './util/pokemon-detail.resolver';

export const routes: Routes = [
    { path: 'all', component: AllPokemonListContainer },
    { path: ':pokemonId', component: PokemonDetailContainer, outlet: 'detail', resolve: { pokemon: PokemonDetailResolver } },

    { path: '', redirectTo: '/all(detail:bulbasaur)', pathMatch: 'full' },
];
