import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Turno } from '../../models/Turno';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit {
  turnos: any[] = [];
  filteredTurnos: any[] = [];
  especialidadFilter: string = '';
  especialistaFilter: string = '';
  turno : Turno;
  hora : any;
  userIn: string;

  constructor(private firestoreService: FirestoreService, private router: Router, private data: DataService) {
    this.hora = new Date(2024, 0, 1, 0, 0, 0, 0);
    this.turno = new Turno('', '', '', '', '', '', '', '', this.hora, '', '');
    this.userIn = this.data.getItem('username');
   }

  ngOnInit(): void {
    this.firestoreService.getTurnosPorPaciente(this.userIn).subscribe(data => {
      this.turnos = data;
      console.log(this.turnos);
      this.applyFilters();
    });
    // this.firestoreService.getCollectionData('turnos').subscribe(data => {
    //   this.turnos = data;
    //   this.applyFilters();
    // });
  }

  applyFilters(): void {
    this.filteredTurnos = this.turnos.filter(turno => {
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

  cancelarTurno(turno : Turno): void {
  }

  completarEncuesta(turno : Turno): void {
  }

  verComentario(turno : Turno) : void {
  }

  volver() :void{
    this.router.navigate(['/home']);
  }
}
