import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  flagError: boolean = false;
  msjError: string = "";

  constructor(private auth: Auth, private data: DataService) { 
  }

  IsMailVerificated() : boolean{
    return this.auth.currentUser?.emailVerified!;
  }

  Register(email: string, pass: string) { 
    createUserWithEmailAndPassword(this.auth, email, pass).then((res) => {   
      this.flagError = false;
      console.log(res);
    }).catch((e) => {
      this.flagError = true;

      switch (e.code) {
        case "auth/invalid-email":
          this.data.executePopUp("El email ingresado es inválido.");
          break;
        case "auth/email-already-in-use":
          this.data.executePopUp("El email ingresado ya se encuentra registrado.");
          break;
        default:
          this.msjError = e.code
          break;
      }
    });
  }
}
