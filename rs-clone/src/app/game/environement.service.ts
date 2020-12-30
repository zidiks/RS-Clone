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

  constructor(
    public Scene: THREE.Scene,
    public Preload: Map<number, THREE.Group> = new Map,
    public Queue: Array<any> = [],
    public inMove: Array<any> = []
  ) {
    for(let i = 0; i < 6; i++) {
      this.GenerateEnv(
        [
          {
            mtl: 'assets/env/rails/rails.vox.mtl',
            obj: 'assets/env/rails/rails.vox.obj',
            pos:[0, -2, -60],
            shadow: true
          },
          {
            mtl: 'assets/env/rails/rails.vox.mtl',
            obj: 'assets/env/rails/rails.vox.obj',
            pos:[-2, -2, -60],
            shadow: true
          },
          {
            mtl: 'assets/env/rails/rails.vox.mtl',
            obj: 'assets/env/rails/rails.vox.obj',
            pos:[2, -2, -60],
            shadow: true
          },
          {
            mtl: 'assets/env/sity_1/sity_1.vox.mtl',
            obj: 'assets/env/sity_1/sity_1.vox.obj',
            pos:[-11, 3, -60],
            shadow: false
          },
          {
            mtl: 'assets/env/sity_1/sity_1.vox.mtl',
            obj: 'assets/env/sity_1/sity_1.vox.obj',
            pos:[11, 3, -60],
            shadow: false
          }
        ],
        i < 1 ? false : true,
        i
      );
    }
  }

  GenerateEnv(grouppObjs: Array<LoadedObj>, starter: boolean, index: number) {
    let mtlLoader = new MTLLoader();
    let scene = this.Scene;
    let preload = this.Preload;
    let queue = this.Queue;
    let inMov = this.inMove;
    // url = "assets/untitled.mtl";
    let group = new THREE.Group;
    grouppObjs.forEach(element => {
      mtlLoader.load( element.mtl, function( materials ) {

        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( element.obj, function ( object ) {

            object.position.set(element.pos[0], element.pos[1], element.pos[2]);
            object.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                if (element.shadow) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
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
        initedNext: index === 1 ? false : true
      });
      group.position.z += 18 * index;
    } else queue.unshift(
      {
        obj: group,
        initedNext: false
      }
    );
  }

  MoveEnv(speed: number) {
    this.inMove.forEach(enemy => {
      if (enemy.obj.position.z >= 80) {
        enemy.obj.position.z = 0;
        enemy.initedNext = false;
        this.Queue.push(this.inMove.shift());
      } else {
        enemy.obj.position.z += 0.05 * speed;
      }
      if ((enemy.obj.position.z) >= 18 && enemy.initedNext === false && this.Queue[0] !== undefined) {
        this.inMove.push(this.Queue.shift());
        enemy.initedNext = true;
      }
    });
  }

}
