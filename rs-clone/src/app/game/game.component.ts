import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as THREE from 'three';
import * as STATS from 'stats.js';
import { EnvironementService } from './environement.service';
import { PlayerService } from './player.service';
import { EnemyService } from './enemy.service';

interface States {
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
  play: boolean,
  end: boolean,
  startAnim: boolean,
  score: number
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  constructor(
    private location: Location
    ) {
    this.location.replaceState('/');
   }

  ngOnInit(): void {
    const STATES: States = {
      control: {
        jumpPressed: false,
        jumpCount: 0,
        jumpLength: 37,
        jumpHeight: 0,
        squat: false,
        squatCount: 0,
        squatLength: 25,
        squatHeight: 0,
        xpos: 0
      },
      speed: 2.5,
      play: false,
      end: false,
      startAnim: false,
      score: 0
    }

    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }

    const audioObj = new Audio(`assets/audio/audio_${getRandomInt(1, 3)}.mp3`);
    audioObj.onended = function() {
      audioObj.play();
    };
    const domScene = <HTMLDivElement>document.getElementById('game-scene');
    const domScore = <HTMLDivElement>document.getElementById('game-score');

    const stats = new STATS();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    domScene.appendChild(stats.dom);

    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('lightblue', 10, 30);
    scene.background =  new THREE.Color('lightblue');
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

    const env = new EnvironementService(scene);
    const playerManager = new PlayerService(camera);
    const enemyManager = new EnemyService(scene);

    const endGame = document.createElement('div');
    endGame.className = 'end-game';
    endGame.style.color = 'green';
    endGame.textContent = 'PRESS SPACE TO START!';

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    //renderer.setPixelRatio( 0.5 );

    domScene.appendChild( renderer.domElement );
    domScene.appendChild( endGame );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.7 );
    light.position.set(2, 10, 7);
    light.castShadow = true;
    light.shadow.camera.top = 30;
    light.shadow.camera.right = 20;
    light.shadow.camera.bottom = - 10;
    light.shadow.camera.left = -20;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 2000;
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

    document.addEventListener("keydown", keyRightHandler, false);

    function keyRightHandler(e: { keyCode: number; }){
      if(e.keyCode == 38){
        STATES.control.jumpPressed = true;
      }
      if(e.keyCode === 40){
        STATES.control.squat = true;
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
            //audioObj.play();
          }, 700);
          STATES.startAnim = true;
        }
      }
      if(e.keyCode == 37){
        if (STATES.control.xpos > -1) {
          STATES.control.xpos -= 1;
        }
      }
    }

    // function getRandomInt(min: number, max: number) {
    //   min = Math.ceil(min);
    //   max = Math.floor(max);
    //   return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    // }

    function animate() {
      stats.begin();
      if (STATES.startAnim) {
        if (camera.position.x > 0 || camera.position.z < 5) {
          if (camera.position.z < 5) camera.position.z += 0.05;
          if (camera.position.x > 0) camera.position.x -= 0.1;
          camera.lookAt(cameraTarget);
        } else {
          camera.position.x = 0;
          camera.position.z = 5;
          camera.rotation.y = 0;
          camera.rotation.z = 0;
          STATES.startAnim = false;
          STATES.play = true;
        }
      }

      if (STATES.play) {
        playerManager.playerAction.setDuration(STATES.speed ** -1);
        env.MoveEnv(STATES.speed);
        enemyManager.moveEnemies(STATES.speed, playerManager.cube, endGame, STATES, audioObj);
        playerManager.setPlayerPos(playerManager.player, STATES);

        STATES.speed += 0.002 * (STATES.speed ** ( -1 * STATES.speed));
        STATES.score += 0.01;
        domScore.textContent = `${Math.round(STATES.score)}`;
        const delta = clock.getDelta();
        if ( playerManager.mixer ) playerManager.mixer.update( delta );
      }

      stats.end();

      requestAnimationFrame( animate );

      renderer.render( scene, camera );
    }
    animate();
  }

}
