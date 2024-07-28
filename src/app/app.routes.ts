import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'chart',
    loadComponent: () =>
      import('./pages/chart-data/chart-data.component').then(
        (c) => c.ChartDataComponent
      ),
  },
];
