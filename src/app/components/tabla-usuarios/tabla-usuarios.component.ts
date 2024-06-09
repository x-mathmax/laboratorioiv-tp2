import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsuarioDto } from '../../models/UsuarioDto';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css'
})
export class TablaUsuariosComponent{
  users$: Observable<any[]>;

  constructor(private firestoreService: FirestoreService) {
    this.users$ = this.firestoreService.getUsersForTable();
  }

  async onToggleHabilitado(user: UsuarioDto): Promise<void> {
    try {
      const updatedValue = !user.habilitado;
      console.log("usuario en ontogglehabilitado:", user.mail);
      await this.firestoreService.toggleUserHabilitado(user.mail, updatedValue);
      user.habilitado = updatedValue;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }

  // ngOnInit(): void {
  //   this.users$ = this.firestoreService.getUsersForTable();
  // }
}
