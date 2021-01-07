import * as THREE from 'three';

interface enemiesProts {
  [key: string]: THREE.Group
}

export class TrainEnemy {
  hitBox: THREE.Mesh
  object: THREE.Group = new THREE.Group;
  constructor(
    public prototypes: enemiesProts
  ) {
    const enemyBox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 4, 9.9),
      new THREE.MeshPhongMaterial( { color: 0xff0ff0 } )
    );
    const train =  prototypes['train'].clone();
    this.object.add(train);
    train.position.z += 2.5;
    train.position.y = 0;
    this.hitBox = enemyBox;
    enemyBox.position.y = -1;
    enemyBox.position.z += 2.5;
    enemyBox.visible = false;
    //this.object.add(prototypes['board'].clone());
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

  checkCollisions(player: any, endGame: any, states: any) {
    if (this.detectCollisionPlayer(player)) {
      endGame.style.display = 'flex';
      endGame.textContent = 'GAME OVER!';
      endGame.style.color = 'red';
      states.play = false;
      states.end = true;
    }
  }
}