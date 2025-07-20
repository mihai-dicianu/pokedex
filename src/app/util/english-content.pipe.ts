import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'englishContent',
    standalone: true
})
export class EnglishContentPipe implements PipeTransform {
    transform(value: any[] | null | undefined, property?: string): any {
        if (!value || !Array.isArray(value)) {
            return value;
        }

        // Find the English entry
        const englishEntry = value.find(item => 
            item.language?.name === 'en' || 
            item.language?.name === 'en-us' ||
            item.language?.name === 'en-gb'
        );

        if (!englishEntry) {
            // Fallback to first entry if no English found
            return value[0];
        }

        // If a specific property is requested, return that property
        if (property && englishEntry[property] !== undefined) {
            return englishEntry[property];
        }

        // Return the entire English entry
        return englishEntry;
    }
}
