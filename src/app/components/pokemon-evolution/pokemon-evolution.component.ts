import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EvolutionChain, Pokedex, Pokemon } from 'pokeapi-js-wrapper';
import { ClickSoundDirective } from 'util/click-sound.directive';

interface EvolutionNode {
    name: string;
    id: number;
    spriteUrl: string;
    evolutionDetails: any[];
    isCurrent: boolean;
}

@Component({
    selector: 'app-pokemon-evolution',
    imports: [CommonModule, ClickSoundDirective],
    template: `
        @if (evolutionChain(); as chain) {
            <div class="flex flex-col items-center gap-4">
                @for (node of evolutionNodes(); track node.name) {
                    <div class="flex flex-col items-center gap-2">
                        <div class="rounded-xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 text-center"
                                [class]="node.isCurrent ? 'border-cyan-700 bg-cyan-100' : 'bg-white border-2 border-white'"
                                (click)="navigateToPokemon(node.name)"
                                clickSound>
                            <div class="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                                <img 
                                    [src]="node.spriteUrl" 
                                    [alt]="node.name"
                                    class="max-w-full max-h-full object-contain [image-rendering:pixelated]"
                                />
                            </div>
                            <div class="text-center">
                                <h4 class="font-bold text-black text-sm m-0">{{ node.name | titlecase }}</h4>
                                <p class="text-black text-xs mt-1">#{{ node.id }}</p>
                            </div>
                        </div>
                        
                        @if (node.evolutionDetails && node.evolutionDetails.length > 0) {
                            <div class="flex flex-wrap gap-1 justify-center">
                                @for (detail of node.evolutionDetails; track $index) {
                                    <div class="flex gap-1 flex-wrap">
                                        @if (detail.min_level) {
                                            <span class="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold">Lvl.{{ detail.min_level }}</span>
                                        }
                                        @if (detail.item) {
                                            <span class="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold">{{ detail.item.name | titlecase }}</span>
                                        }
                                        @if (detail.trigger) {
                                            <span class="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold">{{ detail.trigger.name | titlecase }}</span>
                                        }
                                    </div>
                                }
                            </div>
                        }
                    </div>
                    
                    @if (!$last) {
                        <div class="text-2xl">
                            |
                        </div>
                    }
                }
            </div>
        } @else {
            <div class="text-center py-8">
                <p class="mt-2">Loading evolution chain...</p>
            </div>
        }
    `
})
export class PokemonEvolutionComponent implements OnInit {
    readonly router = inject(Router);
    readonly pokedex = new Pokedex();
    readonly pokemon = input.required<Pokemon>();
    
    evolutionChain = signal<EvolutionChain | undefined>(undefined);
    evolutionNodes = signal<EvolutionNode[]>([]);
    
    ngOnInit() {
        this.loadEvolutionChain();
    }
    
    async loadEvolutionChain() {
        try {
            const species = await this.pokedex.getPokemonSpeciesByName(this.pokemon().name);
            
            const chain = await this.pokedex.resource(species.evolution_chain.url);
            this.evolutionChain.set(chain);
            console.log(chain);
            
            const nodes = await this.buildEvolutionNodes(chain.chain);
            this.evolutionNodes.set(nodes);
            console.log(nodes);
        } catch (error) {
            console.error('Error loading evolution chain:', error);
        }
    }

    private async buildEvolutionNodes(chain: any): Promise<EvolutionNode[]> {
        const nodes: EvolutionNode[] = [];
        await this.addNodeToChain(chain, nodes);
        return nodes;
    }
    
    private async addNodeToChain(chain: any, nodes: EvolutionNode[]): Promise<void> {
        const pokemonData = await this.pokedex.getPokemonByName(chain.species.name);
        
        const node: EvolutionNode = {
            name: chain.species.name,
            id: pokemonData.id,
            spriteUrl: pokemonData.sprites.front_default,
            evolutionDetails: chain.evolution_details || [],
            isCurrent: chain.species.name === this.pokemon().name
        };
        
        nodes.push(node);
        
        for (const evolution of chain.evolves_to) {
            await this.addNodeToChain(evolution, nodes);
        }
    }
    
    navigateToPokemon(pokemonName: string) {
        this.router.navigate([{ outlets: { detail: [pokemonName] } }]);
    }

} 