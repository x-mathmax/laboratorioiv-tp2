import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: string;
  perfilData: any;
  tipoUser!: string;

  constructor(private router: Router, private firestoreService : FirestoreService, private data: DataService){
    this.usuario = this.data.getItem('username');
  }

  ngOnInit(): void {
    const info = this.getUser();
    console.log(info);
  }

  logout():void {
    this.router.navigate(['/welcome']);
  }

  goHome():void {
    this.router.navigate(['/home']);
  }

  goHc():void {
    this.router.navigate(['/historiaclinica']);
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

  goMisHorarios() : void {
    this.router.navigate(['/horarios']);
  }

}
