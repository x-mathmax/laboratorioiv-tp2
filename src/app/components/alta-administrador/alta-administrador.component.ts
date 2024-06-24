import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators, FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { Administrador } from '../../models/Administrador';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-alta-administrador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxCaptchaModule],
  templateUrl: './alta-administrador.component.html',
  styleUrl: './alta-administrador.component.css'
})
export class AltaAdministradorComponent implements OnInit {
  form!: FormGroup;
  selectedFile: File | null = null;
  administradorAlta : Administrador;
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
    this.administradorAlta = new Administrador('', '', 0, 0, '', '', '', '');
    }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      apellido: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      edad: new FormControl("", Validators.min(18)),
      dni: new FormControl("", Validators.maxLength(8)),
      email: new FormControl("", [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      password: new FormControl("", Validators.minLength(6)),
      imagen: new FormControl(""),
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


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log("selected:", this.selectedFile );
    console.log("event:", event.target.files[0])
  }

  async cargarImagenYObtenerURL(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storage.uploadImage(file).subscribe({
        next: (url) => {
          this.administradorAlta.foto = url;
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar imagen:', err);
          reject(err);
        }
      });
    });
  }

  async cargarAdministrador(){
    this.administradorAlta.nombre = this.form.get('nombre')?.value;
    this.administradorAlta.apellido = this.form.get('apellido')?.value;
    this.administradorAlta.edad = this.form.get('edad')?.value;
    this.administradorAlta.dni = this.form.get('dni')?.value;
    this.administradorAlta.email = this.form.get('email')?.value;
    this.administradorAlta.password = this.form.get('password')?.value;

    if (this.form.valid && this.selectedFile) {
        try {
          const primera = await this.cargarImagenYObtenerURL(this.selectedFile);

          //agrego el alta en el auth además de en la base de datos.
          const segunda = await this.auth.Register(this.administradorAlta.email, this.administradorAlta.password);

          const tercera = await this.firestoreService.agregarAdministrador(this.administradorAlta);


            console.log('Administrador creado exitosamente.');
            this.data.executePopUp('Administrador creado exitosamente.');
            this.form.reset();
        } catch (error) {
          console.error('Error al cargar administrador:', error);
        }
      } else {
        console.error('Formulario inválido o no se ha seleccionado un archivo.');
    }
  }
}
