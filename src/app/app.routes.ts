import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: "full" },
    { path: 'welcome',
    loadComponent: () => import('./components/welcome/welcome.component').then(c => c.WelcomeComponent) },
    { path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
    { path: 'registro',
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent) },
];

// export const routes: Routes = [
//     { path: '', redirectTo: '/login', pathMatch: "full" },
//     { path: 'login',
//     loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
//     { path: 'home',
//     loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent) },
//     { path: 'about',
//     loadComponent: () => import('./components/about-me/about-me.component').then(c => c.AboutMeComponent) },
//     { path: 'register',
//     loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent) },
//     { path: 'chatroom',
//     loadComponent: () => import('./components/chatroom/chatroom.component').then(c => c.ChatroomComponent) },
//     { path: 'hangman',
//     loadComponent: () => import('./components/hangman/hangman.component').then(c => c.HangmanComponent) },
//     { path: 'roulette',
//     loadComponent: () => import('./components/roulette/roulette.component').then(c => c.RouletteComponent) },
//     { path: 'greaterorlesser',
//     loadComponent: () => import('./components/greaterorlesser/greaterorlesser.component').then(c => c.GreaterorlesserComponent) },
//     { path: 'quizgame',
//     loadComponent: () => import('./components/quizgame/quizgame.component').then(c => c.QuizgameComponent) },
//     { path: '**',
//     loadComponent: () => import('./components/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent) },
//     //{ path: '**', component: PageNotFoundComponent }
// ];