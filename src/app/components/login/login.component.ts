import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string;
  password: string;

  constructor(private dataService: DataService, private router: Router, public auth: Auth, private firestoreService : FirestoreService) { 
    this.username = '';
    this.password = '';
  }

  Login() {
    signInWithEmailAndPassword(this.auth, this.username, this.password).then((res) => {
      if (res.user.email !== null) {
        this.username = res.user.email;
        this.dataService.setUserAndPassTest(this.username, '');
        this.router.navigate(['/home']);
      } 
      
    }).catch((e) => {
      console.log(e);
      this.dataService.executePopUp("Login fallido. Por favor, reintente.");
    });
    
  }

  adminLoading():void {
    this.username = 'administrador@gmail.com';
    this.password =  'admin1234';
  }

  espeLoading():void {
    this.username = 'especialista@gmail.com';
    this.password =  'espe1234';
  }

  paciLoading():void {
    this.username = 'paciente@gmail.com';
    this.password =  'paci1234';
  }

  // goRegister():void {
  //   this.router.navigate(['/register']);
  // }

  goinit():void {
    this.router.navigate(['/welcome']);
  }
}
