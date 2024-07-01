import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent implements OnInit {
  historiasClinicas$!: Observable<any[]>;
  tipoUser!: any;
  perfilData: any;
  historiasClinicasPaciente$!:Observable<any[]>;
  historiasClinicasEspecialista$!:Observable<any[]>;
  usuario!: any;

  constructor(private router: Router, private firestoreService: FirestoreService, private data: DataService){
    this.usuario = this.data.getItem('username');
  }

  ngOnInit(): void {
    this.getUser();
    this.historiasClinicas$ = this.firestoreService.getCollectionData('historiasclinicas');
    this.historiasClinicasPaciente$ = this.firestoreService.getHcFiltrado(this.usuario, 'emailPaciente');
    this.historiasClinicasEspecialista$ = this.firestoreService.getHcFiltrado(this.usuario, 'emailEspecialista');
  }

  getUser() : void {
    this.firestoreService.getAndSaveInfoUserByEmail(this.usuario)
    .then(data => {
      console.log("Datos de perfil:",data);
      this.perfilData = data;
      this.tipoUser = data.tipoUser;
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

  getDynamicKeys(hc: any): string[] {
    const keys = Object.keys(hc);
    const staticKeys = ['id', 'nombrePaciente', 'emailPaciente', 'nombreEspecialista', 'emailEspecialista', 'fechaTurno', 'especialidad', 'diagnostico', 'altura', 'peso', 'temperatura', 'presion'];
    return keys.filter(key => !staticKeys.includes(key));
  }

  logout():void {
    this.router.navigate(['/welcome']);
  }

  goHome():void {
    this.router.navigate(['/home']);
  }
}
