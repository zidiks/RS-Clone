import { Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import * as THREE from 'three';
import * as STATS from 'stats.js';
import { EnvironementService } from './environement.service';
import { PlayerService } from './player.service';
import { EnemyService } from './enemy.service';
import { EndGameService } from './end-game.service';
import { InjectionToken } from '@angular/core';
import { AnimationService } from './animation.service';
import { AudioService } from './audio.service';
import { UserService } from '../menu/user.service';
import { globalProps } from '../menu/globalprops';
import { audioManager } from '../menu/menu.component';
import { LoadObserverService } from './load-observer.service';

export interface States {
  control: {
    jumpPressed: boolean,
    jumpCount: number,
    jumpLength: number,
    jumpHeight: number,
    squatCount: number,
    squatLength: number,
    squatHeight: number,
    squat: boolean,
    xpos: number
  },
  speed: number,
  force: boolean,
  forceDuration: number,
  animation: boolean,
  play: boolean,
  end: boolean,
  startAnim: boolean,
  score: number,
  coins: number,
  loaded: boolean,
  loadProgress: number,
  hole: boolean
}

export interface Animations {
  [key: string]: THREE.AnimationAction[];
}

export const STATES_TOKEN = new InjectionToken<States>('StatesToken');
export const ANIMATIONS_TOKEN = new InjectionToken<Animations>('AnimationsToken');

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [
    { provide: STATES_TOKEN, useValue: {
      control: {
        jumpPressed: false,
        jumpCount: 0,
        jumpLength: 40,
        jumpHeight: 0,
        squat: false,
        squatCount: 0,
        squatLength: 40,
        squatHeight: 0,
        xpos: 0
      },
      speed: 2.5,
      force: true,
      forceDuration: 1,
      animation: true,
      play: false,
      end: false,
      startAnim: false,
      score: 0,
      coins: 0,
      loaded: false,
      loadProgress: 0,
      hole: false
    } },
    { provide: ANIMATIONS_TOKEN, useValue: {} }
  ]
})
export class GameComponent implements OnInit, OnDestroy {
  RENDERER: any;
  SCENE: any;
  STATES: States;
  ANIMATIONS: Animations;
  AUDIO: AudioService | undefined = undefined;
  animate: any;
  REQANIMFRAME: any;
  newScore: boolean = false;
  RESIZER: any;
  keyRightHandler: any;
  loadedImgs = globalProps.loadImg;
  constructor(
    public loadObserver: LoadObserverService,
    public router: Router,
    public userManager: UserService,
    private elementRef: ElementRef,
    @Inject(STATES_TOKEN) public STATES_TOKEN: States,
    @Inject(ANIMATIONS_TOKEN) public ANIMATIONS_TOKEN: Animations = {},
    private location: Location
    ) {
    this.location.replaceState('/');
    this.STATES = STATES_TOKEN;
    this.ANIMATIONS = ANIMATIONS_TOKEN;
   }

  ngOnInit(): void {
    THREE.Cache.enabled = true;
    this.STATES = {
      control: {
        jumpPressed: false,
        jumpCount: 0,
        jumpLength: 40,
        jumpHeight: 0,
        squat: false,
        squatCount: 0,
        squatLength: 35,
        squatHeight: 0,
        xpos: 0
      },
      speed: 2.5,
      force: true,
      forceDuration: 1,
      animation: true,
      play: false,
      end: false,
      startAnim: false,
      score: 0,
      coins: 0,
      loaded: false,
      loadProgress: 0,
      hole: false
    };
    this.loadObserver.setStates(this.STATES);
    const STATES = this.STATES;
    const audioManager = new AudioService();
    this.AUDIO = audioManager;
    this.AUDIO.setVolume();

    const domScene = <HTMLDivElement>document.getElementById('game-scene');
    const domScore = <HTMLDivElement>document.getElementById('game-score');
    const hScore = <HTMLDivElement>document.getElementById('newScore');

    const clock = new THREE.Clock();
    this.SCENE = new THREE.Scene();
    const scene = this.SCENE;
    scene.fog = new THREE.Fog('lightblue', 15, 30);
    scene.background =  new THREE.Color('lightblue');
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30);

    const env = new EnvironementService(this.loadObserver, scene);
    const playerManager = new PlayerService(this.loadObserver, camera, STATES);
    const enemyManager = new EnemyService(this.loadObserver, scene);
    this.ANIMATIONS.playerAnimations = playerManager.playerActions;
    const animationManager = new AnimationService(this.ANIMATIONS, STATES);

    const endGame = document.createElement('div');
    endGame.className = 'end-game';
    endGame.style.background = 'url("../../assets/UI/start.png") center center no-repeat';

    const endManager = new EndGameService(this.router, endGame, STATES, audioManager, animationManager, this.userManager);

    this.RENDERER = new THREE.WebGLRenderer({ antialias: globalProps.options.antialiasing });
    const renderer = this.RENDERER;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = globalProps.options.shadows;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setPixelRatio( globalProps.options.quality );

    this.RESIZER = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener( 'resize', this.RESIZER, false );

    domScene.appendChild( renderer.domElement );
    domScene.appendChild( endGame );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    light.position.set(2, 10, 7);
    light.castShadow = true;
    light.shadow.camera.top = 30;
    light.shadow.camera.right = 20;
    light.shadow.camera.bottom = - 10;
    light.shadow.camera.left = -20;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 30;
    light.shadow.mapSize.width = window.innerWidth * 2;
    light.shadow.mapSize.height = window.innerHeight * 2;
    scene.add(light);

    scene.add(playerManager.player);

    camera.position.z = 3;
    camera.position.y = 2;
    camera.position.x = 5;
    camera.rotation.y += 1.5;
    let cameraTarget = new THREE.Vector3().copy(playerManager.cube.position);
    cameraTarget.y -= 0;
    camera.lookAt(cameraTarget);

    this.keyRightHandler = (e: { keyCode: number; }) => {
      if(e.keyCode == 38){
        if (STATES.control.jumpPressed === false) audioManager.jumpPlay();
        STATES.control.jumpPressed = true;
        playerManager.cube.position.y = -1;
        STATES.control.squat = false;
        STATES.control.squatCount = 0;
        animationManager.changeAnimationTo('jump');
        playerManager.rollLock = false;
      }
      if(e.keyCode === 40){
        if (STATES.control.squat === false) audioManager.rollPlay();
        STATES.control.squat = true;
        STATES.control.jumpPressed = false;
        STATES.control.jumpCount=0;
      }
      if(e.keyCode == 39){
        if (STATES.control.xpos < 1) {
          STATES.control.xpos += 1;
        }
      }
      if(e.keyCode == 32){
        if (STATES.play === false && STATES.end === false) {
          endGame.style.display = 'none';
          setTimeout(() => {
            audioManager.playBackground();
          }, 800);
          STATES.startAnim = true;
        }
      }
      if(e.keyCode == 37){
        if (STATES.control.xpos > -1) {
          STATES.control.xpos -= 1;
        }
      }
      if (e.keyCode === 16) {
        if (STATES.speed < 3 &&
          STATES.force === true &&
          STATES.forceDuration !== 0) {
          STATES.speed += 2;
          setTimeout(() => {
            STATES.forceDuration = 0;
            STATES.force = false;
            STATES.speed = 2.5;
          }, 1500);
          setTimeout(() => {
            STATES.forceDuration = 1;
            STATES.force = true;
          }, 2000);
        }
      }
    }

    document.addEventListener("keydown", this.keyRightHandler, false);

    this.animate = () => {
      const delta = clock.getDelta();
      const deltak = delta * 50;

      this.REQANIMFRAME = requestAnimationFrame( this.animate );

      // stats.begin();
      if (STATES.startAnim) {
        if (camera.position.x > 0 || camera.position.z < 6) {
          if (camera.position.z < 6) camera.position.z += 0.06 * deltak;
          if (camera.position.x > 0) camera.position.x -= 0.1 * deltak;
          camera.lookAt(cameraTarget);
        } else {
          camera.position.x = 0;
          camera.position.z = 6;
          camera.rotation.y = 0;
          camera.rotation.z = 0;
          STATES.startAnim = false;
          STATES.play = true;
          animationManager.changeAnimationTo('run');
        }
      }

      if (STATES.hole) {
        if (playerManager.player.position.y > -2) playerManager.player.position.y -= 0.2 * deltak; else STATES.hole = false;
      }

      if (STATES.play) {
        playerManager.playerActions[0].setDuration(STATES.speed ** -1);
        env.MoveEnv(STATES.speed, deltak);
        enemyManager.moveEnemies(STATES.speed, playerManager.cube, endManager, STATES, audioManager, deltak);
        playerManager.setPlayerPos(playerManager.player, STATES, animationManager, deltak);

        STATES.speed += 0.01 * (STATES.speed ** ( -1 * STATES.speed)) * deltak;
        STATES.score += 0.01 * STATES.speed * deltak;
        const stringScore = `${Math.round(STATES.score)}`;
        domScore.textContent = (stringScore.length < 5 ? '0'.repeat(5-stringScore.length) : '') + stringScore;
        if (!this.newScore && (globalProps.highScore < STATES.score)) {
          this.newScore = true;
          hScore.style.display = 'block';
        }  
      } else {
        if (playerManager.player.position.y > 0.15) playerManager.player.position.y -= 0.18 * deltak;
      }


      if ( playerManager.mixer && STATES.animation ) playerManager.mixer.update( delta );

      // stats.end();

      renderer.render( scene, camera );
    }
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.REQANIMFRAME);
    window.removeEventListener( 'resize', this.RESIZER, false );
    document.removeEventListener("keydown", this.keyRightHandler, false);
    if (this.AUDIO) this.AUDIO.pauseAll();
    this.RENDERER = null;
    this.SCENE.clear();
    this.SCENE = null;
    this.elementRef.nativeElement.remove();
  }

}
