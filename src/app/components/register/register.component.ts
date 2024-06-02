import { Component } from '@angular/core';
import { AltaEspecialistasComponent } from '../alta-especialistas/alta-especialistas.component';
import { AltaPacientesComponent } from '../alta-pacientes/alta-pacientes.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AltaEspecialistasComponent, AltaPacientesComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private router : Router){}
  componenteActivo: string | null = null;

  mostrarAltaPaciente() {
    this.componenteActivo = 'paciente';
  }

  mostrarAltaEspecialista() {
    this.componenteActivo = 'especialista';
  }

  goinit():void {
    this.router.navigate(['/welcome']);
  }
}
