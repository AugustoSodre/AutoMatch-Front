import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then((module) => module.HomeModule) },
  { path: 'about', loadChildren: () => import('./about/about.module').then((module) => module.AboutModule) },
  { path: 'profile', loadChildren: () => import('./account-hub/account-hub.module').then((module) => module.AccountHubModule) },
  { path: 'account-hub', loadChildren: () => import('./account-hub/account-hub.module').then((module) => module.AccountHubModule) },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((module) => module.AuthModule) },
  { path: 'matches', redirectTo: 'meus-matches', pathMatch: 'full' },
  { path: 'meus-matches', loadComponent: () => import('./matches/saved-matches-dashboard.component').then((component) => component.SavedMatchesDashboardComponent) },
  { path: 'compare', redirectTo: 'comparar', pathMatch: 'full' },
  { path: 'comparar', loadComponent: () => import('./comparison-page/comparison-page.component').then((component) => component.ComparisonPageComponent) },
  { path: 'novo-match', loadComponent: () => import('./new-match-wizard/new-match-wizard.component').then((component) => component.NewMatchWizardComponent) },
  { path: 'car-details', loadChildren: () => import('./car-details/car-details.module').then((module) => module.CarDetailsModule) },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
