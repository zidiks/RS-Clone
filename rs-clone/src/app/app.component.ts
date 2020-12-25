import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Light } from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'rs-clone';

  ngOnInit() { 
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    document.body.appendChild( renderer.domElement );

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 10, 10),
      new THREE.MeshPhongMaterial( { color: 0xffffff } )
    );
    floor.rotation.x -= 0.9;
    floor.position.y -= 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 0.8, 50);
    light.position.set(0, 8, 9);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    const geometry = new THREE.BoxGeometry();
    const matherial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, matherial );
    cube.receiveShadow = true;
    cube.castShadow = true;
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( scene, camera );
    }
    animate();
  }
}
