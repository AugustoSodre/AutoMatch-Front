import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadChildren: () => import('./home/home.module').then((module) => module.HomeModule) },
  { path: 'sobre', loadChildren: () => import('./about/about.module').then((module) => module.AboutModule) },
  { path: 'perfil', loadChildren: () => import('./account-hub/account-hub.module').then((module) => module.AccountHubModule) },
  { path: 'painel-conta', loadChildren: () => import('./account-hub/account-hub.module').then((module) => module.AccountHubModule) },
  { path: 'entrar', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'registrar', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((module) => module.AuthModule) },
  { path: 'matches', redirectTo: 'meus-matches', pathMatch: 'full' },
  { path: 'meus-matches', loadComponent: () => import('./matches/saved-matches-dashboard.component').then((component) => component.SavedMatchesDashboardComponent) },
  { path: 'compare', redirectTo: 'comparar', pathMatch: 'full' },
  { path: 'comparar', loadComponent: () => import('./comparison-page/comparison-page.component').then((component) => component.ComparisonPageComponent) },
  { path: 'novo-match', loadComponent: () => import('./new-match-wizard/new-match-wizard.component').then((component) => component.NewMatchWizardComponent) },
  { path: 'detalhes-carro', loadComponent: () => import('./car-details/car-details.component').then((m) => m.CarDetailsComponent) },
  { path: 'administracao', loadChildren: () => import('./admin/admin.module').then((module) => module.AdminModule) },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
