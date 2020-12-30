import { Injectable } from '@angular/core';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

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
  }

  GenerateEnv(mtl: string, obj: string, pos: Array<number>, id: number, starter: boolean) {
    let mtlLoader = new MTLLoader();
    let scene = this.Scene;
    let preload = this.Preload;
    let queue = this.Queue;
    let inMov = this.inMove;
    // url = "assets/untitled.mtl";
    mtlLoader.load( mtl, function( materials ) {

        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load( obj, function ( object ) {

            object.position.set(pos[0], pos[1], pos[2]);
            object.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
            });
            scene.add( object );
            if (inMov.length < 1) {
              inMov.push({
                obj: object,
                initedNext: false
              });
            } else if (starter) queue.push(
              {
                obj: object,
                initedNext: false
              }
            );

        }, () => console.log('load...'), () => console.log('err!') );

    })
  }

  MoveEnv(speed: number) {
    this.inMove.forEach(enemy => {
      if (enemy.obj.position.z > 18) {
        enemy.obj.position.z = -60;
        enemy.initedNext = false;
        this.Queue.push(this.inMove.shift());
      } else {
        enemy.obj.position.z += 0.05 * speed;
      }
      if ((enemy.obj.position.z + 0.05 * speed) >= -42 && enemy.initedNext === false && this.Queue[0] !== undefined) {
        this.inMove.push(this.Queue.shift());
        enemy.initedNext = true;
      }
    });
  }

}
