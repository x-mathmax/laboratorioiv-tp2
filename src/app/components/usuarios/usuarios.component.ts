import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TablaUsuariosComponent } from '../tabla-usuarios/tabla-usuarios.component';
import { CommonModule } from '@angular/common';
import { AltaAdministradorComponent } from '../alta-administrador/alta-administrador.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ExcelService } from '../../services/excel.service';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { AltaPacientesComponent } from '../alta-pacientes/alta-pacientes.component';
import { AltaEspecialistasComponent } from '../alta-especialistas/alta-especialistas.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TablaUsuariosComponent, CommonModule, AltaAdministradorComponent, SpinnerComponent, AltaPacientesComponent, AltaEspecialistasComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements AfterViewInit{

  constructor(private router: Router, private firestoreService: FirestoreService, private cdr: ChangeDetectorRef, private excelService: ExcelService){}
  componenteActivo: string | null = null;
  loading: boolean = false;
  users$!: Observable<any[]>;
  jsonUsers: any;
  currentDate = new Date();
  formattedDate = this.currentDate.toISOString().split('T')[0];// yyyy-mm-dd
  fileName = `listado_usuarios_${this.formattedDate}`;

  ngAfterViewInit() {
    this.fetchData();
    this.cdr.detectChanges();
    
  }

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

  mostrarAltaPaciente() {
    this.componenteActivo = 'paciente';
  }

  mostrarAltaEspecialista() {
    this.componenteActivo = 'especialista';
  }

  goHc():void {
    this.router.navigate(['/historiaclinica']);
  }

  generarExcel(): void {
    this.excelService.exportAsExcelFile(this.jsonUsers, this.fileName);
  }

  fetchData() {
    this.loading = true;
    this.users$ = this.firestoreService.getUsersForTable();
    this.users$.subscribe({
      next: (users) => {
        this.jsonUsers = users.map(user => ({
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          edad: user.edad,
          dni: user.dni,
          tipoUser: user.tipoUser,
          habilitado: user.habilitado
        }));
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
