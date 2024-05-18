import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexToDec'
})
export class HexToDecPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    console.log('pipe ',value)
    return parseInt(value, 16);
  }

}
