import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'genreList',
    standalone: true
})
export class GenreListPipe implements PipeTransform {
    transform(genres: Array<{ id: number, name: string }>): string {
        return genres.map(genre => genre.name).join(', ');
    }
}