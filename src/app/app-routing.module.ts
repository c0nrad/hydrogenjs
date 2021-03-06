import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormulasComponent } from './pages/formulas.component';
import { AppComponent } from './app.component';
import { WavefunctionComponent } from './pages/wavefunction.component';

const routes: Routes = [
  { path: 'formulas', component: FormulasComponent },
  { path: '', component: WavefunctionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
