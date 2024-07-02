import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { DataService } from '../../services/data.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Turno } from '../../models/Turno';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [SpinnerComponent, CommonModule, MatTooltipModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements	OnInit{
  loading : boolean = false;
  currentUser: string = '';
  turnos$!: any;
  turnosArray: any[] = [];
  pacientes$: any;
  pacientesArray: any[] = [];
  pacientesDeTurnosArray: any[] = [];
  detallesPacientesArray: any[] = [];
  selectedUser: any;
  filteredTurnos: Turno[] = [];

constructor(private router: Router, private firestoreService: FirestoreService, private data: DataService, private cdr: ChangeDetectorRef){
  this.currentUser = this.data.getItem('username');
}

  ngOnInit(): void {
    this.fetchTurnos();
    this.cdr.detectChanges();
    
  }

  fetchTurnos() {
    this.loading = true;
    this.turnos$ = this.firestoreService.getTurnosFinalizadosEsp(this.currentUser);
    this.turnos$.subscribe({
      next: (turnos: any[]) => {
        this.turnosArray = turnos;
        this.pacientesDeTurnosArray = this.obtenerMailsPaciente(this.turnosArray);
        console.log('pacientesdeturnos', this.pacientesDeTurnosArray);
        this.fetchPacientes();
        console.log(turnos);
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error fetching turnos:', err);
        this.loading = false;
      }
    });
  }

  
  fetchPacientes() {
    this.loading = true;
    this.pacientes$ = this.firestoreService.getFilteredData('usuarios', this.pacientesDeTurnosArray);
    this.pacientes$.subscribe({
      next: (pacientes: any[]) => {
        console.log(pacientes);
        this.detallesPacientesArray = pacientes;
        console.log('hola', this.detallesPacientesArray);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: Error) => {
        console.error('Error fetching pacientes.', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout():void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }

  goHome():void {
    this.router.navigate(['/home']);
  }

  obtenerMailsPaciente(turnos: Turno[]): string[] {
    return turnos.map(turno => turno.paciente);
  }

  goHc():void {
    this.router.navigate(['/historiaclinica']);
  }

  selectUser(user: any): void {
    console.log('Selected user:', user);
    if (user) {
      this.selectedUser = user;
      this.filteredTurnos = this.turnosArray.filter(turno => turno.paciente === user.email);
    } else {
      console.error('Selected user is undefined');
    }
  }

  verResenia(turno: Turno) {
    this.data.executePopUp(turno.resenia);
  }
}

