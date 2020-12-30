import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as THREE from 'three';
import * as STATS from 'stats.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Mesh } from 'three';
import { EnvironementService } from './environement.service';
import { PlayerService } from './player.service';

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

    const stats = new STATS();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    domScene.appendChild(stats.dom);

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

    let mixer: THREE.AnimationMixer;
    const loader = new FBXLoader();
    const player = new THREE.Group();
    const playerManager = new PlayerService();

    loader.load( 'assets/player.fbx', function ( object ) {

      mixer = new THREE.AnimationMixer( object );

      const action = mixer.clipAction( object.animations[ 0 ] );
      action.setDuration(STATES.speed ** -1 + 0.1);
      action.play();

      object.traverse( function ( child ) {

        if ( child instanceof Mesh ) {

          child.castShadow = true;
          child.receiveShadow = true;

        }

      } );
      
      object.scale.set(1, 1, 1);
      object.position.y -= 2;
      object.rotation.y += Math.PI;

      //scene.add( object );
      
      player.add(object);

    } );


    const endGame = document.createElement('div');
    endGame.className = 'end-game';
    endGame.style.color = 'green';
    endGame.textContent = 'PRESS SPACE TO START!';
    

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    domScene.appendChild( renderer.domElement );
    domScene.appendChild( endGame );

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 100, 10, 10),
      new THREE.MeshPhongMaterial( { color: 0xffffff } )
    );
    floor.rotation.x = -(Math.PI / 2);
    floor.position.y -= 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.7 );
    light.position.set(5, 9, 3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    const enemy = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 1, 0.3),
      new THREE.MeshPhongMaterial( { color: 0xff0000 } )
    );
    enemy.position.y -= 1.5;
    enemy.position.z = -40;
    enemy.receiveShadow = true;
    enemy.castShadow = true;
    scene.add(enemy);

    const geometry = new THREE.BoxGeometry();
    const matherial = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, matherial );
    cube.material.transparent = true;
    cube.visible = false;
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.y -= 1.5;
    
    player.add( cube );
    player.position.z += 3;
    player.position.y += 0.1;
    scene.add(player);

    for(let i = 0; i < 6; i++) {
      env.GenerateEnv(
        'assets/env/rails/rails.vox.mtl',
        'assets/env/rails/rails.vox.obj',
        [0, -2, -60],
        i,
        true
      );
    }

    camera.position.z = 1;
    camera.position.y = 2;
    camera.position.x = 9;
    camera.rotation.y += 1.5;
    let cameraTarget = new THREE.Vector3().copy(cube.position);
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
          console.log(camera.position);
        }
      }
     
      if (STATES.play) {
        if (enemy.position.z > 5) {
          enemy.position.z = -40;
          enemy.position.x = getRandomInt(-1, 2) * 2;
        } else {
          enemy.position.z += 0.05 * STATES.speed;
        }

        env.MoveEnv(STATES.speed);
        playerManager.setPlayerPos(player, STATES);
  
        if (detectCollisionPlayer(cube, enemy)) {
          endGame.style.display = 'flex';
          endGame.textContent = 'GAME OVER!';
          endGame.style.color = 'red';
          STATES.play = false;
          STATES.end = true;
        }
        STATES.speed += 0.001 * (STATES.speed ** ( -1 * STATES.speed));
        STATES.score += 0.01;
        domScore.textContent = `${Math.round(STATES.score)}`;
        const delta = clock.getDelta();
        if ( mixer ) mixer.update( delta );
      }

      stats.end();

      requestAnimationFrame( animate );


      renderer.render( scene, camera );
    }
    animate();
  }

}
