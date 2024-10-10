import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Home',
    pathMatch: 'full',
  },
  {
    path: 'folder/Calendario',
    loadComponent: () => import('./pages/calendar/calendar.page').then( m => m.CalendarPage)
  },
  {
    path: 'folder/Clases',
    loadComponent: () => import('./pages/class/class.page').then( m => m.ClassPage)
  },
  {
    path: 'folder/Home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'add-update-class',
    loadComponent: () => import('./pages/class/add-update-class/add-update-class.page').then( m => m.AddUpdateClassPage)
  },

];
