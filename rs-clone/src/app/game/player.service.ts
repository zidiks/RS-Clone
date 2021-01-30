import { Inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Camera, Mesh } from 'three';
import { STATES_TOKEN } from './game.component';
import { state } from '@angular/animations';
import { globalProps } from '../menu/globalprops';
import { LoadObserverService } from './load-observer.service';

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
  rollLock: boolean = false;
  //playerAction: any;
  playerActions: THREE.AnimationAction[] = new Array();
  cube: any = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1.6 , 0.2),
    new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
  );
  camera: THREE.PerspectiveCamera;
  states: States;
  constructor(
    public loadObserver: LoadObserverService,
    camera: THREE.PerspectiveCamera,
    @Inject(STATES_TOKEN) public STATES_TOKEN: States
  ) {
    this.states = STATES_TOKEN;
    this.camera = camera;
    this.cube.material.transparent = true;
    this.cube.visible = false;
    this.cube.position.y -= 1;
    this.player.add( this.cube );
    this.player.position.z += 3;
    this.player.position.y += 0.1;

    const loader = new FBXLoader();
    loader.load( `assets/skins/${globalProps.activeSkin}/run.fbx`, ( object ) => {
      this.mixer = new THREE.AnimationMixer( object );
      let playerAction = this.mixer.clipAction( object.animations[ 0 ] );
      this.playerActions.push(playerAction);
      this.loadObserver.activatePoint(20);

      loader.load( 'assets/skins/0/roll.fbx', (object) => {
        let playerAction = this.mixer.clipAction( object.animations[ 0 ] );
        playerAction.setDuration(STATES_TOKEN.control.squatLength / 38);
        this.playerActions.push(playerAction);

        loader.load( 'assets/skins/0/fall.fbx', (object) => {
          let playerAction = this.mixer.clipAction( object.animations[ 0 ] );
          playerAction.setLoop( THREE.LoopOnce );
          this.playerActions.push(playerAction);
          
          loader.load( 'assets/skins/0/idle.fbx', (object) => {
            let playerAction = this.mixer.clipAction( object.animations[ 0 ] );
            this.playerActions.push(playerAction);
            this.playerActions[3].play();
            this.loadObserver.activatePoint(10);
          });
        });
      });

      object.traverse( function ( child ) {
        if ( child instanceof Mesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      object.scale.set(0.25, 0.25, 0.25);
      object.position.y -= 2;
      object.rotation.y += Math.PI;

      this.player.add(object);
    } );
  }

  setPlayerPos(target: THREE.Group, states: States, animationManager: any, delta: any) {
    if (target.position.x < ( states.control.xpos * 2 ) && (states.control.xpos * 2) - target.position.x > 0.1) {
      target.position.x += 0.1 * delta;
      this.camera.position.x += 0.07 * delta;
      target.rotation.y = -Math.PI / 4;
    } else if (target.position.x > ( states.control.xpos * 2 ) && target.position.x - (states.control.xpos * 2) > 0.1) {
      target.position.x -= 0.1 * delta;
      this.camera.position.x -= 0.07 * delta;
      target.rotation.y = Math.PI / 4;
    } else {
      target.position.x = states.control.xpos * 2;
      target.rotation.y = 0;
    }
    if(states.control.squat){
      states.control.squatCount += 1 * delta;
      this.cube.position.y = -2;
      if (!this.rollLock) { 
        animationManager.changeAnimationTo('roll');
        this.rollLock = true;
      }
      // this.playerActions[0].stop();
      // this.playerActions[0].reset();
      // this.playerActions[1].play();
    }
    if(states.control.squatCount>states.control.squatLength){
      states.control.squatCount=0;
      states.control.squat=false;
      states.control.squatHeight = 0;
      this.cube.position.y += 1 * delta;
      setTimeout(() => {
        animationManager.changeAnimationTo('run');
        this.rollLock = false;
      }, 230);
    }

    if(states.control.jumpPressed){
      states.control.jumpCount += 1 * delta;
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
