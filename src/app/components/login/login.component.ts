import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTooltipModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  tipoUser: string;
  username: string;
  contra: string;

  constructor(private dataService: DataService, private router: Router, public auth: Auth, private firestoreService : FirestoreService,
    private authService: AuthService, private fb: FormBuilder
  ) { 
    this.tipoUser = '';
    this.username = '';
    this.contra = '';
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      password: new FormControl("", Validators.minLength(6)),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  async Login(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.username = this.loginForm.get('email')?.value;
      this.contra = this.loginForm.get('password')?.value;

      console.log(this.username, this.contra);
      signInWithEmailAndPassword(this.auth, this.username, this.contra).then(async (res) => {
        console.log(this.username, this.contra);
        if (res.user.email !== null) {
          if (this.authService.IsMailVerificated()) {
            this.username = res.user.email;
            try {
              const { tipoUser, habilitado } = await this.firestoreService.getAndSaveTipoUserAndStatusByEmail(this.username);
              if (tipoUser == 'especialista' && habilitado == true || tipoUser == 'administrador' || tipoUser == 'paciente' ) {
                this.dataService.setUserAndPassTest(this.username, '');
                
                this.firestoreService.getAndSaveTipoUserByEmail(this.username)
                  .then(data => {
                    console.log("Datos de get bla bla", data);
                  })
                  .catch(error => {
                    console.error("Error:", error);
                  });
  
                this.router.navigate(['/home']);
                resolve();
              } else {
                this.dataService.executePopUp("Perfil no validado por administrador.");
                reject(new Error("Perfil no validado por administrador."));
              }
            } catch (error) {
              console.error("Error:", error);
              reject(error);
            }
          } else {
            this.dataService.executePopUp("Debe validar su email para ingresar..");
            reject(new Error("Debe validar su email para ingresar."));
          }
        }
      }).catch((e) => {
        console.log(e);
        switch (e.code) {
          case "auth/invalid-email":
            this.dataService.executePopUp("El email ingresado es inválido.");
            reject(new Error("El email ingresado es inválido."));
            break;
          default:
            this.dataService.executePopUp("Login fallido. Por favor, reintente.");
            reject(new Error("Login fallido. Por favor, reintente."));
            break;
        }
      });
    });
  }

  // adminLoading():void {
  //   this.loginForm.patchValue({
  //     username: 'administrador@gmail.com',
  //     password: 'admin1234'
  //   });
  //   this.username = 'administrador@gmail.com';
  //   this.password = 'admin1234';
  // }

  // espeLoading():void {
  //   this.loginForm.patchValue({
  //     username: 'especialista@gmail.com',
  //     password: 'espe1234'
  //   });
  //   this.username = 'especialista@gmail.com';
  //   this.password = 'espe1234';
  // }

  // paciLoading():void {
  //   this.loginForm.patchValue({
  //     username: 'paciente@gmail.com',
  //     password: 'paci1234'
  //   });
  //   this.username = 'paciente@gmail.com';
  //   this.password = 'paci1234';
  // }

  goinit():void {
    this.router.navigate(['/welcome']);
  }

  //w5b3g.test@inbox.testmail.app
  //test1234
  // especialista
  
}
