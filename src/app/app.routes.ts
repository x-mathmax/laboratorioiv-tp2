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
    loadComponent: () => import('./components/usuarios/usuarios.component').then(c => c.UsuariosComponent) }
];
