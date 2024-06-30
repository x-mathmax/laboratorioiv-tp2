import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, firstValueFrom } from 'rxjs';
import { Especialidad } from '../../models/Especialidad';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-horarios-especialista',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './horarios-especialista.component.html',
  styleUrl: './horarios-especialista.component.css'
})
export class HorariosEspecialistaComponent implements OnInit{
  loading: boolean = false;
  usuario: any;
  perfilData : any;
  tipoUser: any;
  especialidadesActivas: any;
  diasTrabaja: any;
  horaEntrada: any;
  horaSalida: any;
  dias : string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  horarios: string[] = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00',
    '13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];
  especialidades$!: Observable<any[]>;
  especialidades: Especialidad[] = [];
  selectedEspecialidades: Especialidad[] = [];
  selectedHorarios: string[] = [];
  selectedDias: string[] = [];
  

  constructor(private router: Router, private firestoreService : FirestoreService, private data: DataService, private cdr: ChangeDetectorRef,){
    this.usuario = this.usuario = this.data.getItem('username');
  }

  ngOnInit(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.getUser()
      .then(() => this.fetchEspecialidades())
      .then(() => 
        this.cdr.detectChanges())
      .then(() => {
        this.setInitialSelections();
        this.loading = false;
        this.cdr.detectChanges()
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  setInitialSelections(): void {
    if (this.especialidadesActivas) {
      const especialidadesArr = this.especialidadesActivas.split(',').map((e: string) => e.trim());
      this.selectedEspecialidades = this.especialidades.filter(e => especialidadesArr.includes(e.nombre));
    }

    if (this.diasTrabaja) {
      this.selectedDias = this.diasTrabaja.split(',').map((d: string) => d.trim());
    }

    if (this.horaEntrada && this.horaSalida) {
      this.selectedHorarios = [this.horaEntrada, this.horaSalida];
    }
  }

  fetchEspecialidades(): Promise<any> {
    return firstValueFrom(this.firestoreService.getCollectionData('especialidades'))
      .then(data => {
        this.especialidades = data;
        return data;
      })
      .catch(error => {
        console.error('Error fetching especialidades:', error);
        throw error;
      });
  }

   getUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestoreService.getAndSaveInfoUserByEmail(this.usuario)
        .then(data => {
          this.perfilData = data;
          this.tipoUser = data.tipoUser;
          this.especialidadesActivas = data.especialidad;
          this.diasTrabaja = data.diasTrabaja;
          this.horaEntrada = data.horaEntrada;
          this.horaSalida = data.horaSalida;
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  toggleEspecialidad(especialidad: Especialidad) {
    const index = this.selectedEspecialidades.findIndex(e => e.nombre === especialidad.nombre);
    if (index > -1) {
      this.selectedEspecialidades.splice(index, 1);
    } else {
      this.selectedEspecialidades.push(especialidad);
    }
  }

  toggleHorario(horario: string) {
    const index = this.selectedHorarios.indexOf(horario);
    if (index > -1) {
      this.selectedHorarios.splice(index, 1);
    } else {
      if (this.selectedHorarios.length < 2) {
        this.selectedHorarios.push(horario);
      }
    }
  }

  toggleDia(dia: string) {
    const index = this.selectedDias.indexOf(dia);
    if (index > -1) {
      this.selectedDias.splice(index, 1);
    } else {
      this.selectedDias.push(dia);
    }
  }

  getSelectedEspecialidades(): string {
    return this.selectedEspecialidades.map(e => e.nombre).join(', ');
  }

  getIngresoYFin(): { ingreso: string, fin: string } {
    if (this.selectedHorarios.length === 2) {
      return {
        ingreso: this.selectedHorarios[0] < this.selectedHorarios[1] ? this.selectedHorarios[0] : this.selectedHorarios[1],
        fin: this.selectedHorarios[0] > this.selectedHorarios[1] ? this.selectedHorarios[0] : this.selectedHorarios[1]
      };
    }
    return { ingreso: '', fin: '' };
  }

  getSelectedDias(): string {
    return this.selectedDias.join(', ');
  }


  gohome() : void {
    this.router.navigate(['/home']);
  }

  goBack() : void {
    this.router.navigate(['/perfil']);
  }

  async updateProfile() : Promise<void> {
    this.horaEntrada = this.getIngresoYFin().ingreso;
    this.horaSalida = this.getIngresoYFin().fin;
    const especialidadesSeleccionadas = this.getSelectedEspecialidades();
    this.diasTrabaja = this.getSelectedDias();
    return new Promise<void>((resolve, reject) => {
      this.firestoreService.toggleEspecialista(this.usuario, this.horaEntrada, this.horaSalida, especialidadesSeleccionadas, this.diasTrabaja)
        .then(() => {
          console.log('hora entrada + hora salida + especialidades + dias', this.horaEntrada, this.horaSalida, especialidadesSeleccionadas, this.diasTrabaja)
          console.log('Datos agregados exitosamente.');
          this.data.executePopUp('Datos agregados exitosamente.');
          resolve();
        })
        .catch((err) => {
          console.error('Error al agregar datos:', err);
          reject(err);
        });
    });
  }
}
