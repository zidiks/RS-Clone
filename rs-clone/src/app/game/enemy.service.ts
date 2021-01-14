import { Injectable } from '@angular/core';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { BoardLowEnemy } from './enemies/board-low';
import { BoardHiEnemy } from './enemies/board-hi';
import { Coin } from './enemies/coin';
import { TrainEnemy } from './enemies/train';

interface EnemiesLine {
  line: THREE.Group,
  enemies: Array<object | undefined>,
  initedNext: Boolean
}

interface enemiesProts {
  [key: string]: THREE.Group
}

interface trainRoute {
  lenght: number,
  allLength: number,
  lastSegment: number | undefined
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
  wayMap: Array<Array<string>> = [];
  lastPos: number | undefined;
  enemiesProts:  enemiesProts = {};
  trainMap: Array<trainRoute> = [
    {
      lenght: 0,
      allLength: 0,
      lastSegment: undefined
    },
    {
      lenght: 0,
      allLength: 0,
      lastSegment: undefined
    },
    {
      lenght: 0,
      allLength: 0,
      lastSegment: undefined
    }
  ];
  lastWayLine: Array<string> = [];

  constructor(
    public Scene: THREE.Scene,
    public Queue: Array<any> = [],
    public inMove: Array<any> = []
  ) {
    this.makePrototypes(
      [
        {
        type: 'board',
        mtl: 'assets/enemy/1/lowboard-1.mtl',
        obj: 'assets/enemy/1/lowboard-1.obj',
        posY: -1.65,
        shadow: true,
        size: 1,
        boxSize: [1.6, 1.5, 0.1],
        hitBoxVisible: false
        },
        {
        type: 'boardHi',
        mtl: 'assets/enemy/1/hiboard.mtl',
        obj: 'assets/enemy/1/hiboard.obj',
        posY: -0.65,
        shadow: true,
        size: 1,
        boxSize: [1.6, 2.6, 0.1],
        hitBoxVisible: false
        },
        {
        type: 'coin',
        mtl: 'assets/enemy/1/coin.mtl',
        obj: 'assets/enemy/1/coin.obj',
        posY: -0.65,
        shadow: false,
        size: 1,
        boxSize: [1.6, 2.6, 0.1],
        hitBoxVisible: false
        },
        {
        type: 'train',
        mtl: 'assets/enemy/train/train.vox.mtl',
        obj: 'assets/enemy/train/train.vox.obj',
        posY: -0.65,
        shadow: true,
        size: 2,
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
                      if (el.type === 'coin') {
                        child.material.emissive.set('yellow');
                        child.material.emissiveIntensity = 0.7;
                      }
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
      console.log(this.enemiesProts);
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
      this.wayMap.push(['O', 'O', 'O']);
    }
    for(let i = 0; i <= mapLenght - 5; i++) {
      let wayPos: number;
      let addPos: Array<number | undefined> = [];
      let wayLine: Array<string> = [];
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
        wayLine.push(x === wayPos ? 'O' : x === addPos[0] ? 'O' : x === addPos[1] ? 'O' : 'B');
      }
      this.wayMap.push(wayLine);
      this.lastPos = wayPos;
    }

    this.wayMap.forEach((el, bindex) => {
      const enemiesLine: EnemiesLine = {
        line: new THREE.Group,
        enemies: [],
        initedNext: false
      }
      el.forEach((item, index) => {
        if (item === 'B') {
          const newEnemy = new BoardLowEnemy(this.enemiesProts);
          enemiesLine.enemies.push(newEnemy);
          enemiesLine.line.add(newEnemy.object);
          newEnemy.object.position.x = (index - 1) * 2;
        }
      });
      //enemiesLine.line.position.y -= 0.8;
      if (bindex < 9) enemiesLine.initedNext = true;
      if (bindex < 10) {
        this.inMove.push(enemiesLine);
        enemiesLine.line.position.z -= bindex * 6;
        this.Scene.add(enemiesLine.line);
      } else {
        this.Queue.push(enemiesLine);
        enemiesLine.line.position.z = -40;
        this.Scene.add(enemiesLine.line);
      }
    });

    const domLoading = <HTMLDivElement>document.getElementById('game-loading');
    setTimeout(() => {
      domLoading.style.display = 'none';
    }, 1000);
  }

  generateNewWay(line: EnemiesLine) {
    let addPos: Array<number | undefined> = [];
    let wayLine: Array<string> = [];
    let wayPos: number = 1;
    if (this.trainMap[1].lenght > 0 && this.lastPos !== 1) {
      if (this.lastPos) wayPos = this.lastPos;
    } else {
      wayPos = this.getRandomInt(0, 3);
      if (this.trainMap[wayPos].lenght > 0) {
        if (wayPos === 0) wayPos += this.getRandomInt(1, 3);
        else if (wayPos === 2) wayPos -= this.getRandomInt(1, 3);
        else {
          if (this.getRandomInt(0, 2) === 0) wayPos -= 1; else wayPos += 1;
        }
      }
    }
    if (this.lastPos !== wayPos) {
      addPos.push(this.lastPos);
      if (this.lastPos !== undefined && Math.abs(this.lastPos - wayPos) > 1) {
        for(let y = 0; y < 3; y++) {
          if (y !== this.lastPos && y !== wayPos) addPos.push(y);
        }
      }
    }
    for (let x = 0; x < 3; x++) {
      let activeTrainRoutes = 0;
      for (let i = 0; i < 3; i++) {
        if (this.trainMap[i].lenght > 0) activeTrainRoutes++;
      };
      if (this.trainMap[x].lenght > 0) {
        if (this.trainMap[x].lastSegment === 1) {
          wayLine.push('TB');
          this.trainMap[x].lastSegment = 2;
          this.trainMap[x].lenght -= 1;
        }
        else if (this.trainMap[x].lastSegment === 2) {
          wayLine.push('TE');
          this.trainMap[x].lastSegment = 3;
          this.trainMap[x].lenght -= 1;
          if (this.trainMap[x].lenght === 0) this.trainMap[x].lastSegment = undefined;
        }
        else if (this.trainMap[x].lastSegment === 3)  {
          wayLine.push('TH');
          this.trainMap[x].lastSegment = 1;
          this.trainMap[x].lenght -= 1;
        }
      } else {
        let square = x === wayPos ? 'O' : x === addPos[0] ? 'O' : x === addPos[1] ? 'O' : 'B';
        if (square === 'B'
          && this.getRandomInt(0, 2) === 0
          && this.lastPos !== x
          && activeTrainRoutes < 2
          && this.trainMap[x].lenght === 0
          && this.trainMap[x].lastSegment === undefined
          && !this.lastWayLine.includes('TE')) {
          square = 'TH';
          this.trainMap[x].lenght = (3 * this.getRandomInt(1, 5)) - 1;
          this.trainMap[x].allLength =  this.trainMap[x].lenght;
          this.trainMap[x].lastSegment = 1;
        }
        wayLine.push(square);
      }
    }


    //this.wayMap.push(wayLine);
    this.lastPos = wayPos;

    this.wayMap.push(wayLine);

    const enemiesLine = line;
    wayLine.forEach((item, index) => {
      switch (item) {
        case 'TH':
          const newEnemy = new TrainEnemy(this.enemiesProts);
          if (this.trainMap[index].allLength > this.trainMap[index].lenght) newEnemy.object.position.z += 8;
          enemiesLine.enemies.push(newEnemy);
          enemiesLine.line.add(newEnemy.object);
          newEnemy.object.position.x = (index - 1) * 2;
          break;
        case 'B':

          break;
        case 'O':
          let rand = this.getRandomInt(0, 4);
          if (rand === 0) {
            const newEnemy = new BoardLowEnemy(this.enemiesProts);
            enemiesLine.enemies.push(newEnemy);
            enemiesLine.line.add(newEnemy.object);
            newEnemy.object.position.x = (index - 1) * 2;
          } else if (rand === 1) {
            const newEnemy = new BoardHiEnemy(this.enemiesProts);
            enemiesLine.enemies.push(newEnemy);
            enemiesLine.line.add(newEnemy.object);
            newEnemy.object.position.x = (index - 1) * 2;
          } else if (rand === 2) {
            const newCoin = new Coin(this.enemiesProts);
            enemiesLine.enemies.push(newCoin);
            enemiesLine.line.add(newCoin.object);
            newCoin.object.position.x = (index - 1) * 2;
          }
          break;
        default:
          break;
      }


      // if (item === 'TB' || item === 'TE') {

      // } else if (item === 'TH' ) {
      //   const newEnemy = new TrainEnemy(this.enemiesProts);
      //   if (this.trainMap[index].allLength > this.trainMap[index].lenght) newEnemy.object.position.z += 6;
      //   enemiesLine.enemies.push(newEnemy);
      //   enemiesLine.line.add(newEnemy.object);
      //   enemiesLine.line.position.x = (index - 1) * 2;
      // } else if (item === 'B') {
      //   // false board
      //   // const newCoin = new Coin(this.enemiesProts);
      //   // enemiesLine.enemies.push(newCoin);
      //   // enemiesLine.line.add(newCoin.object);
      //   // enemiesLine.line.position.x = (index - 1) * 2;

      // } else if (item === 'O') {
      //   let rand = this.getRandomInt(0, 2);
      //   if (rand === 0) {
      //     const newEnemy = new BoardLowEnemy(this.enemiesProts);
      //     enemiesLine.enemies.push(newEnemy);
      //     enemiesLine.line.add(newEnemy.object);
      //     enemiesLine.line.position.x = (index - 1) * 2;
      //   } else if (rand === 1) {
      //     const newEnemy = new BoardHiEnemy(this.enemiesProts);
      //     enemiesLine.enemies.push(newEnemy);
      //     enemiesLine.line.add(newEnemy.object);
      //     enemiesLine.line.position.x = (index - 1) * 2;
      //   }
      // }
    });
    this.lastWayLine = wayLine;
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

  moveEnemies(speed:number, playerCube:any, endGame: any, STATES: any) {
    for (let ind = this.inMove.length-1; ind >= 0; ind--) {
      let el = this.inMove[ind];
      el.enemies.forEach((element: any) => {
        if (element.object.name === 'Coin') element.object.rotation.y += 0.04;
        if (el.line.position.z > -6) element.checkCollisions(playerCube, endGame, STATES);
        });
        if (el.line.position.z > 25) {
          let obj = this.inMove[ind];
          obj.line.clear();
          obj.line.position.z = -40;
          obj.hitBoxes = [];
          obj.initedNext = false;
          obj.enemies = [];
          this.generateNewWay(this.inMove.shift());
        } else {
          el.line.position.z += 0.05 * speed;
        }
        if ((el.line.position.z) > -34 && el.initedNext === false && this.Queue[0] !== undefined) {
          el.initedNext = true;
          this.inMove.push(this.Queue.shift());
        }
    }
  }
}
