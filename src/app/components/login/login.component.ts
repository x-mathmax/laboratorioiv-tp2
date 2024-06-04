import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  loginForm!: FormGroup;

  constructor(private dataService: DataService, private router: Router, public auth: Auth, private firestoreService : FirestoreService,
    private fb: FormBuilder
  ) { 
    this.username = '';
    this.password = '';
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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
    this.loginForm.patchValue({
      username: 'administrador@gmail.com',
      password: 'admin1234'
    });
    this.username = 'administrador@gmail.com';
    this.password = 'admin1234';
  }

  espeLoading():void {
    this.loginForm.patchValue({
      username: 'especialista@gmail.com',
      password: 'espe1234'
    });
    this.username = 'especialista@gmail.com';
    this.password = 'espe1234';
  }

  paciLoading():void {
    this.loginForm.patchValue({
      username: 'paciente@gmail.com',
      password: 'paci1234'
    });
    this.username = 'paciente@gmail.com';
    this.password = 'paci1234';
  }

  goinit():void {
    this.router.navigate(['/welcome']);
  }
}
