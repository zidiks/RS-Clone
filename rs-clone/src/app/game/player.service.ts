import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Camera, Mesh } from 'three';

interface States {
  control: {
    jumpPressed: boolean,
    jumpCount: number,
    jumpLength: number,
    jumpHeight: number,
<<<<<<< HEAD
=======
    squat: boolean,
    squatCount: number,
    squatLength: number,
    squatHeight: number,
>>>>>>> AndreiYa
    xpos: number
  },
  speed: number,
  play: boolean,
  end: boolean,
  startAnim: boolean,
  score: number
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  mixer: any;
  player: any = new THREE.Group;
  playerAction: any;
<<<<<<< HEAD
  cube: any = new THREE.Mesh( 
    new THREE.BoxGeometry(0.5, 1.7 , 0.3),
=======
  cube: any = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1.6 , 0.2),
>>>>>>> AndreiYa
    new THREE.MeshPhongMaterial( { color: 0x00ff00 } )
  );
  camera: THREE.PerspectiveCamera;

  constructor(
    camera: THREE.PerspectiveCamera
  ) {
    this.camera = camera;
    this.cube.material.transparent = true;
<<<<<<< HEAD
    this.cube.visible = false;
=======
    this.cube.visible = true;
>>>>>>> AndreiYa
    this.cube.position.y -= 1;
    this.player.add( this.cube );
    this.player.position.z += 3;
    this.player.position.y += 0.1;
<<<<<<< HEAD
    
    const loader = new FBXLoader();
    loader.load( 'assets/player.fbx', ( object ) => {   
=======

    const loader = new FBXLoader();
    loader.load( 'assets/player.fbx', ( object ) => {
>>>>>>> AndreiYa
      this.mixer = new THREE.AnimationMixer( object );
      this.playerAction = this.mixer.clipAction( object.animations[ 0 ] );
      this.playerAction.play();
      object.traverse( function ( child ) {
        if ( child instanceof Mesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
<<<<<<< HEAD
      
      object.scale.set(1, 1, 1);
      object.position.y -= 2;
      object.rotation.y += Math.PI;
      
=======

      object.scale.set(1, 1, 1);
      object.position.y -= 2;
      object.rotation.y += Math.PI;

>>>>>>> AndreiYa
      this.player.add(object);
    } );
  }

  setPlayerPos(target: THREE.Group, states: States) {
    if (target.position.x < ( states.control.xpos * 2 ) && (states.control.xpos * 2) - target.position.x > 0.1) {
      target.position.x += 0.1;
      this.camera.position.x += 0.07;
      target.rotation.y = -Math.PI / 4;
    } else if (target.position.x > ( states.control.xpos * 2 ) && target.position.x - (states.control.xpos * 2) > 0.1) {
      target.position.x -= 0.1;
      this.camera.position.x -= 0.07;
      target.rotation.y = Math.PI / 4;
    } else {
      target.position.x = states.control.xpos * 2;
      target.rotation.y = 0;
    }
<<<<<<< HEAD
=======
    if(states.control.squat){
      states.control.squatCount++;
      this.cube.position.y = -2;
    }
    if(states.control.squatCount>states.control.squatLength){
      states.control.squatCount=0;
      states.control.squat=false;
      states.control.squatHeight = 0;
      this.cube.position.y += 1;
    }

>>>>>>> AndreiYa
    if(states.control.jumpPressed){
      states.control.jumpCount++;
      states.control.jumpHeight = 0.05*states.control.jumpLength*Math.sin(Math.PI*states.control.jumpCount/states.control.jumpLength);
    }
    if(states.control.jumpCount>states.control.jumpLength){
      states.control.jumpCount=0;
      states.control.jumpPressed=false;
      states.control.jumpHeight=0;
    }
    target.position.y = states.control.jumpHeight;
  }
}
