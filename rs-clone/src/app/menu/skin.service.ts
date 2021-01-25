import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Mesh } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

interface mix {
  [key:string]: THREE.AnimationMixer
}

@Injectable({
  providedIn: 'root'
})
export class SkinService {
  skinTarget: any;
  mixerTarget: any;
  playerAction: any;
  constructor() { }

  setSkinTarget(target: THREE.Group, mixer: mix | undefined) {
    this.skinTarget = target;
    this.mixerTarget = mixer;
    this.skinTarget.clear();
  }

  showSkin(path: string) {
   if (this.skinTarget) {
    const loader = new FBXLoader();
    loader.load( path, ( object ) => {
      this.mixerTarget.target = new THREE.AnimationMixer( object );
      this.playerAction = this.mixerTarget.target.clipAction( object.animations[ 0 ] );
      this.playerAction.play();

      object.traverse( function ( child ) {
        if ( child instanceof Mesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      object.scale.set(0.25, 0.25, 0.25);
      object.position.y -= 1.1;
      object.position.z = -3;
      this.skinTarget.clear();
      this.skinTarget.add(object);
    } );
   }
  }
}
