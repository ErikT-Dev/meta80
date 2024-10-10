import { Pipe, PipeTransform } from '@angular/core';
import { SortOption } from '../filter.service';

@Pipe({
    name: 'sortOptionDisplay',
    standalone: true
})
export class SortOptionDisplayPipe implements PipeTransform {
    transform(option: SortOption): string {
        switch (option) {
            case 'year': return 'Year';
            case 'length': return 'Length';
            case 'title': return 'Title';
            case 'imdb': return 'IMDb Rating';
            case 'rottenTomatoes': return 'Rotten Tomatoes';
            case 'metacritic': return 'Metacritic';
            default: return option;
        }
    }
}