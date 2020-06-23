import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByName'
})
export class FilterByNamePipe implements PipeTransform {

    transform(objects: any[], term: string): any[] {
        if (term) {
            return objects.filter(obj => {
                if (obj.name.toLowerCase().includes(term.toLowerCase())) {
                    return obj;
                }
            });
        } else {
            return objects;
        }
    }

}
