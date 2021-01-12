import * as THREE from 'three';

interface enemiesProts {
  [key: string]: THREE.Group
}

export class TrainEnemy {
  hitBox: THREE.Mesh;
  hitBox2: THREE.Mesh;
  hitBox3: THREE.Mesh;
  headlight1: THREE.Mesh;
  headlight2: THREE.Mesh;
  object: THREE.Group = new THREE.Group;
  constructor(
    public prototypes: enemiesProts
  ) {
    this.object.name = 'Train';
    this.hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 4, 9.9),
      new THREE.MeshPhongMaterial( { color: 0xff0ff0 } )
    );
    this.hitBox2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 4, 9.9),
      new THREE.MeshPhongMaterial( { color: 0xFFFF00 } )
    );
    this.hitBox3 = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 4, 9.9),
      new THREE.MeshPhongMaterial( { color: 0xFFFF00 } )
    );
    this.headlight1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.2, 0.3),
      new THREE.MeshPhongMaterial( { color: 0xFFFF00, emissive: 0xFFFF00, emissiveIntensity: 1 } )
    );
    this.headlight2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.2, 0.3),
      new THREE.MeshPhongMaterial( { color: 0xFFFF00, emissive: 0xFFFF00, emissiveIntensity: 1 } )
    );
    const train = prototypes['train'].clone();
    this.object.add(train);
    const fixZ = -6;
    train.position.z = fixZ;
    train.position.y = 0;
    this.hitBox.position.y = -1;
    this.hitBox.position.z = fixZ;
    this.hitBox.visible = false;
    this.hitBox2.position.y = -1;
    this.hitBox2.position.z = fixZ;
    this.hitBox2.position.x += 0.8;
    this.hitBox2.visible = false;
    this.hitBox3.position.y = -1;
    this.hitBox3.position.z = fixZ;
    this.hitBox3.position.x -= 0.8;
    this.hitBox3.visible = false;
    this.headlight1.position.set(-0.3, -1.1, -1.1);
    this.headlight2.position.set(0.3, -1.1, -1.1);
    this.object.add(this.hitBox3);
    this.object.add(this.hitBox2);
    this.object.add(this.hitBox);
    this.object.add(this.headlight1);
    this.object.add(this.headlight2);
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

  checkCollisions(player: any, endGame: any, states: any, audio: any, wayMap: any) {
    if (this.detectCollisionPlayer(player, this.hitBox)) {
      endGame.style.display = 'flex';
      endGame.textContent = 'GAME OVER!';
      endGame.style.color = 'red';
      audio.pause();
      console.log(wayMap);
      states.play = false;
      states.end = true;
    }
    if (this.detectCollisionPlayer(player, this.hitBox2)) {
      if (states.control.xpos < 1) {
        states.control.xpos += 1;
      }
    }
    if (this.detectCollisionPlayer(player, this.hitBox3)) {
      if (states.control.xpos > -1) {
        states.control.xpos -= 1;
      }
    }
  }
}
