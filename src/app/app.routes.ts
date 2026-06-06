import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'portfolio', component: HomeComponent }, // Allow direct routing to home but focused on portfolio id handled via scroll
  { path: '**', redirectTo: '' } // Redirect invalid routes to home to prevent empty pages
];
