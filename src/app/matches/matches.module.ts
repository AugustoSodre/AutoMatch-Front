import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchesComponent } from './matches.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MatchesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: MatchesComponent }
    ])
  ]
})
export class MatchesModule { }
