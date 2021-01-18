import { Injectable } from '@angular/core';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

interface LoadedObj {
  mtl: string,
  obj: string,
  pos: Array<number>,
  shadow: boolean
}

@Injectable({
  providedIn: 'root'
})
export class EnvironementService {
  ENV_LENGHT:number = 20;

  constructor(
    public Scene: THREE.Scene,
    public Preload: Map<number, THREE.Group> = new Map,
    public Queue: Array<any> = [],
    public inMove: Array<any> = []
  ) {
    for(let i = 0; i < this.ENV_LENGHT; i++) {
      let id = this.getRandomInt(1, 4);
      this.GenerateEnv(
        [
          {
            mtl: 'assets/env/rails/rails.vox.mtl',
            obj: 'assets/env/rails/rails.vox.obj',
            pos:[0, -2, -60],
            shadow: false
          },
          {
            mtl: 'assets/env/rails/rails.vox.mtl',
            obj: 'assets/env/rails/rails.vox.obj',
            pos:[-2, -2, -60],
            shadow: false
          },
          {
            mtl: 'assets/env/rails/rails.vox.mtl',
            obj: 'assets/env/rails/rails.vox.obj',
            pos:[2, -2, -60],
            shadow: false
          },
          {
            mtl: `assets/env/sity_${id}/sity_${id}.vox.mtl`,
            obj: `assets/env/sity_${id}/sity_${id}.vox.obj`,
            pos:[-11, -2.1, -60],
            shadow: true
          },
          {
            mtl: `assets/env/sity_${id}/sity_${id}.vox.mtl`,
            obj: `assets/env/sity_${id}/sity_${id}.vox.obj`,
            pos:[11, -2.1, -60],
            shadow: true
          }
        ],
        i < (this.ENV_LENGHT - 5) ? false : true,
        i
      );
    }

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 100, 10, 10),
      new THREE.MeshPhongMaterial( { color: 0xFFE89F } )
    );
    floor.rotation.x = -(Math.PI / 2);
    floor.position.y -= 2;
    floor.receiveShadow = true;
    Scene.add(floor);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }

  GenerateEnv(grouppObjs: Array<LoadedObj>, starter: boolean, index: number) {
    let mtlLoader = new MTLLoader();
    let scene = this.Scene;
    //let preload = this.Preload;
    let queue = this.Queue;
    let inMov = this.inMove;
    // url = "assets/untitled.mtl";
    let group = new THREE.Group;
    grouppObjs.forEach(element => {
      mtlLoader.load( element.mtl, function( materials ) {

        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( element.obj, function ( object ) {

            object.position.set(element.pos[0], element.pos[1], element.pos[2]);
            object.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                if (element.shadow) {
                  child.castShadow = true;
                }
                child.receiveShadow = true;
            }
            });
            group.add(object);
        }, () => console.log('load...'), () => console.log('err!') );
      });
    });
    scene.add( group );

    if (starter) {
      inMov.unshift({
        obj: group,
        initedNext: index === (this.ENV_LENGHT - 5) ? false : true
      });
      group.position.z += 18 * (index - Math.abs(6 - this.ENV_LENGHT));
    } else queue.unshift(
      {
        obj: group,
        initedNext: false
      }
    );
  }

  MoveEnv(speed: number, delta: any) {
    this.inMove.forEach(enemy => {
      if (enemy.obj.position.z >= 80) {
        enemy.obj.position.z = 0;
        enemy.initedNext = false;
        this.Queue.push(this.inMove.shift());
      } else {
        enemy.obj.position.z += 0.05 * speed * delta;
      }
      if ((enemy.obj.position.z) >= 18 && enemy.initedNext === false && this.Queue[0] !== undefined) {
        //this.inMove.push(this.Queue.shift());
        this.inMove.push(this.Queue.splice(this.getRandomInt(1, this.Queue.length), 1)[0]);
        enemy.initedNext = true;
      }
    });
  }

}
