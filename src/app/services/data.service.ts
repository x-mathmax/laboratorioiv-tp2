import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  setUserAndPassTest(username:string, password:string): void {
    localStorage.setItem('username', JSON.stringify(username));
    localStorage.setItem('password', JSON.stringify(password));
  }

  executePopUp(mensaje : string):void {
    Swal.fire({
      title: mensaje,
      width: 600,
      padding: "3em",
      color: "#000",
      background: "#fff url(/assets/swalBackground.jpg)",
      backdrop: `
        rgba(0,0,0,0.6)
      `,
      customClass: {
        confirmButton: 'custom-confirm-button-class'
      },
      confirmButtonColor: '#285E96',
      confirmButtonText: 'Aceptar'
    });
  }

  separoString(input: string): string[] {
    return input.split(',').map(campo => campo.trim());
  }
}
