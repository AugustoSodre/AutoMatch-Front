import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonComponentsComponent } from './common-components.component';

@NgModule({
  declarations: [CommonComponentsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CommonComponentsComponent }
    ])
  ]
})
export class CommonComponentsModule { }
