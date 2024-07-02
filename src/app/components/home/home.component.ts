import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  tipoUser?: string;
  usuario: string;

  constructor(private router : Router, private auth : AuthService, private data: DataService,
    private firestoreService: FirestoreService
  ){
    this.tipoUser = '';
    this.usuario = this.data.getItem('username');
  }

  ngOnInit(): void {
    this.firestoreService.getAndSaveTipoUserByEmail(this.usuario)
    .then(data => {
      console.log("Datos de get bla bla",data);
      this.tipoUser = data;
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

  goUsuarios():void {
    this.router.navigate(['/usuarios']);
  } 

  logout():void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }

  goTurnosAdm():void {
    this.router.navigate(['/turnos/administrador']);
  } 

  goPerfil():void {
    this.router.navigate(['/perfil']);
  }
  
  goTurnosEsp():void {
    this.router.navigate(['/turnos/especialista']);
  } 

  goTurnosPac():void {
    this.router.navigate(['/turnos/paciente']);
  } 

  sacarTurno():void {
    this.router.navigate(['/turnos/nuevo']);
  } 

  goHc():void {
    this.router.navigate(['/pacientes']);
  }

  goInformes():void {
    this.router.navigate(['/informes']);
  }
}
