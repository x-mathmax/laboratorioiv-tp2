import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { Administrador } from '../../models/Administrador';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-alta-administrador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alta-administrador.component.html',
  styleUrl: './alta-administrador.component.css'
})
export class AltaAdministradorComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  selectedFileTwo: File | null = null;
  administradorAlta : Administrador;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private storage: StorageService,
    private auth: AuthService,
    private data: DataService
  ) {
    this.form = this.fb.group({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      apellido: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
      edad: new FormControl("", Validators.min(18)),
      dni: new FormControl("", Validators.maxLength(8)),
      email: new FormControl("", [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      password: new FormControl("", Validators.minLength(4)),
      imagen: new FormControl("", Validators.required),
    });
    this.administradorAlta = new Administrador('', '', 0, 0, '', '', '', '', '');
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log("selected:", this.selectedFile );
    console.log("event:", event.target.files[0])
  }

  async cargarAdministrador(){
    this.administradorAlta.nombre = this.form.get('nombre')?.value;
    this.administradorAlta.apellido = this.form.get('apellido')?.value;
    this.administradorAlta.edad = this.form.get('edad')?.value;
    this.administradorAlta.dni = this.form.get('dni')?.value;
    this.administradorAlta.mail = this.form.get('email')?.value;
    this.administradorAlta.password = this.form.get('password')?.value;

    if (this.form.valid && this.selectedFile) {
        try {
          this.storage.uploadImage(this.selectedFile).subscribe(url => {
            const datos = {
              ...this.form.value,
              foto: url
            };
            this.administradorAlta.foto = url;})

            //agrego el alta en el auth además de en la base de datos.
            await this.auth.Register(this.administradorAlta.mail, this.administradorAlta.password);

            await this.firestoreService.agregarAdministrador(this.administradorAlta);


            console.log('Administrador creado exitosamente.');
            this.data.executePopUp('Administrador creado exitosamente.');
            this.form.reset();
        } catch (error) {
          console.error('Error al cargar especialista:', error);
        }
      } else {
        console.error('Formulario inválido o no se ha seleccionado un archivo.');
    }
  }
}
