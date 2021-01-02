import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as THREE from 'three';
import * as STATS from 'stats.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Mesh } from 'three';
import { EnvironementService } from './environement.service';
import { PlayerService } from './player.service';
import { EnemyService } from './enemy.service';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

interface States {
  control: {
    jumpPressed: boolean,
    jumpCount: number,
    jumpLength: number,
    jumpHeight: number,
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
    private location: Location,
    private elementRef: ElementRef
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
        xpos: 0
      },
      speed: 1.5,
      play: false,
      end: false,
      startAnim: false,
      score: 0
    }

    const domScene = <HTMLDivElement>document.getElementById('game-scene');
    const domScore = <HTMLDivElement>document.getElementById('game-score');

    // const stats = new STATS();
    // stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    // domScene.appendChild(stats.dom);

    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('lightblue', 10, 30);
    scene.background =  new THREE.Color('lightblue');
    const env = new EnvironementService(scene);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    // var mtlLoader = new MTLLoader();
    // var url = "assets/untitled.mtl";
    // mtlLoader.load( url, function( materials ) {

    //     materials.preload();

    //     var objLoader = new OBJLoader();
    //     objLoader.setMaterials( materials );
    //     objLoader.load( 'assets/untitled.obj', function ( object ) {

    //         object.position.y -=2;
    //         scene.add( object );

    //     }, () => console.log('load...'), () => console.log('err!') );

    // });

    // let mixer: THREE.AnimationMixer;
    // const loader = new FBXLoader();
    // const player = new THREE.Group();
    const playerManager = new PlayerService();
    const enemyManager = new EnemyService(scene);
    enemyManager.generateWay(6);

    const endGame = document.createElement('div');
    endGame.className = 'end-game';
    endGame.style.color = 'green';
    endGame.textContent = 'PRESS SPACE TO START!';
    

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

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
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    // const enemyBox = new THREE.Mesh(
    //   new THREE.BoxGeometry(1.8, 1.5, 0.2),
    //   new THREE.MeshPhongMaterial( { color: 0xff0000 } )
    // );
    // enemyBox.position.y += 0.3
    // enemyBox.visible = false;

    // const enemy = new THREE.Group;
    // const mtlLoader = new MTLLoader;
    // mtlLoader.load( 'assets/enemy/1/1.vox.mtl', function( materials ) {

    //   materials.preload();

    //   var objLoader = new OBJLoader();
    //   objLoader.setMaterials( materials );
    //   objLoader.load( 'assets/enemy/1/1.vox.obj', function ( en ) {

    //       //object.position.set(element.pos[0], element.pos[1], element.pos[2]);
    //       en.traverse(function(child) {
    //         if (child instanceof THREE.Mesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //       }
    //       en.position.y -= 0.25;
    //       enemy.add(en);
    //       enemy.add(enemyBox);
    //       enemy.position.y -= 0.8;
    //       enemy.position.z = -40;
    //       scene.add(enemy);
    //       });
          
    //   }, () => console.log('load...'), () => console.log('err!') );
    // });

    
    scene.add(playerManager.player);

    camera.position.z = 3;
    camera.position.y = 2;
    camera.position.x = 5;
    camera.rotation.y += 1.5;
    let cameraTarget = new THREE.Vector3().copy(playerManager.cube.position);
    cameraTarget.y -= 1;
    camera.lookAt(cameraTarget);

    document.addEventListener("keydown", keyRightHandler, false);

    function keyRightHandler(e: { keyCode: number; }){
      if(e.keyCode == 38){
        STATES.control.jumpPressed = true;
      }
      if(e.keyCode == 39){
        if (STATES.control.xpos < 1) {
          STATES.control.xpos += 1;
        }
      }
      if(e.keyCode == 32){
        if (STATES.play === false && STATES.end === false) {
          endGame.style.display = 'none';
          STATES.startAnim = true;
        }
      }
      if(e.keyCode == 37){
        if (STATES.control.xpos > -1) {
          STATES.control.xpos -= 1;
        }
      }
    }
  
    function detectCollisionPlayer(object1: any, object2: any){
      object1.geometry.computeBoundingBox();
      object2.geometry.computeBoundingBox();
      object1.updateMatrixWorld();
      object2.updateMatrixWorld();
      
      var box1 = object1.geometry.boundingBox.clone();
      box1.applyMatrix4(object1.matrixWorld);
    
      var box2 = object2.geometry.boundingBox.clone();
      box2.applyMatrix4(object2.matrixWorld);
    
      return box1.intersectsBox(box2);
    }

    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }

    function animate() {
      
      //stats.begin();
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
        // if (enemy.position.z > 5) {
        //   enemy.position.z = -40;
        //   enemy.position.x = getRandomInt(-1, 2) * 2;
        // } else {
        //   enemy.position.z += 0.05 * STATES.speed;
        // }
        enemyManager.moveEnemies(STATES.speed, playerManager.cube, endGame, STATES);

        env.MoveEnv(STATES.speed);
        playerManager.setPlayerPos(playerManager.player, STATES);
  
        // if (detectCollisionPlayer(playerManager.cube, enemyBox)) {
        //   endGame.style.display = 'flex';
        //   endGame.textContent = 'GAME OVER!';
        //   endGame.style.color = 'red';
        //   STATES.play = false;
        //   STATES.end = true;
        // }
        STATES.speed += 0.002 * (STATES.speed ** ( -1 * STATES.speed));
        STATES.score += 0.01;
        domScore.textContent = `${Math.round(STATES.score)}`;
        const delta = clock.getDelta();
        if ( playerManager.mixer ) playerManager.mixer.update( delta );
      }

      //stats.end();

      requestAnimationFrame( animate );


      renderer.render( scene, camera );
    }
    animate();
  }

}
