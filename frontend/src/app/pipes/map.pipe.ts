import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'map',
    standalone: true
})
export class MapPipe implements PipeTransform {
    transform(array: any[], property: string): any[] {
        return array.map(item => item[property]);
    }
}