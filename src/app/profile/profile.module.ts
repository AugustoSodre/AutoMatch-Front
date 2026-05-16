import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: ProfileComponent }
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { }
