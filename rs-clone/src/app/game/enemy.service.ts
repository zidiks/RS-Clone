import { Injectable } from '@angular/core';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { BoardLowEnemy } from './enemies/board-low';

interface EnemiesLine {
  line: THREE.Group,
  enemies: Array<object | undefined>,
  initedNext: Boolean
}

interface enemiesProts {
  [key: string]: THREE.Group
}

interface Prototype {
  enemy: THREE.Group | undefined,
  hitBox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> | undefined
}

interface LoadedObjEnemy {
  type: string,
  mtl: string,
  obj: string,
  posY: number,
  shadow: boolean,
  size: number,
  boxSize: Array<number>,
  hitBoxVisible: boolean
}

@Injectable({
  providedIn: 'root'
})
export class EnemyService {
  wayMap: Array<Array<Boolean>> = [];
  lastPos: number | undefined;
  enemiesProts:  enemiesProts = {};

  constructor(
    public Scene: THREE.Scene,
    public Queue: Array<any> = [],
    public inMove: Array<any> = []
  ) {
    this.makePrototypes(
      [
        {
        type: 'board',
        mtl: 'assets/enemy/1/1.vox.mtl',
        obj: 'assets/enemy/1/1.vox.obj',
        posY: -0.65,
        shadow: true,
        size: 1,
        boxSize: [1.6, 1.6, 0.1],
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
    let promise = new Promise((resolve, reject) => {
      arr.forEach((el, index) => {
          const  enemy = new THREE.Group();
          const enemyBox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 1.6, 0.1),
            new THREE.MeshPhongMaterial( { color: 0xff0000 } )
          );
          enemyBox.position.y = -1.2;
          enemyBox.position.z += 0.05;
          enemyBox.position.z = 0;
          enemyBox.visible = el.hitBoxVisible;
          const mtlLoader = new MTLLoader();
          mtlLoader.load( el.mtl, ( materials ) => {
    
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load( el.obj,  ( object ) => {
    
                //object.position.set(element.pos[0], element.pos[1], element.pos[2]);
                object.traverse((child) => {
                  if (child instanceof THREE.Mesh) {
                      if (el.shadow) child.castShadow = true;
                      child.receiveShadow = true;
                  }
                  object.position.y = -2;
                  object.position.z = 0;
                  enemy.add(object);
                  enemy.add(enemyBox);
                  // //clone
                  // const clone = new THREE.Group();
                  // clone.add(enemy.clone());
                  // clone.position.z -= 10;
                  // this.Scene.add(clone);
                });
                if (index === arr.length-1) {
                  this.enemiesProts[el.type] = enemy;
                  resolve('YEEEAP!');
                } else {
                  this.enemiesProts[el.type] = enemy;
                }
            }, () => console.log('load...'), () => reject());
          });
      });
    });
    promise.then((e) => {
      this.generateStartWay(10);
      // console.log(this.enemiesProts);
      // const newEn = new BoardLowEnemy(this.enemiesProts);
      // this.Scene.add(newEn.object);
      // newEn.checkCollisions();
    })
    .catch(e => {
      throw new Error(e);
    })
  }

  generateStartWay(mapLenght: number) {
    const Scene = this.Scene;
    for(let i = 0; i < 5; i++) {
      this.wayMap.push([true, true, true]);
    }
    for(let i = 0; i <= mapLenght - 5; i++) {
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
        enemies: [],
        initedNext: false
      }
      el.forEach((item, index) => {
        if (item === false) {
          const newEnemy = new BoardLowEnemy(this.enemiesProts);
          enemiesLine.enemies.push(newEnemy);
          enemiesLine.line.add(newEnemy.object);
          enemiesLine.line.position.x = (index - 1) * 2;
        }
      });
      //enemiesLine.line.position.y -= 0.8;
      if (bindex < 8) enemiesLine.initedNext = true;
      if (bindex < 10) {
        this.inMove.push(enemiesLine);
        enemiesLine.line.position.z -= bindex * 5;
        this.Scene.add(enemiesLine.line);
      } else {
        this.Queue.push(enemiesLine);
        enemiesLine.line.position.z = -40;
        this.Scene.add(enemiesLine.line);
      }
    });

    console.log('inMovie: ', this.inMove);
    const domLoading = <HTMLDivElement>document.getElementById('game-loading');
    setTimeout(() => {
      domLoading.style.display = 'none';
    }, 1000);
  }

  generateNewWay(line: EnemiesLine) {
    let addPos: Array<number | undefined> = [];
    let wayLine: Array<Boolean> = [];
    let wayPos: number = this.getRandomInt(0, 3);
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
    //this.wayMap.push(wayLine);
    this.lastPos = wayPos;

    const enemiesLine = line;
    wayLine.forEach((item, index) => {
      if (item === false) {
        const newEnemy = new BoardLowEnemy(this.enemiesProts);
        enemiesLine.enemies.push(newEnemy);
        enemiesLine.line.add(newEnemy.object);
        enemiesLine.line.position.x = (index - 1) * 2;
      }
    });
    enemiesLine.line.position.z = -40;
    this.Queue.push(enemiesLine);
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
    for (let ind = this.inMove.length-1; ind >= 0; ind--) {
      let el = this.inMove[ind];
      el.enemies.forEach((element: any) => {
        if (el.line.position.z > -1) element.checkCollisions(playerCube, endGame, states);
        });
        if (el.line.position.z > 10) {
          let obj = this.inMove[0];
          obj.line.clear();
          obj.line.position.z = -40;
          obj.hitBoxes = [];
          obj.initedNext = false;
          this.generateNewWay(this.inMove.shift());
        } else {
          el.line.position.z += 0.05 * speed;
        }
        if ((el.line.position.z) > -40 && el.initedNext === false && this.Queue[0] !== undefined) {
          this.inMove.push(this.Queue.shift());
          el.initedNext = true;
        }
    }
  }
}
