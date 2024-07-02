import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoUsuario',
  standalone: true
})
// export class EstadoUsuarioPipe implements PipeTransform {
//   transform(habilitado: boolean): string {
//     return habilitado ? '<span style="color: green;">Habilitado</span>' : '<span style="color: red;">Deshabilitado</span>';
//   }
// }

export class EstadoUsuarioPipe implements PipeTransform {

  transform(habilitado: boolean | null | undefined): string {
    if (habilitado === null || habilitado === undefined) {
      return ''; // Devolver vacío si habilitado es null o undefined
    }

    return habilitado ? 'Habilitado' : 'Deshabilitado';
  }
}
