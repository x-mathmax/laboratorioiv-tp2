import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, User} from '@angular/fire/auth';
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


  async Register(email: string, pass: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, pass).then((res) => {
        this.flagError = false;
        console.log(res);
        if (res.user.email != null){
          sendEmailVerification(res.user);
        }
        resolve();
      })
      .catch((e) => {
        this.flagError = true;
  
        switch (e.code) {
          case "auth/invalid-email":
            this.data.executePopUp("El email ingresado es inválido.");
            break;
          case "auth/email-already-in-use":
            this.data.executePopUp("El email ingresado ya se encuentra registrado.");
            break;
          default:
            this.msjError = e.code;
            break;
        }
        reject(e);
      });
    });
  }
}
