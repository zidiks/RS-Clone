import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Mesh } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { AudioService } from './audio.service';
import { globalProps } from './globalprops';

export const audioManager = new AudioService();

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  audioManager: AudioService = audioManager;
  constructor() { 
  }

  ngOnInit(): void {
    const Hi = <HTMLDivElement>document.getElementById('hi');
    if (globalProps.hiScreen) {
      audioManager.playBg();
      Hi.style.display = 'none';
    }
    const clock = new THREE.Clock();
    const domScene = <HTMLDivElement>document.getElementById('menu-background');
    const domHi = <HTMLDivElement>document.getElementById('hi-play');
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('lightblue', 10, 30);
    scene.background =  new THREE.Color('lightblue');
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = false;
    domScene.appendChild( renderer.domElement );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    light.position.set(2, 10, 15);
    scene.add(light);

    // const floor = new THREE.Mesh(
    //   new THREE.PlaneGeometry(10, 100, 10, 10),
    //   new THREE.MeshPhongMaterial( { color: 0xFFE89F } )
    // );
    // floor.rotation.x = -(Math.PI / 2);
    // floor.position.y -= 2;
    // floor.receiveShadow = true;
    // scene.add(floor);

    domHi.addEventListener('click', () => {
      audioManager.playBg();
      Hi.style.display = 'none';
      globalProps.hiScreen = true;
    });


    let mixer: any;

    const loader = new FBXLoader();
    loader.load( 'assets/player-menu.fbx', ( object ) => {
      mixer = new THREE.AnimationMixer( object );
      let playerAction = mixer.clipAction( object.animations[ 0 ] );

      object.traverse( function ( child ) {
        if ( child instanceof Mesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      object.scale.set(1, 1, 1);
      object.position.y -= 1.1;
      object.position.z = -3;
      playerAction.play();

      scene.add(object);
    } );

    

    function animate() {  
      const delta = clock.getDelta();
      if (mixer) mixer.update( delta );

      requestAnimationFrame( animate );

      renderer.render( scene, camera );
    }
    animate();
  }

}
export function openMenu() {
  alert("menu");
}
