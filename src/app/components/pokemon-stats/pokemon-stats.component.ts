import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { Pokemon } from 'pokeapi-js-wrapper';

@Component({
    selector: 'app-pokemon-stats',
    imports: [CommonModule],
    template: `
            
        <div class="text-center">
            <div class="inline-block text-white px-4 py-2 rounded border-2">
                <span class="text-sm font-bold text-white ">
                    TOTAL: {{ totalStats() }}
                </span>
            </div>
        </div>
        
        <div class="space-y-4">
            <div *ngFor="let stat of pokemon().stats" class="stat-item">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-lg font-bold uppercase tracking-wide ">
                        {{ stat.stat.name.replace('-', ' ') | titlecase }}
                    </span>
                    <span class="text-lg font-bold px-2 py-1 rounded border-2 border-white">
                        {{ stat.base_stat }}
                    </span>
                </div>
                
                <div class="relative bg-white rounded h-4 border border-white overflow-hidden">
                    <div 
                        class="h-full bg-cyan-500"
                        [style.width.%]="Math.min((stat.base_stat / 255) * 100, 100)"
                    ></div>
                </div>
            </div>
        </div>
            

    `,
})
export class PokemonStatsComponent {
    readonly pokemon = input.required<Pokemon>();

    Math = Math;
    totalStats = signal(0);

    ngOnChanges() {
        this.totalStats.set(
            this.pokemon().stats.reduce((total, stat) => total + stat.base_stat, 0)
        );
    }
} 