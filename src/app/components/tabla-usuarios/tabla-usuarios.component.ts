import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsuarioDto } from '../../models/UsuarioDto';
import { SpinnerComponent } from '../spinner/spinner.component';


@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.css']
})
export class TablaUsuariosComponent implements AfterViewInit{
  users$!: Observable<any[]>;
  loading: boolean = false;

  constructor(private firestoreService: FirestoreService, private cdr: ChangeDetectorRef) {
    
  }

  ngAfterViewInit() {
    this.fetchData();
    this.cdr.detectChanges();
    
  }

  async onToggleHabilitado(user: UsuarioDto): Promise<void> {
    console.log(user);
    try {
      const updatedValue = !user.habilitado;
      console.log("usuario en ontogglehabilitado:", user.email);
      await this.firestoreService.toggleUserHabilitado(user.email, updatedValue);
      user.habilitado = updatedValue;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }

  //validar que funcione ok el spinner porque no lo muestra porque carga rapido
  // fetchData() {
  //   this.loader.mostrar();
  //   this.users$ = this.firestoreService.getUsersForTable();
  //   if (this.users$ != null) {
  //     this.loader.ocultar();
  //     console.log(this.users$);
  //   }
  // }

  fetchData() {
    this.loading = true;
    this.users$ = this.firestoreService.getUsersForTable();
    this.users$.subscribe({
      next: (users) => {
        console.log(users);
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
}

