import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Turno } from '../../models/Turno';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, FormsModule],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit {
  turnos$!: Observable<any[]>;
  hcs$!: Observable<any[]>;
  turnosArray: any[] = [];
  filteredTurnos: any[] = [];
  especialidadFilter: string = '';
  especialistaFilter: string = '';
  turno : Turno;
  hora : any;
  userIn: string;
  loading: boolean = false;
  historiasClinicas: any[] = [];
  combinedData: any[] = [];
  searchCriteria: string = '';

  constructor(private firestoreService: FirestoreService, private router: Router, private data: DataService, private cdr: ChangeDetectorRef) {
    this.hora = new Date(2024, 0, 1, 0, 0, 0, 0);
    this.turno = new Turno('', '', '', '','', '', '', '', '', '', this.hora, '', '');
    this.userIn = this.data.getItem('username');
   }

  ngOnInit(): void {
    this.fetchData();
    this.fetchHc();
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
        this.combineDataIfReady();
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

  fetchHc() {
    this.loading = true;
    this.hcs$ = this.firestoreService.getHcFiltrado(this.userIn, 'emailPaciente');
    this.hcs$.subscribe({
      next: (hcs) => {
        console.log('adentro del next', hcs);
        this.historiasClinicas = hcs;
        this.combineDataIfReady();
        this.applyFilters();
        console.log('hcs',this.historiasClinicas)
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

  combineDataIfReady(): void {
    if (this.turnosArray.length && this.historiasClinicas.length) {
      this.combinedData = this.turnosArray.map(turno => {
        const hc = this.historiasClinicas.find(hc => hc.fechaTurno === turno.fecha && hc.emailEspecialista === turno.especialista);
        return { ...turno, historiaClinica: hc || null };
      });
      console.log('combined', this.combinedData);
    }
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

  verHistoriaClinica(hc: any) : void {
    const histClin = this.quitarId(hc);
    const mensaje = this.convertObjectToText(histClin);
    console.log(mensaje);
    this.data.executePopUp(mensaje);
  }

  convertObjectToText(obj: any): string {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }

  quitarId(obj: any): any {
    if (obj && typeof obj === 'object') {
      const { id, ...objSinId } = obj;
      return objSinId;
    }
    return obj;
  }


  applyFilters(): void {
    this.filteredTurnos = this.combinedData.filter(turno => {
      return this.containsValue(turno, this.searchCriteria) ||
             (turno.historiaClinica && this.containsValue(turno.historiaClinica, this.searchCriteria));
    });
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchCriteria = inputElement.value;
    this.applyFilters();
  }

  containsValue(obj: any, searchValue: string): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          if (this.containsValue(value, searchValue)) {
            return true;
          }
        } else if (value !== null && value !== undefined && value.toString().toLowerCase().includes(searchValue.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }
}
