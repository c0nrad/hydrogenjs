import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormulasComponent } from './pages/formulas.component';
import { AppComponent } from './app.component';
import { WavefunctionComponent } from './pages/wavefunction.component';

const routes: Routes = [
  { path: 'formulas', component: FormulasComponent },
  { path: 'wave', component: WavefunctionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
