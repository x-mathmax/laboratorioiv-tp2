import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/Paciente';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

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
  pacienteAlta : Paciente;

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
      obraSocial: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      password: new FormControl("", Validators.minLength(4)),
      imagenUno: new FormControl("", Validators.required),
      imagenDos: new FormControl("", Validators.required),
    });
    this.pacienteAlta = new Paciente('', '', 0, 0, '', '', '', '', '', '');
  }

  onFileSelected(event: any, inputNumber: number): void {
    const file = event.target.files[0];
    if (inputNumber === 1) {
      this.selectedFile = file;
    } else if (inputNumber === 2) {
      this.selectedFileTwo = file;
    }
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
        this.storage.uploadImage(this.selectedFile).subscribe(url1 => {
          this.storage.uploadImage(this.selectedFileTwo!).subscribe(url2 => {
            const movieData = {
              ...this.form.value,
              imagenUno: url1,
              imagenDos: url2
            };
            this.pacienteAlta.imagenUno = url1;
            this.pacienteAlta.imagenDos = url2;})})

            //agrego el alta en el auth además de en la base de datos.
            await this.auth.Register(this.pacienteAlta.mail, this.pacienteAlta.password);
            
            await this.firestoreService.agregarPaciente(this.pacienteAlta);
            
            this.data.executePopUp('Especialista agregado exitosamente.');

            console.log('Paciente agregado exitosamente.');
            this.form.reset();
          } catch (error) {
            console.error('Error al cargar especialista:', error);
          }
      } else {
        console.error('Formulario inválido o no se han seleccionado ambos archivos.');
      }
    }
  }

