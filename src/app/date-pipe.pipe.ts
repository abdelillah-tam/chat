import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe',
  standalone: true,
})
export class DatePipePipe implements PipeTransform {
  transform(value: number | string, ...args: unknown[]): any {
    if (typeof value === 'string') {
      return value;
    }

    let formatDate = new Date(value);

    let year = formatDate.getUTCFullYear();
    let month: string | number = formatDate.getUTCMonth() + 1;
    let day = formatDate.getUTCDate();

    if (month < 10) {
      month = '0' + month;
    }

    

    return year + '-' + month + '-' + day;
  }
}
