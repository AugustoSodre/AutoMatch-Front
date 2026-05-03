import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'matches', pathMatch: 'full' },
      { path: 'matches', loadChildren: () => import('./matches/matches.module').then(m => m.MatchesModule) },
      { path: 'common-components', loadChildren: () => import('./common-components/common-components.module').then(m => m.CommonComponentsModule) }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
