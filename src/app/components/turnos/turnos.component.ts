import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TurnosPacienteComponent } from '../turnos-paciente/turnos-paciente.component';
import { TurnosEspecialistaComponent } from '../turnos-especialista/turnos-especialista.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [TurnosPacienteComponent, TurnosEspecialistaComponent, CommonModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {
  constructor(private router: Router){}
  componenteActivo: string | null = null;

  logout():void {
    this.router.navigate(['/welcome']);
  }

  goHome():void {
    this.router.navigate(['/home']);
  }

  
  turnosPacientes() {
    this.componenteActivo = 'pacientes';
  }

  turnosEspecialistas() {
    this.componenteActivo = 'especialistas';
  }
}
