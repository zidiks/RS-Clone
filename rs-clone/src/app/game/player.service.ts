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
    squat: boolean,
    squatCount: number,
    squatLength: number,
    squatHeight: number,
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
  //playerAction: any;
  playerActions: THREE.AnimationAction[] = new Array();
  cube: any = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1.6 , 0.2),
    new THREE.MeshPhongMaterial( { color: 0x00ff00 } )
  );
  camera: THREE.PerspectiveCamera;

  constructor(
    camera: THREE.PerspectiveCamera
  ) {
    this.camera = camera;
    this.cube.material.transparent = true;
    this.cube.visible = false;
    this.cube.position.y -= 1;
    this.player.add( this.cube );
    this.player.position.z += 3;
    this.player.position.y += 0.1;

    const loader = new FBXLoader();
    loader.load( 'assets/player.fbx', ( object ) => {
      this.mixer = new THREE.AnimationMixer( object );
      let playerAction = this.mixer.clipAction( object.animations[ 0 ] );
      this.playerActions.push(playerAction);

      loader.load( 'assets/player-roll.fbx', (object) => {
        let playerAction = this.mixer.clipAction( object.animations[ 0 ] );
        this.playerActions.push(playerAction);

        loader.load( 'assets/player-fall.fbx', (object) => {
          let playerAction = this.mixer.clipAction( object.animations[ 0 ] );
          playerAction.setLoop( THREE.LoopOnce );
          this.playerActions.push(playerAction);
          this.playerActions[0].play();
        });
      });

      object.traverse( function ( child ) {
        if ( child instanceof Mesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      object.scale.set(1, 1, 1);
      object.position.y -= 2;
      object.rotation.y += Math.PI;

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
    if(states.control.squat){
      states.control.squatCount++;
      this.cube.position.y = -2;
      this.playerActions[0].stop();
      this.playerActions[0].reset();
      this.playerActions[1].play();
    }
    if(states.control.squatCount>states.control.squatLength){
      states.control.squatCount=0;
      states.control.squat=false;
      states.control.squatHeight = 0;
      this.cube.position.y += 1;
      setTimeout(() => {
        this.playerActions[1].stop();
        this.playerActions[1].reset();
        this.playerActions[0].play();
      }, 250);
    }

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
