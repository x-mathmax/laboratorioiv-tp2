import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators, FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { Especialista } from '../../models/Especialista';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { NgxCaptchaModule } from 'ngx-captcha';


@Component({
  selector: 'app-alta-especialistas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxCaptchaModule],
  templateUrl: './alta-especialistas.component.html',
  styleUrl: './alta-especialistas.component.css',
})
export class AltaEspecialistasComponent implements OnInit{
  form!: FormGroup;
  selectedFile: File | null = null;
  selectedFileTwo: File | null = null;
  mostrarOtraEspecialidad: boolean = false;
  especialistaAlta : Especialista;
  siteKey : string = '6LcscvUpAAAAAMrDsxFrU2VhCw9H01xGa3i7APtx';
  captchaResponse: string | undefined;
  captchaResolved: boolean = false;
  especialidades : any[] = [];;


  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private storage: StorageService,
    private auth: AuthService,
    private data: DataService
  ) {
    this.especialistaAlta = new Especialista('', '', 0, 0, '', '', '', '', '',false, '', '', '');
    }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      apellido: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      edad: new FormControl("", Validators.min(18)),
      dni: new FormControl("", Validators.maxLength(8)),
      especialidad: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      password: new FormControl("", Validators.minLength(6)),
      otraEspecialidad: new FormControl(" "),
      imagen: new FormControl(""),
      recaptcha: new FormControl("")
    });
    this.form.get('especialidad')!.valueChanges.subscribe(value => {
      this.mostrarOtraEspecialidad = value === 'otra';
      if (!this.mostrarOtraEspecialidad) {
        this.form.get('otraEspecialidad')!.reset();
      }
    });
    this.loadEspecialidades();
  }

loadEspecialidades() {
  this.firestoreService.getCollectionData('especialidades').subscribe((data: any[]) => {
    this.especialidades = data.map(item => item.nombre);
    console.log(this.especialidades);
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
  get otraEspecialidad() {
    return this.form.get('otraEspecialidad');
  }
  get capchita() {
    return this.form.get('recaptcha');
  }

  resolvedCaptcha(response: string): void {
    // this.form.get('recaptcha')?.setValue(true);
    // this.form.patchValue({ recaptcha: true })
    console.log("response",response);
    this.captchaResolved = true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async cargarImagenYObtenerURL(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storage.uploadImage(file).subscribe({
        next: (url) => {
          this.especialistaAlta.foto = url;
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar imagen:', err);
          reject(err);
        }
      });
    });
  }

  onEspecialidadChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.mostrarOtraEspecialidad = selectElement.value === 'otra';
  }

  // getSelectedSpecialty(): string {
  //   const especialidad = this.form.get('especialidad')!.value;
  //   if (especialidad === 'otra') {
  //     return this.form.get('otraEspecialidad')!.value;
  //   }
  //   return especialidad;
  // }

  getSelectedSpecialty(): string {
    if (this.mostrarOtraEspecialidad) {
      return this.form.get('otraEspecialidad')!.value;
    } else {
      return this.form.get('especialidad')!.value;
    }
  }


  
  async validarEspecialidad(valor: string) {
    if (!this.especialidades.includes(valor)) {
      await this.firestoreService.agregarEspecialidad(valor);
    } else {
      console.log("especialidad ya registrada en fb.")
    }
  }

  async cargarEspecialista(){
    this.especialistaAlta.nombre = this.form.get('nombre')?.value;
    this.especialistaAlta.apellido = this.form.get('apellido')?.value;
    this.especialistaAlta.edad = this.form.get('edad')?.value;
    this.especialistaAlta.dni = this.form.get('dni')?.value;
    this.especialistaAlta.especialidad = this.getSelectedSpecialty();
    this.especialistaAlta.email = this.form.get('email')?.value;
    this.especialistaAlta.password = this.form.get('password')?.value;
  
    if (this.form.valid && this.selectedFile) {
      try {
        const primera = await this.cargarImagenYObtenerURL(this.selectedFile);
        const segunda = await this.auth.Register(this.especialistaAlta.email, this.especialistaAlta.password);
        const tercera = await this.validarEspecialidad(this.especialistaAlta.especialidad);
        const cuarta = await this.firestoreService.agregarEspecialista(this.especialistaAlta)
  
        this.data.executePopUp('Especialista agregado exitosamente.');
        console.log('Especialista agregado exitosamente.');
        this.form.reset();
      } catch (error) {
        console.error('Error al cargar especialista:', error);
      }
    } else {
      console.error('Formulario inválido o no se ha seleccionado un archivo.');
    }
  }
 
}

