import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leadingZeros',
  standalone: true
})
export class LeadingZerosPipe implements PipeTransform {

  transform(num: number, size = 6): string {
    let result = num.toString();
    while (result.length < size) {
      result = '0' + result;
    }
    return result;
  }

}
