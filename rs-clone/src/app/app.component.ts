import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as STATS from 'stats.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'rs-clone';

  ngOnInit() {
    const stats = new STATS();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    let leftPressed = false;
	  let rightPressed = false;
    let jumpPressed = false;
    let jumpCount = 0;
    let jumpLength = 50;
    let jumpHeight = 0;
    let xpos = 0;
    let play = true;

    const endGame = document.createElement('div');
    endGame.className = 'end-game';
    endGame.textContent = 'GAME OVER!';
    

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    document.body.appendChild( renderer.domElement );
    document.body.appendChild( endGame );

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
    enemy.position.z = -15;
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

    camera.position.z = 5;
    camera.position.y = 2;
    camera.rotation.x -= 0.75;

    document.addEventListener("keydown", keyRightHandler, false);

    function keyRightHandler(e: { keyCode: number; }){
      if(e.keyCode == 38){
        jumpPressed = true;
      }
      if(e.keyCode == 39){
        if (xpos < 1) {
          xpos += 1;
        }
      }
      if(e.keyCode == 37){
        if (xpos > -1) {
          xpos -= 1;
        }
      }
    }
  
    function detectCollisionCubes(object1: any, object2: any){
      object1.geometry.computeBoundingBox(); //not needed if its already calculated
      object2.geometry.computeBoundingBox();
      object1.updateMatrixWorld();
      object2.updateMatrixWorld();
      
      var box1 = object1.geometry.boundingBox.clone();
      box1.applyMatrix4(object1.matrixWorld);
    
      var box2 = object2.geometry.boundingBox.clone();
      box2.applyMatrix4(object2.matrixWorld);
    
      return box1.intersectsBox(box2);
    }

    function animate() {
      stats.begin();
     
      if (play) {
        if (enemy.position.z > 5) {
          enemy.position.z = -40;
        } else {
          enemy.position.z += 0.2;
        }
  
        if (cube.position.x < ( xpos * 2 ) && (xpos * 2) - cube.position.x > 0.1) {
          cube.position.x += 0.1;
        } else if (cube.position.x > ( xpos * 2 ) && cube.position.x - (xpos * 2) > 0.1) {
          cube.position.x -= 0.1;
        } else {
          cube.position.x = xpos * 2;
        }
        if(jumpPressed){
          jumpCount++;
          jumpHeight = 0.05*jumpLength*Math.sin(Math.PI*jumpCount/jumpLength);
        }
        if(jumpCount>jumpLength){
          jumpCount=0;
          jumpPressed=false;
          jumpHeight=0;
        }
        cube.position.y = -1.5 + jumpHeight;
  
        if (detectCollisionCubes(cube, enemy)) {
          endGame.style.display = 'flex';
          play = false;
        }
      }

      stats.end();

      requestAnimationFrame( animate );

      renderer.render( scene, camera );
    }
    animate();
  }
}
