import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tipoUser: string;

  constructor() { 
    this.tipoUser = '';
  }

  getTipoUser(): string {
    //llamar método del firestoreserv que me traiga el tipo de usuario 
    //harcodeo para pruebas momentaneamente
    this.tipoUser = 'administrador';
    return this.tipoUser;
  }
}
