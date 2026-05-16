import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CompareComponent } from './compare.component';

const routes: Routes = [
  { path: '', component: CompareComponent }
];

@NgModule({
  declarations: [CompareComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CompareModule { }
