import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoColor',
  standalone: true
})
export class EstadoColorPipe implements PipeTransform {
  transform(estado: string): string {
    let colorClass = '';

    switch (estado) {
      case 'pendiente':
        colorClass = 'yellow-text';
        break;
      case 'cancelado':
        colorClass = 'red-text';
        break;
      case 'finalizado':
        colorClass = 'blue-text';
        break;
      default:
        colorClass = '';
        break;
    }

    return colorClass;
  }

}
