import { CommonModule } from '@angular/common';
import { Component, OnInit,Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { HistoriaClinica } from '../../models/HistoriaClinica';
import { Turno } from '../../models/Turno';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-alta-hc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './alta-hc.component.html',
  styleUrl: './alta-hc.component.css'
})
export class AltaHcComponent implements OnInit{
  form!: FormGroup;
  historiaClinica: HistoriaClinica = new HistoriaClinica('', '', '', '', '', '', '', '', '', '', '');
  turno!: Turno;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private firestoreService : FirestoreService,
  private dialogRef: MatDialogRef<AltaHcComponent>){
    this.turno = data as Turno;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      altura: new FormControl(""),
      peso: new FormControl(""),
      temperatura: new FormControl(""),
      presion: new FormControl(""),
      propiedadUno: new FormControl(""),
      valorUno: new FormControl(""),
      propiedadDos: new FormControl(""),
      valorDos: new FormControl(""),
      propiedadTres: new FormControl(""),
      valorTres: new FormControl("")
    });
  }

  get altura() {
    return this.form.get('altura');
  }
  get peso() {
    return this.form.get('peso');
  }
  get temperatura() {
    return this.form.get('temperatura');
  }
  get presion() {
    return this.form.get('presion');
  }
  get propiedadUno() {
    return this.form.get('propiedadUno');
  }
  get valorUno() {
    return this.form.get('valorUno');
  }
  get propiedadDos() {
    return this.form.get('propiedadDos');
  }
  get valorDos() {
    return this.form.get('valorDos');
  }
  get propiedadTres() {
    return this.form.get('propiedadDos');
  }
  get valorTres() {
    return this.form.get('valorDos');
  }

  async cargarHc(){
    if (this.turno) {
      this.historiaClinica.nombrePaciente = this.turno.nombrePaciente;
      this.historiaClinica.emailPaciente = this.turno.paciente;
      this.historiaClinica.nombreEspecialista = this.turno.nombreEspecialista;
      this.historiaClinica.emailEspecialista = this.turno.especialista;
      this.historiaClinica.fechaTurno = this.turno.fecha;
      this.historiaClinica.especialidad = this.turno.especialidad;
      this.historiaClinica.diagnostico = this.turno.diagnostico;
      this.historiaClinica.altura = this.form.get('altura')?.value;
      this.historiaClinica.peso = this.form.get('peso')?.value;
      this.historiaClinica.temperatura = this.form.get('temperatura')?.value;
      this.historiaClinica.presion = this.form.get('presion')?.value;
      //campos dinamicos
      const propiedadUno = this.form.get('propiedadUno')?.value;
      const valorUno = this.form.get('valorUno')?.value;
      const propiedadDos = this.form.get('propiedadDos')?.value;
      const valorDos = this.form.get('valorDos')?.value;
      const propiedadTres = this.form.get('propiedadTres')?.value;
      const valorTres = this.form.get('valorTres')?.value;
  
      if(this.form.valid) {
        try {
          console.log('valores a mandar', this.historiaClinica, 'valoruno',valorUno, 'valordos', valorDos, 'valortres',valorTres,
            'prop1',propiedadUno, 'prop2',propiedadDos, 'prop3',propiedadTres)
          this.firestoreService.agregarHC(this.historiaClinica, valorUno, valorDos, valorTres,propiedadUno, propiedadDos, propiedadTres);
          this.dialogRef.close(); // Cierro el dialog del comp.
        } catch(error) {
          console.error('Error al cargar la hc:', error);
        }
      } else {
        console.error('Formulario inválido');
      }
  
    } else {
      console.log('turno vacio');
    }
    
  
  }
}
