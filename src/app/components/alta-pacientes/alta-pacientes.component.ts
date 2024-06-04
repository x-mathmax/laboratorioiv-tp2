import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/Paciente';

@Component({
  selector: 'app-alta-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alta-pacientes.component.html',
  styleUrl: './alta-pacientes.component.css'
})
export class AltaPacientesComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  selectedFileTwo: File | null = null;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private storage: StorageService,
    private pacienteAlta : Paciente
  ) {
    this.form = this.fb.group({
      nombre: [''],
      apellido: [''],
      edad: [''],
      dni: [''],
      obraSocial: [''],
      email: [' '],
      password: [' '],
      imagenUno: [' '],
      imagenDos: [' '],
    });
  }

  onFileSelected(event: any, inputNumber: number): void {
    const file = event.target.files[0];
    if (inputNumber === 1) {
      this.selectedFile = file;
    } else if (inputNumber === 2) {
      this.selectedFileTwo = file;
    }
  }

  cargarPaciente() : void {
      this.pacienteAlta.nombre = this.form.get('nombre')?.value;
      this.pacienteAlta.apellido = this.form.get('apellido')?.value;
      this.pacienteAlta.edad = this.form.get('edad')?.value;
      this.pacienteAlta.dni = this.form.get('dni')?.value;
      this.pacienteAlta.obraSocial = this.form.get('obraSocial')?.value;
      this.pacienteAlta.mail = this.form.get('email')?.value;
      this.pacienteAlta.password = this.form.get('password')?.value;
    
      if (this.form.valid && this.selectedFile && this.selectedFileTwo) {
        this.storage.uploadImage(this.selectedFile).subscribe(url1 => {
          this.storage.uploadImage(this.selectedFileTwo!).subscribe(url2 => {
            const movieData = {
              ...this.form.value,
              imagenUno: url1,
              imagenDos: url2
            };
            this.pacienteAlta.imagenUno = url1;
            this.pacienteAlta.imagenDos = url2;
            this.firestoreService.agregarPaciente(this.pacienteAlta);
            console.log('Paciente agregado exitosamente.');
            this.form.reset();
          });
        });
      } else {
        console.error('Formulario inválido o no se han seleccionado ambos archivos.');
      }
    }
  }

