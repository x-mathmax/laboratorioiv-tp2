import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { Especialista } from '../../models/Especialista';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-alta-especialistas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alta-especialistas.component.html',
  styleUrl: './alta-especialistas.component.css'
})
export class AltaEspecialistasComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  selectedFileTwo: File | null = null;
  especialistaAlta : Especialista;

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
      especialidad: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      password: new FormControl("", Validators.minLength(4)),
      imagen: new FormControl("", Validators.required),
    });
    this.especialistaAlta = new Especialista('', '', 0, 0, '', '', '', '', '',false);
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log("selected:", this.selectedFile );
    console.log("event:", event.target.files[0])
  }


  async cargarEspecialista(){
    this.especialistaAlta.nombre = this.form.get('nombre')?.value;
    this.especialistaAlta.apellido = this.form.get('apellido')?.value;
    this.especialistaAlta.edad = this.form.get('edad')?.value;
    this.especialistaAlta.dni = this.form.get('dni')?.value;
    this.especialistaAlta.especialidad = this.form.get('especialidad')?.value;
    this.especialistaAlta.mail = this.form.get('email')?.value;
    this.especialistaAlta.password = this.form.get('password')?.value;
  
    if (this.form.valid && this.selectedFile) {
      try {
        this.storage.uploadImage(this.selectedFile).subscribe(url => {
          const data = {
            ...this.form.value,
          foto: url
          };
        this.especialistaAlta.foto = url;})
  
        await this.auth.Register(this.especialistaAlta.mail, this.especialistaAlta.password);
  
        await this.firestoreService.agregarEspecialista(this.especialistaAlta);
  
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

