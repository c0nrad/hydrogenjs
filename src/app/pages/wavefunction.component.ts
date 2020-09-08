import { Component, OnInit } from '@angular/core';
import { FormulasService } from '../services/formulas.service';
import { IntegratorService, IntegrationResult } from '../services/integrator.service';
import * as math from 'mathjs'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as Stats from 'stats.js'

import * as dat from 'dat.gui';
import { Scene } from 'three';

@Component({
  selector: 'app-wavefunction',
  template: `

    <!-- <table class="table">
      <tr><th>r</th><th>theta</th><th>phi</th><th>p</th></tr>

      <tr *ngFor="let r of integrationResults">
        <td>{{r.r}}</td>
        <td>{{r.theta}}</td>
        <td>{{r.phi}}</td>
        <td>{{r.p}}</td>
      </tr>
    </table> -->
  `,
  styles: [
  ]
})
export class WavefunctionComponent implements OnInit {
  integrationResults: IntegrationResult[]

  state = {
    minProb: .00000001,
    points: 10000,
    n: 4,
    l: 2,
    m: 1,
  }

  gui = new dat.GUI();
  stats = new Stats();


  container: any
  camera: THREE.Camera
  scene: THREE.Scene
  renderer: THREE.Renderer
  controls: OrbitControls

  constructor(private integratorService: IntegratorService, private formulaService: FormulasService) {
    this.integrationResults = []
    this.camera = new THREE.Camera()
    this.scene = new THREE.Scene()
    this.renderer = {} as THREE.Renderer
    this.controls = {} as OrbitControls
  }

  ngOnInit(): void {

    this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    this.init();
    this.animate();
  }

  init() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 100;

    this.scene = new THREE.Scene();

    this.generateData()
    this.initGui()
    this.drawData()

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotateSpeed = 5
    this.controls.autoRotate = true

    this.controls.update()
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }


  initGui() {

    // let wavefunctions = []
    // for (let w of wavefunctionData) {
    //   wavefunctions.push(mergeQuantumNumber(w.n, w.l, w.m))
    // }

    this.gui.add(this.state, 'n', 1, 6, 1).name("Ψn").onChange((v) => {
      if (this.state.l >= v) {
        this.state.l = v - 1
      }
      if (this.state.m > this.state.l) {
        this.state.m = this.state.l
      }

      this.gui.updateDisplay()
      this.generateData()
      this.clearData();
      this.drawData();
    })

    this.gui.add(this.state, 'l', 0, 6, 1).name("Ψl").onChange(() => {
      if (this.state.l >= this.state.n) {
        this.state.l = this.state.n - 1
      }
      if (this.state.m > this.state.l) {
        this.state.m = this.state.l
      }

      this.gui.updateDisplay()
      this.generateData()
      this.clearData();
      this.drawData();
    })

    this.gui.add(this.state, 'm', 0, 6, 1).name("Ψm").onChange(() => {
      if (this.state.l >= this.state.n) {
        this.state.l = this.state.n - 1
      }
      if (this.state.m > this.state.l) {
        this.state.m = this.state.l
      }

      this.gui.updateDisplay()
      this.generateData()
      this.clearData();
      this.drawData();
    })

    this.gui.add(this.state, "points", 0, 20000).name("Points").onChange(() => {
      this.clearData(); this.drawData();
    })
  }

  mergeQuantumNumber(n: number, l: number, m: number): string {
    return "" + n + l + m;
  }

  getColor(n: number, l: number, m: number): string {
    return "#0275d8"
    var colors = ["#0275d8", "#5cb85c", "#5bc0de", "#f0ad4e", "#d9534f", "#292b2c", "#f7f7f7"]
  }

  getAlpha(p: number): number {
    if (p > .1) {
      return 1
    }
    if (p > .01) {
      return .8
    }
    if (p > .001) {
      return .5
    }
    if (p > .0001) {
      return .2
    }

    return .1
  }

  clearData() {
    while (this.scene.children.length != 0) {
      this.scene.remove(this.scene.children[0])
    }
  }

  generateData() {
    let wavefunction = this.formulaService.hydrogenWavefunction(this.state.n, this.state.l, this.state.m)
    this.integrationResults = this.integratorService.integrate(wavefunction)
  }

  drawData() {

    var geometry = new THREE.SphereGeometry(.5, 4, 4);
    var material = new THREE.MeshBasicMaterial({ color: "red" });
    var sphere = new THREE.Mesh(geometry, material);
    this.scene.add(sphere);


    // console.log(wavefunction.n, wavefunction.l, wavefunction.m)

    // if (state.wavefunction[0] != wavefunction.n.toString() ||
    //   state.wavefunction[1] != wavefunction.l.toString() ||
    //   state.wavefunction[2] != wavefunction.m.toString()) {
    //   continue
    // }

    let vertices = [];
    let alphas = [];

    for (let i = 0; i < this.state.points; i++) {
      if ((this.integrationResults[i].p) <= this.state.minProb) {
        continue
      }

      let v = new THREE.Vector3(0, 0, 0);
      v.setFromSphericalCoords(this.integrationResults[i].r, this.integrationResults[i].phi, this.integrationResults[i].theta);
      vertices.push(v.x, v.y, v.z);

      alphas.push(this.getAlpha(this.integrationResults[i].p))
    }

    let bgeometry = new THREE.BufferGeometry();
    bgeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    bgeometry.addAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));

    // uniforms
    let uniforms = {
      color: { value: new THREE.Color(this.getColor(3, 1, 1)) },
    };

    // point cloud material
    let shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertextShader,
      fragmentShader: fragmentShader,
      transparent: true
    });

    let points = new THREE.Points(bgeometry, shaderMaterial);
    this.scene.add(points);
  }


  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.stats.begin();
    this.render();
    this.stats.end();
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

let vertextShader = `
attribute float alpha;
varying float vAlpha;
void main() {
    vAlpha = alpha;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = 2.0;
    gl_Position = projectionMatrix * mvPosition;
}`

let fragmentShader = `
uniform vec3 color;
varying float vAlpha;
void main() {
    gl_FragColor = vec4( color, vAlpha );
}`
