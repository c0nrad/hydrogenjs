import { Component, OnInit } from '@angular/core';
import { FormulasService } from '../services/formulas.service'
import * as math from 'mathjs'

@Component({
  selector: 'app-formulas',
  template: `
    <div class="container-fluid">
    <h3> Legendre Formulas </h3>
    <table class="table">
      <tr><th><ng-katex equation="l"></ng-katex></th><th>Formula</th></tr>
      <tr *ngFor="let a of [0,1,2,3,4,5]">
        <td>{{a}}</td>
        <td>
          <ng-katex [equation]="legendrePolynomial(a)"></ng-katex>
        </td>
      </tr>
    </table>


    <h3> Associated Legendre Formulas (x = cos(x)) </h3>
    <table class="table">
      <tr>
      <th><ng-katex equation="m"></ng-katex></th>
      <th><ng-katex equation="l"></ng-katex></th>
      <th>Formula</th></tr>
      <ng-container *ngFor="let m of [0, 1, 2, 3]">
      <tr *ngFor="let l of [0,1,2,3]">
        <td>{{m}}</td>
        <td>{{l}}
        <td>
          <ng-katex [equation]="associatedLegendrePolynomial(m,l)"></ng-katex>
        </td>
      </tr>
      </ng-container>
    </table>

    <h3> Spherical Harmonics </h3>
    <table class="table">
      <tr>
      <th><ng-katex equation="m"></ng-katex></th>
      <th><ng-katex equation="l"></ng-katex></th>
      <th>Formula</th></tr>
      <ng-container *ngFor="let m of [0, 1, 2, 3]">
      <tr *ngFor="let l of [0,1,2,3]">
        <td>{{m}}</td>
        <td>{{l}}
        <td>
          <ng-katex [equation]="sphericalHarmonics(m,l)"></ng-katex>
        </td>
      </tr>
      </ng-container>
    </table>

    <h3>Laguerre Polynomial</h3>
    <table class="table">
      <tr>
      <th><ng-katex equation="q"></ng-katex></th>
      <th>Formula</th></tr>
      <tr *ngFor="let q of [0,1,2,3]">
        <td>{{q}}</td>
        <td>
          <ng-katex [equation]="laguerrePolynomial(q)"></ng-katex>
        </td>
      </tr>
    </table>

    <h3> Associated Laguerre Polynomial </h3>
    <table class="table">
      <tr>
      <th><ng-katex equation="p"></ng-katex></th>
      <th><ng-katex equation="q"></ng-katex></th>
      <th>Formula</th></tr>
      <ng-container *ngFor="let p of [0, 1, 2, 3]">
      <tr *ngFor="let q of [0,1,2, 3]">
        <td>{{p}}</td>
        <td>{{q}}
        <td>
           <ng-katex [equation]="associatedLaguerrePolynomial(p, q)"></ng-katex>
        </td>
      </tr>
      </ng-container>
    </table>

    <h3> Hydrogren </h3>
    <table class="table">
      <tr>
      <th><ng-katex equation="n"></ng-katex></th>
      <th><ng-katex equation="l"></ng-katex></th>
      <th><ng-katex equation="m"></ng-katex></th>
      <th>Formula</th></tr>
      <ng-container *ngFor="let n of [0, 1, 2, 3]">
      <ng-container *ngFor="let l of [0, 1, 2, 3]">
      <tr *ngFor="let m of [0,1,2, 3]">
        <td>{{n}}</td>
        <td>{{l}}</td>
        <td>{{m}}</td>
        <td>
           <ng-katex [equation]="hydrogenWavefunction(n, l, m)"></ng-katex>
        </td>
      </tr>
      </ng-container>
      </ng-container>
    </table>
    </div>
  `,
  styles: [
  ]
})
export class FormulasComponent implements OnInit {

  constructor(private formulaService: FormulasService) {
  }

  ngOnInit(): void {
  }

  legendrePolynomial(l: number): string {
    return this.formulaService.legendrePolynomial(l).toTex()
  }

  associatedLegendrePolynomial(m: number, l: number): string {
    let out = this.formulaService.subSymbol(this.formulaService.associatedLegendre(m, l), "x", "cos(x)")
    return out.toTex()
  }

  sphericalHarmonics(m: number, l: number): string {
    return this.formulaService.sphericalHarmonics(m, l).toTex()
  }

  laguerrePolynomial(q: number): string {
    return this.formulaService.laguerrePolynomial(q).toTex()
  }

  associatedLaguerrePolynomial(p: number, q: number): string {
    return this.formulaService.associatedLaguerrePolynomial(p, q).toTex()
  }

  hydrogenWavefunction(n: number, l: number, m: number): string {
    return this.formulaService.hydrogenWavefunction(n, l, m).toTex()
  }
}
