import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tipoUser: string;

  constructor(private auth: Auth) { 
    this.tipoUser = '';
  }

  getTipoUser(): string {
    //llamar método del firestoreserv que me traiga el tipo de usuario 
    //harcodeo para pruebas momentaneamente
    this.tipoUser = 'administrador';
    return this.tipoUser;
  }

  isMailVerificated() : boolean{
    return this.auth.currentUser?.emailVerified!;
  }
}
