import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AccountHubComponent } from './account-hub.component';

const routes: Routes = [
  { path: '', component: AccountHubComponent }
];

@NgModule({
  declarations: [AccountHubComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountHubModule { }
