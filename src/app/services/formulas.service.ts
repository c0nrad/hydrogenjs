import { Injectable } from '@angular/core';
import * as math from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class FormulasService {

  constructor() { }

  associatedLegendre(m: number, l: number): math.MathNode {
    let legendre = this.legendrePolynomial(l)
    for (let i = 0; i < m; i++) {
      legendre = math.derivative(legendre, "x")
    }
    let out = math.parse("(-1)^(m) * (1-x^2)^(m/2) * (" + legendre + ")")

    //@ts-ignore
    return math.simplify(out, { m: m, l: l })
  }

  subSymbol(n: math.MathNode, symbol: string, exp: string): math.MathNode {
    return n.transform(function (node, path, parent) {
      if (node.isSymbolNode && node.name === symbol) {
        return math.parse(exp)
      }
      else {
        return node
      }
    })
  }

  complexConjugate(n: math.MathNode): math.MathNode {
    return n.transform(function (node, path, parent) {
      if (node.name === "i") {
        return math.parse("-i")
      }
      else {
        return node
      }
    })
  }

  legendrePolynomial(l: number): math.MathNode {
    let curr = math.parse("(x^2 - 1)^l")
    for (let i = 0; i < l; i++) {
      curr = math.derivative(curr, "x")
    }
    //@ts-ignore
    return math.simplify(math.parse(" (1/(2^(l) * l!)) * (" + curr.toString() + ")"), { l: l })
  }

  sphericalHarmonics(m: number, l: number): math.MathNode {
    let p = this.associatedLegendre(m, l)
    p = this.subSymbol(p, "x", "cos(theta)")

    //@ts-ignore
    return math.simplify(math.parse("sqrt( ((2l+1) * (l-m)!) / ( 4 pi * (l+m)!)) * e^(i m phi) * (" + p.toString() + ")"), { l: l, m: m })
  }

  laguerrePolynomial(q: number): math.MathNode {
    return this.laguerrePolynomialRecursive(q)

    // @ts-ignore
    let d = math.simplify("e^(-x) * x^q", { q: q })
    for (let i = 0; i < q; i++) {
      d = math.derivative(d, "x")
    }

    // @ts-ignore
    return math.simplify(math.parse("((e^x)/(q!)) * (" + d.toString() + ")"), { q: q })

  }

  laguerrePolynomialRecursive(q: number): math.MathNode {
    if (q == 0) {
      return math.parse("1")
    }
    if (q == 1) {
      return math.parse("1-x")
    }

    let lm1 = this.laguerrePolynomial(q - 1)
    let lm2 = this.laguerrePolynomial(q - 2)

    // @ts-ignore
    return math.rationalize(math.simplify("((2(q-1) + 1 - x) * (" + lm1.toString() + ") - (q-1)*(" + lm2.toString() + "))/(q)", { q: q }))
  }

  associatedLaguerrePolynomial(p: number, q: number): math.MathNode {
    let l = this.laguerrePolynomial(p + q)
    for (let i = 0; i < p; i++) {
      l = math.derivative(l, "x")
    }

    // @ts-ignore
    return math.rationalize(math.simplify(math.parse("(-1)^(p) * (" + l.toString() + ")"), { q: q, p: p }))
  }

  hydrogenWavefunction(n: number, l: number, m: number): math.MathNode {
    let sqrt = ("sqrt((2/(n * a))^(3) * (n-l-1)! / (2n * ((n+l)!)))")
    let middle = ("e^(-r/(n a)) * (2r/(n a))^(l)")
    let lag = this.subSymbol(this.associatedLaguerrePolynomial(2 * l + 1, n - l - 1), "x", "2 * r / (n * a)")
    let har = this.sphericalHarmonics(m, l)

    //@ts-ignore
    return math.simplify("(" + sqrt + ")*(" + middle + ") * (" + lag.toString() + ")*(" + har.toString() + ")", { n: n, l: l, m: m })
  }
}
