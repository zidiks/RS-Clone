import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  REQANIMFRAME: any;
  constructor() { }

  ngOnInit(): void {
    let model: any;
    const clock = new THREE.Clock();
    const domScene = <HTMLDivElement>document.getElementById('model');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, domScene.offsetWidth / domScene.offsetHeight, 0.1, 2000);
    camera.rotation.x = -Math.PI/4;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize( domScene.offsetWidth, domScene.offsetHeight );
    renderer.shadowMap.enabled = false;
    domScene.appendChild( renderer.domElement );
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI/3;
    controls.maxPolarAngle = Math.PI/3;
    camera.position.set(0, 4, 7.5);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.6 );
    light.position.set(3, 15, 15);
    scene.add(light);

    const mtlLoader = new MTLLoader();
    mtlLoader.load( 'assets/landing-model/landing.vox.mtl', ( materials ) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.load( 'assets/landing-model/landing.vox.obj',  ( object ) => {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
          });
          model = object;
          object.position.set(0, -3, 0);
          object.scale.set(0.5, 0.5, 0.5)
          scene.add(object);
      }, () => console.log('load...'), () => console.log('err!'));
    });

    const animate = () => {  
      const delta = clock.getDelta();

      this.REQANIMFRAME = requestAnimationFrame( animate );
      if (model) model.rotation.y += 0.005;
      controls.update();
      renderer.render( scene, camera );
    }
    animate();
    
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.REQANIMFRAME);
  }

}
