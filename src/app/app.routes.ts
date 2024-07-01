import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: "full" },
    { path: 'welcome',
    loadComponent: () => import('./components/welcome/welcome.component').then(c => c.WelcomeComponent) },
    { path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
    { path: 'registro',
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent) },
    { path: 'home',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent) },
    { path: 'usuarios',
    loadComponent: () => import('./components/usuarios/usuarios.component').then(c => c.UsuariosComponent) },
    { path: 'turnos/administrador',
        loadComponent: () => import('./components/turnos/turnos.component').then(c => c.TurnosComponent) },
    { path: 'turnos/especialista',
        loadComponent: () => import('./components/turnos-especialista/turnos-especialista.component').then(c => c.TurnosEspecialistaComponent) },
    { path: 'turnos/paciente',
        loadComponent: () => import('./components/turnos-paciente/turnos-paciente.component').then(c => c.TurnosPacienteComponent) },
    { path: 'turnos/nuevo',
        loadComponent: () => import('./components/alta-turnos/alta-turnos.component').then(c => c.AltaTurnosComponent) },
    { path: 'perfil',
        loadComponent: () => import('./components/perfil/perfil.component').then(c => c.PerfilComponent) },
    { path: 'horarios',
        loadComponent: () => import('./components/horarios-especialista/horarios-especialista.component').then(c => c.HorariosEspecialistaComponent) },
    { path: 'historiaclinica',
        loadComponent: () => import('./components/historia-clinica/historia-clinica.component').then(c => c.HistoriaClinicaComponent) }
];
