import { state } from '@angular/animations';
import * as THREE from 'three';

interface enemiesProts {
  [key: string]: THREE.Group
}

export class Coin {
  hitBox: THREE.Mesh
  object: THREE.Group = new THREE.Group;
  collision: boolean = false;
  constructor(
    public prototypes: enemiesProts
  ) {
    this.object.name = 'Coin';
    const enemyBox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.3),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );

    this.hitBox = enemyBox;
    enemyBox.position.y = -1.0;
    enemyBox.position.z += 0.05;
    enemyBox.position.z = 0;
    enemyBox.visible = false;
    this.object.add(prototypes['coin'].clone());
    this.object.add(enemyBox);
  }

  detectCollisionPlayer(object1: any){
    let object2: any = this.hitBox;
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

  checkCollisions(player: any, endGame: any, states: any, audioManager: any) {
    if (!this.collision) {
      if (this.detectCollisionPlayer(player)) {
        this.collision = true;
        audioManager.coinPlay();
        states.score += 5;
        this.object.visible = false;
      }
    }
  }
}
