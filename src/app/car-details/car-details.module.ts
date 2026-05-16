import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CarDetailsComponent } from './car-details.component';

const routes: Routes = [
  { path: '', component: CarDetailsComponent }
];

@NgModule({
  declarations: [CarDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CarDetailsModule { }
