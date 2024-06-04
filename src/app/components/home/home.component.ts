import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

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

  constructor(private router : Router, private auth : AuthService, private data: DataService){
    this.tipoUser = '';
    this.usuario = this.data.getItem('username');
  }

  ngOnInit(): void {
    this.tipoUser = this.auth.getTipoUser();
  }

  goUsuarios():void {
    this.router.navigate(['/usuarios']);
  } 

  logout():void {
    this.router.navigate(['/welcome']);
  }
}
