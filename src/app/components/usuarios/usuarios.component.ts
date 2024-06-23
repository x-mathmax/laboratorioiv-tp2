import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TablaUsuariosComponent } from '../tabla-usuarios/tabla-usuarios.component';
import { CommonModule } from '@angular/common';
import { AltaAdministradorComponent } from '../alta-administrador/alta-administrador.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TablaUsuariosComponent, CommonModule, AltaAdministradorComponent, SpinnerComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  constructor(private router: Router){}
  componenteActivo: string | null = null;

  logout():void {
    this.router.navigate(['/welcome']);
  }

  goHome():void {
    this.router.navigate(['/home']);
  }

  
  mostrarUsuarios() {
    this.componenteActivo = 'usuarios';
  }

  mostrarAltaAdministrador() {
    this.componenteActivo = 'administrador';
  }
}
