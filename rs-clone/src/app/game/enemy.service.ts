import { Injectable } from '@angular/core';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { Object3D } from 'three';

interface EnemiesLine {
  line: THREE.Group,
  prots: Array<Prototype | undefined>,
  initedNext: Boolean
}

interface Prototype {
  enemy: THREE.Group | undefined,
  hitBox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> | undefined
}

interface LoadedObjEnemy {
  mtl: string,
  obj: string,
  posY: number,
  shadow: boolean,
  type: number,
  size: number,
  boxSize: Array<number>,
  count: number,
  hitBoxVisible: boolean
}

@Injectable({
  providedIn: 'root'
})
export class EnemyService {
  wayMap: Array<Array<Boolean>> = [];
  lastPos: number | undefined;
  enemiesProts:  Array<Array<Prototype>> = [];

  constructor(
    public Scene: THREE.Scene,
    public Queue: Array<any> = [],
    public inMove: Array<any> = []
  ) {
    this.makePrototypes(
      [
        {
        mtl: 'assets/enemy/1/1.vox.mtl',
        obj: 'assets/enemy/1/1.vox.obj',
        posY: -0.65,
        shadow: true,
        type: 0,
        size: 1,
        boxSize: [1.6, 1.6, 0.1],
        count: 20,
        hitBoxVisible: false
        }
      ]
    )
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }

  makePrototypes(arr:Array<LoadedObjEnemy>) {
    
    arr.forEach(el => {
      const arr: Array<Prototype> = [];
      for(let i = 0; i < el.count; i++) {
        const enemyGr: Prototype = {
          enemy: undefined,
          hitBox: undefined

        };
        const  enemy = new THREE.Group;
        const enemyBox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> = new THREE.Mesh(
          new THREE.BoxGeometry(...el.boxSize),
          new THREE.MeshPhongMaterial( { color: 0xff0000 } )
        );
        enemyBox.position.y = -1.2;
        enemyBox.position.z += 0.05;
        enemyBox.position.z = -40;
        enemyBox.visible = el.hitBoxVisible;
        const mtlLoader = new MTLLoader();
        mtlLoader.load( el.mtl, ( materials ) => {
  
          materials.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials( materials );
          objLoader.load( el.obj,  ( en ) => {
  
              //object.position.set(element.pos[0], element.pos[1], element.pos[2]);
              en.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (el.shadow) child.castShadow = true;
                    child.receiveShadow = true;
              }
              en.position.y = -2;
              en.position.z = -40;
              enemy.add(en);
              enemy.add(enemyBox);
              enemyGr.enemy = enemy;
              enemyGr.hitBox = enemyBox;
              });
          }, () => console.log('load...'), () => console.log('err!') );
          this.Scene.add(enemy);
          arr.push(enemyGr);
        });
      }
      this.enemiesProts.push(arr);
    });
    setTimeout(() => {
      console.log(this.enemiesProts[0][0]);
      this.generateStartWay(6);
    }, 2000);
  }

  generateStartWay(mapLenght: number = 2) {
    const Scene = this.Scene;
    for(let i = 0; i < 5; i++) {
      this.wayMap.push([true, true, true]);
    }
    for(let i = 0; i <= mapLenght; i++) {
      let wayPos: number;
      let addPos: Array<number | undefined> = [];
      let wayLine: Array<Boolean> = [];
      wayPos = this.getRandomInt(0, 3);
      if (i > 0 && this.lastPos !== wayPos) {
        addPos.push(this.lastPos);
        if (this.lastPos !== undefined && Math.abs(this.lastPos - wayPos) > 1) {
          for(let y = 0; y < 3; y++) {
            if (y !== this.lastPos && y !== wayPos) addPos.push(y);
          }
        }
      }
      for (let x = 0; x < 3; x++) {
        wayLine.push(x === wayPos ? true : x === addPos[0] ? true : x === addPos[1] ? true : false);
      }
      this.wayMap.push(wayLine);
      this.lastPos = wayPos;
    }
    console.log('wayMap: ', this.wayMap);


    this.wayMap.forEach((el, bindex) => {
      const enemiesLine: EnemiesLine = {
        line: new THREE.Group,
        prots: [],
        initedNext: false
      }
      el.forEach((item, index) => {
        if (item === false) {
          enemiesLine.prots.unshift(this.enemiesProts[0].shift());
          if (enemiesLine.prots[0] && enemiesLine.prots[0].enemy) enemiesLine.line.add(enemiesLine.prots[0].enemy);
          enemiesLine.line.position.x = (index - 1) * 2;
          this.Scene.add(enemiesLine.line);
        }
      });
      //enemiesLine.line.position.y -= 0.8;
      if (bindex < 8) enemiesLine.initedNext = true;
      if (bindex < 10) {
        this.inMove.push(enemiesLine);
        enemiesLine.line.position.z = 40 - (bindex * 5);
      } else {
        this.Queue.push(enemiesLine);
        enemiesLine.line.position.z = 0;
      }
    });

    console.log('inMovie', this.inMove);
  }

  generateNewWay() {
    //const Scene = this.Scene;
      let wayPos: number;
      let addPos: Array<number | undefined> = [];
      let wayLine: Array<Boolean> = [];
      wayPos = this.getRandomInt(0, 3);
      if (this.lastPos !== wayPos) {
        addPos.push(this.lastPos);
        if (this.lastPos !== undefined && Math.abs(this.lastPos - wayPos) > 1) {
          for(let y = 0; y < 3; y++) {
            if (y !== this.lastPos && y !== wayPos) addPos.push(y);
          }
        }
      }
      for (let x = 0; x < 3; x++) {
        wayLine.push(x === wayPos ? true : x === addPos[0] ? true : x === addPos[1] ? true : false);
      }
      this.wayMap.push(wayLine);
      this.lastPos = wayPos;
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
    this.inMove.forEach(el => {
      el.prots.forEach((element: any) => {
        if (this.detectCollisionPlayer(playerCube, element.hitBox) && el.line.position.z > 40) {
          endGame.style.display = 'flex';
          endGame.textContent = 'GAME OVER!';
          endGame.style.color = 'red';
          states.play = false;
          states.end = true;
        }
      });
      if (el.line.position.z > 45) {
          el.line.position.z = 0;

        } else {
          el.line.position.z += 0.05 * speed;
        }
    })
  }
}
