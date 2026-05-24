import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../systems-services/admin.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCarsComponent } from './admin-cars/admin-cars.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'carros', component: AdminCarsComponent, canActivate: [AdminGuard] },
  { path: 'usuarios', component: AdminUsersComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
