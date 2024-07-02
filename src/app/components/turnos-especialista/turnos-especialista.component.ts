import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Turno } from '../../models/Turno';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Observable } from 'rxjs';
import { AltaHcComponent } from '../alta-hc/alta-hc.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent implements OnInit{
  turnos$!: Observable<any[]>;
  hcs$!: Observable<any[]>;
  turnosArray: any[] = [];
  filteredTurnos: any[] = [];
  especialidadFilter: string = '';
  pacienteFilter: string = '';
  turno : Turno;
  hora : any;
  userIn: string;
  loading: boolean = false;
  historiasClinicas: any[] = [];
  combinedData: any[] = [];
  searchCriteria: string = '';

  constructor(private firestoreService: FirestoreService, private router: Router, private data: DataService, private cdr: ChangeDetectorRef, private dialog: MatDialog) {
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
    this.turnos$ = this.firestoreService.getTurnosPorEspecialista(this.userIn);
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
        console.error('Error fetching turnos:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchHc() {
    this.loading = true;
    this.hcs$ = this.firestoreService.getHcFiltrado(this.userIn, 'emailEspecialista');
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


  onEspecialidadFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.especialidadFilter = inputElement.value;
    this.applyFilters();
  }


  onPacienteFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.pacienteFilter = inputElement.value;
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

  async rechazarTurno(turno : Turno): Promise<void>{
    console.log(turno);
    try {
      const comentario = await this.data.executePopupWithInputCancel();
      if (comentario !== null) {
        try {
          await this.firestoreService.toggleTurno(turno, 'comentario', comentario);
          const updatedState = 'rechazado';
          await this.firestoreService.toggleTurno(turno, 'estado', updatedState);
          this.data.executePopUp('Turno rechazado correctamente');
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

  async aceptarTurno(turno : Turno): Promise<void>{
    console.log(turno);
    try {
        const updatedState = 'aceptado';
        await this.firestoreService.toggleTurno(turno, 'estado', updatedState);
        this.data.executePopUp('Turno aceptado correctamente');
        this.fetchData();
        this.cdr.detectChanges();
      } catch(error) {
      this.data.executePopUp('Error al actualizar el turno.');
    }
  }

  async finalizarTurno(turno: Turno): Promise<void> {
    console.log(turno);
    try {
      const result = await this.data.showDiagnosisPopup();
      if (result !== null) {
        try {
          await this.firestoreService.toggleTurnoFinalizar(turno, 'finalizado', result.diagnostico, result.resenia);
          this.data.executePopUp('Turno finalizado correctamente');
          this.openHistoriaClinicaDialog(turno);
          this.fetchData();
          this.cdr.detectChanges();
          console.log('Diagnóstico y reseña guardados:', result);
        } catch (error) {
          this.data.executePopUp('Error al finalizar el turno');
          console.error('Error al finalizar el turno:', error);
        }
      } else {
        this.data.executePopUp('La reseña no puede estar vacía.');
      }
    } catch (error) {
      this.data.executePopUp('Error al mostrar el popup de diagnóstico.');
      console.error('Error al mostrar el popup de diagnóstico:', error);
    }
  }

  verComentario(turno : Turno) : void {
    this.data.executePopUp(turno.comentario);
  }

  verResenia(turno : Turno) : void {
    this.data.executePopUp(turno.resenia);
  }

  volver() :void{
    this.router.navigate(['/home']);
  }

  openHistoriaClinicaDialog(turno: Turno): void {
    const dialogRef = this.dialog.open(AltaHcComponent, {
      width: '80%',
      data: turno // Envio los datos del turno
    });
    console.log('turno en open historia clinica diaalog', turno);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo de Historia Clínica cerrado');
      this.data.executePopUp('Historia clinica agregada exitosamente.');
    });
  }
}
