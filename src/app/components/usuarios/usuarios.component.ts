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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TablaUsuariosComponent, CommonModule, AltaAdministradorComponent, SpinnerComponent, AltaPacientesComponent, AltaEspecialistasComponent, MatTooltipModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements AfterViewInit{

  constructor(private router: Router, private firestoreService: FirestoreService, private cdr: ChangeDetectorRef, private excelService: ExcelService, private data: DataService){}
  componenteActivo: string | null = null;
  loading: boolean = false;
  users$!: Observable<any[]>;
  jsonUsers: any;
  pacientesArray : any[] = [];
  currentDate = new Date();
  formattedDate = this.currentDate.toISOString().split('T')[0];// yyyy-mm-dd
  fileName = `listado_usuarios_${this.formattedDate}`;
  turnosFileName = `listado_turnos_usuario_${this.formattedDate}`;
  turnos$!: any;
  turnosArray: any[] = [];
  turnosPaciente: any[] = [];
  selectedUser: any;

  ngAfterViewInit() {
    this.fetchData();
    this.fetchTurnos();
    this.cdr.detectChanges();
    
  }

  logout():void {
    localStorage.clear();
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
        this.pacientesArray = users.filter((user: any) => user.tipoUser === 'paciente');
        console.log('pacarray', this.pacientesArray);
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

  fetchTurnos() {
    this.loading = true;
    this.turnos$ = this.firestoreService.getCollectionData('turnos');
    this.turnos$.subscribe({
      next: (turnos: any[]) => {
        this.turnosArray = turnos;
        console.log('turnos array',turnos);
        this.loading = false; 
        this.cdr.detectChanges();
      },
      error: (err: Error) => {
        console.error('Error fetching users:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  selectUser(user: any){
    console.log('Selected user:', user);
    if (user) {
      this.selectedUser = user;
      this.turnosPaciente = this.turnosArray.filter(turno => turno.paciente === user.email);
      console.log('turnospacioente', this.turnosPaciente);
      if (this.turnosPaciente){
        this.excelService.exportAsExcelFile(this.turnosPaciente, this.turnosFileName);
      } else {
        this.data.executePopUp('El paciente seleccionado no tiene turnos.');
      }     
    } else {
      console.error('Selected user is undefined');
    }
  }

}
