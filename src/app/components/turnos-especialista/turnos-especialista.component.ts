import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Turno } from '../../models/Turno';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent implements OnInit{
  turnos$!: Observable<any[]>;
  turnosArray: any[] = [];
  filteredTurnos: any[] = [];
  especialidadFilter: string = '';
  pacienteFilter: string = '';
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

  applyFilters(): void {
    this.filteredTurnos = this.turnosArray.filter(turno => {
      return (!this.especialidadFilter || turno.especialidad.includes(this.especialidadFilter)) &&
             (!this.pacienteFilter || turno.especialista.includes(this.pacienteFilter));
    });
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

  // async finalizarTurno(turno : Turno): Promise<void>{
  //   console.log(turno);
  //   try {
  //     await this.data.showDiagnosisPopup().then(async (result) => {
  //       if (result !== null) {
  //         try {
  //           await this.firestoreService.toggleTurnoFinalizar(turno, 'finalizado', result.diagnostico, result.resenia)
  //           this.data.executePopUp('Turno finalizado correctamente');
  //           this.fetchData();
  //           this.cdr.detectChanges();
  //           console.log('Diagnóstico y reseña guardados:', result);}
  //           catch (error){
  //             this.data.executePopUp('Error al finalizar el turno');
  //           }}})}
  // catch(error) {
  //     this.data.executePopUp('La reseña no puede estar vacío.');
  //   }
  // }

  async finalizarTurno(turno: Turno): Promise<void> {
    console.log(turno);
    try {
      const result = await this.data.showDiagnosisPopup();
      if (result !== null) {
        try {
          await this.firestoreService.toggleTurnoFinalizar(turno, 'finalizado', result.diagnostico, result.resenia);
          this.data.executePopUp('Turno finalizado correctamente');
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
}
