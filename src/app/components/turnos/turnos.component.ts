import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FirestoreService } from '../../services/firestore.service';
import { Turno } from '../../models/Turno';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit{
  turnos$!: Observable<any[]>;
  turnosArray: any[] = [];
  filteredTurnos: any[] = [];
  especialidadFilter: string = '';
  especialistaFilter: string = '';
  turno : Turno;
  hora : any;
  userIn: string;
  loading: boolean = false;

  constructor(private firestoreService: FirestoreService, private router: Router, private data: DataService, private cdr: ChangeDetectorRef){
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
    this.turnos$ = this.firestoreService.getCollectionData('turnos');
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

  logout():void {
    this.router.navigate(['/welcome']);
  }

  goHome():void {
    this.router.navigate(['/home']);
  }

}
