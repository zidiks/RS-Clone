import { Injectable } from '@angular/core';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

interface Enemy {
  enemy: THREE.Group,
  box: Array<THREE.Mesh>
}

@Injectable({
  providedIn: 'root'
})
export class EnemyService {
  wayMap: Array<Array<Boolean>> = [];
  wayEnemies: Array<any> = [];

  constructor(
    public Scene: THREE.Scene
  ) {
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }

  generateWay(mapLenght: number = 2) {
    const Scene = this.Scene;
    let lastPos: number | undefined;
    for(let i = 0; i < 5; i++) {
      this.wayMap.push([true, true, true]);
    }
    for(let i = 0; i <= mapLenght; i++) {
      let wayPos: number;
      let addPos: Array<number | undefined> = [];
      let wayLine: Array<Boolean> = [];
      wayPos = this.getRandomInt(0, 3);
      if (i > 0 && lastPos !== wayPos) {
        addPos.push(lastPos);
        if (lastPos !== undefined && Math.abs(lastPos - wayPos) > 1) {
          for(let y = 0; y < 3; y++) {
            if (y !== lastPos && y !== wayPos) addPos.push(y);
          }
        }
      }
      for (let x = 0; x < 3; x++) {
        wayLine.push(x === wayPos ? true : x === addPos[0] ? true : x === addPos[1] ? true : false);
      }
      this.wayMap.push(wayLine);
      lastPos = wayPos;
    }


    this.wayMap.forEach((el, bindex) => {
      const enemy = new THREE.Group;
      const enemyBoxes: Enemy = {
        enemy: enemy,
        box: []
      }
      el.forEach((item, index) => {
        if (item === false) {
          const mtlLoader = new MTLLoader;
          const enemyBox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 1.5, 0.2),
            new THREE.MeshPhongMaterial( { color: 0xff0000 } )
          );
          enemyBox.position.y -= 0.4
          enemyBox.position.x = (index - 1) * 2;
          enemyBox.visible = false;
          mtlLoader.load( 'assets/enemy/1/1.vox.mtl', ( materials ) => {

            materials.preload();

            var objLoader = new OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( 'assets/enemy/1/1.vox.obj',  ( en ) => {

                //object.position.set(element.pos[0], element.pos[1], element.pos[2]);
                en.traverse(function(child) {
                  if (child instanceof THREE.Mesh) {
                      child.castShadow = true;
                      child.receiveShadow = true;
                }
                en.position.y -= 0.65;
                en.position.x = (index - 1) * 2;
                enemy.add(en);
                enemy.add(enemyBox);
                });
            }, () => console.log('load...'), () => console.log('err!') );
          });
          enemyBoxes.box.push(enemyBox);
        }
      });
      enemy.position.y -= 0.8;
      enemy.position.z -= bindex * 5;
      Scene.add(enemy);
      this.wayEnemies.push(enemyBoxes);
    });
  }

  detectCollisionPlayer(object1: any, object2: any){
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

  moveEnemies(speed:number, playerCube:any, endGame: any, states: any) {
    this.wayEnemies.forEach(el => {
      el.box.forEach((element: any) => {
        if (this.detectCollisionPlayer(playerCube, element) && el.enemy.position.z > 0) {
          endGame.style.display = 'flex';
          endGame.textContent = 'GAME OVER!';
          endGame.style.color = 'red';
          states.play = false;
          states.end = true;
        }
      });
      if (el.enemy.position.z > 5) {
          el.enemy.position.z = -40;
        } else {
          el.enemy.position.z += 0.05 * speed;
        }
    })
  }
}
