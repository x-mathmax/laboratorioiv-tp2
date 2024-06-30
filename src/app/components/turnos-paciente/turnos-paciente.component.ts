import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Turno } from '../../models/Turno';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit {
  turnos$!: Observable<any[]>;
  turnosArray: any[] = [];
  filteredTurnos: any[] = [];
  especialidadFilter: string = '';
  especialistaFilter: string = '';
  turno : Turno;
  hora : any;
  userIn: string;
  loading: boolean = false;

  constructor(private firestoreService: FirestoreService, private router: Router, private data: DataService, private cdr: ChangeDetectorRef) {
    this.hora = new Date(2024, 0, 1, 0, 0, 0, 0);
    this.turno = new Turno('', '', '', '','', '', '', '', '', '', this.hora, '', '');
    this.userIn = this.data.getItem('username');
   }

  ngOnInit(): void {
    this.fetchData();
    this.cdr.detectChanges();
  }

  fetchData() {
    this.loading = true;
    this.turnos$ = this.firestoreService.getTurnosPorPaciente(this.userIn);
    this.turnos$.subscribe({
      next: (turnos) => {
        console.log('adentro del next', turnos);
        this.turnosArray = turnos;
        this.applyFilters();
        console.log('turnos array',this.turnosArray)
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredTurnos = this.turnosArray.filter(turno => {
      return (!this.especialidadFilter || turno.especialidad.includes(this.especialidadFilter)) &&
             (!this.especialistaFilter || turno.especialista.includes(this.especialistaFilter));
    });
  }

  onEspecialidadFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.especialidadFilter = inputElement.value;
    this.applyFilters();
  }


  onEspecialistaFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.especialistaFilter = inputElement.value;
    this.applyFilters();
  }

  async cancelarTurno(turno : Turno): Promise<void>{
    console.log(turno);
    try {
      const comentario = await this.data.executePopupWithInputCancel();
      if (comentario !== null) {
        try {
          await this.firestoreService.toggleTurno(turno, 'comentario', comentario);
          const updatedState = 'cancelado';
          await this.firestoreService.toggleTurno(turno, 'estado', updatedState);
          this.data.executePopUp('Turno cancelado correctamente');
          this.fetchData();
          this.cdr.detectChanges();
        } catch (error) {
          this.data.executePopUp('Error al actualizar el turno');
        }
      }
    } catch(error) {
      this.data.executePopUp('El comentario no puede estar vacío.');
    }
  }

  async agregarComentario(turno: Turno, comentario: string): Promise<void>{
    return new Promise<void>((resolve, reject) => {
      this.firestoreService.toggleTurno(turno, 'comentario', comentario)
        .then(() => {
          console.log('Comentario agregado exitosamente.');
          resolve();
        })
        .catch((err) => {
          console.error('Error al agregar comentario:', err);
          reject(err);
        });
    });
  }

  completarEncuesta(turno : Turno): void {
    this.data.showRatingPopup().then((rating) => {
      if (rating !== null) {
        this.firestoreService.toggleTurno(turno, 'encuesta', rating.toString()).then(() => {
          console.log('Calificación guardada:', rating);
        }).catch((error) => {
          console.error('Error al guardar la calificación:', error);
        });
      }
    });
  }

  verComentario(turno : Turno) : void {
    this.data.executePopUp(turno.comentario);
  }

  verResenia(turno : Turno) : void {
    this.data.executePopUp(turno.resenia);
  }

  async calificarAtencion(turno: Turno) : Promise<void>{
    console.log(turno);
    try {
      const calificacionAtencion = await this.data.executePopupWithCalificacion();
      if (calificacionAtencion !== null) {
        try {
          await this.firestoreService.toggleTurno(turno, 'calificacionAtencion', calificacionAtencion);
          this.data.executePopUp('¡Muchas gracias por calificar la atención!');
          this.fetchData();
          this.cdr.detectChanges();
        } catch (error) {
          this.data.executePopUp('Error al guardar la calificación');
        }
      }
    } catch(error) {
      this.data.executePopUp('La calificación no puede estar vacía.');
    }
  }

  volver() :void{
    this.router.navigate(['/home']);
  }
}
