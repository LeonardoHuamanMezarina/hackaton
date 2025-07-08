import { Routes } from '@angular/router';
import { BiblioListComponent } from './feature/biblio-list/biblio-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/biblioteca', pathMatch: 'full' },
  { path: 'biblioteca', component: BiblioListComponent },
  { path: '**', redirectTo: '/biblioteca' }
];
