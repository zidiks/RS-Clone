import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as THREE from 'three';
import * as STATS from 'stats.js';
import {OBJLoader2} from 'three/examples/jsm/loaders/OBJLoader2.js';

interface States {
  control: {
    jumpPressed: boolean,
    jumpCount: number,
    jumpLength: number,
    jumpHeight: number,
    xpos: number
  },
  play: boolean,
  end: boolean,
  startAnim: boolean
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
    console.log(this.elementRef.nativeElement.querySelector('game-scene'));
   }

  ngOnInit(): void {
    const STATES = {
      control: {
        jumpPressed: false,
        jumpCount: 0,
        jumpLength: 50,
        jumpHeight: 0,
        xpos: 0
      },
      speed: 1,
      play: false,
      end: false,
      startAnim: false
    }
    const domScene = <HTMLDivElement>document.getElementById('game-scene');

    const stats = new STATS();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    domScene.appendChild(stats.dom);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // const objLoader = new OBJLoader2();
    // objLoader.load("assets/untitled.obj", (obj) => {
    //   obj.position.y -= 2;
    //   obj.scale.set(0.3, 0.3, 0.3);
    //   obj.castShadow = true;
    //   obj.receiveShadow = true;
    //   scene.add(obj);
    // });

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
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.y -= 1.5;
    cube.position.z += 3;
    scene.add( cube );

    // camera.position.z = 5;
    // camera.position.y = 2;
    // camera.rotation.x -= 0.75;

    camera.position.z = 1;
    camera.position.y = 2;
    camera.position.x = 9;
    camera.rotation.y += 1.5;
    let cameraTarget = new THREE.Vector3().copy(cube.position);
    cameraTarget.y += 1.5;
    camera.lookAt(cameraTarget);

    STATES.control.jumpPressed = false;

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

    function  setPlayerPos(target: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>, states: States) {
      if (target.position.x < ( states.control.xpos * 2 ) && (states.control.xpos * 2) - target.position.x > 0.1) {
        target.position.x += 0.1;
      } else if (target.position.x > ( states.control.xpos * 2 ) && target.position.x - (states.control.xpos * 2) > 0.1) {
        target.position.x -= 0.1;
      } else {
        target.position.x = states.control.xpos * 2;
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
      target.position.y = -1.5 + states.control.jumpHeight;
    
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
          enemy.position.z += 0.2 * STATES.speed;
        }
        setPlayerPos(cube, STATES);
  
        if (detectCollisionPlayer(cube, enemy)) {
          endGame.style.display = 'flex';
          endGame.textContent = 'GAME OVER!';
          endGame.style.color = 'red';
          STATES.play = false;
          STATES.end = true;
        }
        STATES.speed += 0.005;
      }

      stats.end();

      requestAnimationFrame( animate );

      renderer.render( scene, camera );
    }
    animate();
  }

}
