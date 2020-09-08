import { Injectable } from '@angular/core';
import * as math from 'mathjs'
import { FormulasService } from './formulas.service';

export class IntegrationResult {
  r: number
  theta: number
  phi: number
  p: number

  constructor(r: number, theta: number, phi: number, p: number) {
    this.r = r
    this.theta = theta
    this.phi = phi
    this.p = p
  }
}

@Injectable({
  providedIn: 'root'
})
export class IntegratorService {

  constructor(private formulaService: FormulasService) { }

  integrate(wavefunction: math.MathNode): IntegrationResult[] {
    let out = []

    let wavefunctionConjugate = this.formulaService.complexConjugate(wavefunction)

    let integrand = math.simplify("(" + wavefunctionConjugate + ")*(" + wavefunction + ") * r^2 * sin(theta)")
    let integrandC = integrand.compile()

    let steps = 50;
    for (let r = 0; r < 100; r += (100 / steps)) {
      for (let theta = 0; theta < Math.PI; theta += (Math.PI / steps)) {
        for (let phi = 0; phi < 2 * Math.PI; phi += (2 * Math.PI / steps)) {
          let rRand = math.random(0, (100 / steps))
          let tRand = math.random(0, (Math.PI / steps))
          let pRand = math.random(0, (2 * Math.PI / steps))

          let p = integrandC.evaluate({ r: r + rRand, theta: theta + tRand, phi: phi + pRand, a: 1 })
          out.push(new IntegrationResult(r + rRand, theta + tRand, phi + pRand, p))
        }
      }
    }

    out.sort((a, b) => b.p - a.p)

    return out
  }
}

