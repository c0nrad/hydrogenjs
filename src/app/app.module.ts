import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormulasComponent } from './pages/formulas.component';

// @ts-ignore
import { KatexModule } from 'ng-katex';
import { WavefunctionComponent } from './pages/wavefunction.component';

@NgModule({
  declarations: [
    AppComponent,
    FormulasComponent,
    WavefunctionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KatexModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
