import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators, FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/Paciente';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-alta-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxCaptchaModule, FormsModule],
  templateUrl: './alta-pacientes.component.html',
  styleUrl: './alta-pacientes.component.css'
})
export class AltaPacientesComponent implements OnInit{
  form!: FormGroup;
  selectedFile: File | null = null;
  selectedFileTwo: File | null = null;
  pacienteAlta : Paciente;
  siteKey : string = '6LcscvUpAAAAAMrDsxFrU2VhCw9H01xGa3i7APtx';
  captchaResponse: string | undefined;
  captchaResolved: boolean = false;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private storage: StorageService,
    private auth: AuthService,
    private data: DataService
  ) {
    this.pacienteAlta = new Paciente('', '', 0, 0, '', '', '', '', '', '');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      apellido: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      edad: new FormControl("", Validators.min(18)),
      dni: new FormControl("", Validators.maxLength(8)),
      obraSocial: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      password: new FormControl("", Validators.minLength(4)),
      imagenUno: new FormControl(""),
      imagenDos: new FormControl(""),
      recaptcha: new FormControl("")
    });
  }
  get nombre() {
    return this.form.get('nombre');
  }
  get apellido() {
    return this.form.get('apellido');
  }
  get edad() {
    return this.form.get('edad');
  }
  get dni() {
    return this.form.get('dni');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get capchita() {
    return this.form.get('recaptcha');
  }

  resolvedCaptcha(response: string): void {
    console.log("response",response);
    this.captchaResolved = true;
  }

  onFileSelected(event: any, inputNumber: number): void {
    const file = event.target.files[0];
    if (inputNumber === 1) {
      this.selectedFile = file;
    } else if (inputNumber === 2) {
      this.selectedFileTwo = file;
    }
  }

  async cargarImagenesYObtenerURL(fileOne: File, fileTwo: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let url1: string | undefined;
      let url2: string | undefined;
      
      const subscription1 = this.storage.uploadImage(fileOne).subscribe({
        next: (url) => {
          url1 = url;
          if (url1) {
            this.pacienteAlta.imagenUno = url1;
            resolve();
          }
        },
        error: (err) => {
          console.error('Error al cargar primera imagen:', err);
          reject(err);
        }
      });
  
      const subscription2 = this.storage.uploadImage(fileTwo).subscribe({
        next: (url) => {
          url2 = url;
          if (url2) {
            this.pacienteAlta.imagenDos = url2;
            resolve();
          }
        },
        error: (err) => {
          console.error('Error al cargar segunda imagen:', err);
          reject(err);
        }
      });
    });
  }


  async cargarPaciente(){
      this.pacienteAlta.nombre = this.form.get('nombre')?.value;
      this.pacienteAlta.apellido = this.form.get('apellido')?.value;
      this.pacienteAlta.edad = this.form.get('edad')?.value;
      this.pacienteAlta.dni = this.form.get('dni')?.value;
      this.pacienteAlta.obraSocial = this.form.get('obraSocial')?.value;
      this.pacienteAlta.mail = this.form.get('email')?.value;
      this.pacienteAlta.password = this.form.get('password')?.value;


      if (this.form.valid && this.selectedFile && this.selectedFileTwo) {
        try {
            console.log("fotouno", this.selectedFile)
            console.log("fotoDos", this.selectedFileTwo);
            console.log("forms", this.form.valid);
            const primera = await this.cargarImagenesYObtenerURL(this.selectedFile, this.selectedFileTwo);
            const segunda = await this.auth.Register(this.pacienteAlta.mail, this.pacienteAlta.password);
            const tercera = await this.firestoreService.agregarPaciente(this.pacienteAlta);
            
            this.data.executePopUp('Paciente agregado exitosamente.');

            console.log('Paciente agregado exitosamente.');
            this.form.reset();
          } catch (error) {
            console.error('Error al cargar paciente:', error);
          }
      } else {
        console.error('Formulario inválido o no se han seleccionado ambos archivos.');
      }
    }
  }

