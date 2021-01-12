import * as THREE from 'three';

interface enemiesProts {
  [key: string]: THREE.Group
}

export class BoardHiEnemy {
  hitBox: THREE.Mesh
  object: THREE.Group = new THREE.Group;
  blinklight1: THREE.Mesh;
  blinklight2: THREE.Mesh;
  constructor(
    public prototypes: enemiesProts
  ) {
    const enemyBox: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial> = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.6, 0.1),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    this.blinklight1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.1),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 1 } )
    );
    let color = 0x555555;
    const blink = true;

    blink ? color = 0xFF0000 : color = 0xffffff;

    this.blinklight2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.1),
      new THREE.MeshPhongMaterial( { color: color, emissive: color, emissiveIntensity: 1 } )
    );
    this.hitBox = enemyBox;
    enemyBox.position.y = 0.6;
    enemyBox.position.z += 0.05;
    enemyBox.position.z = 0;
    enemyBox.visible = false;
    this.object.add(prototypes['boardHi'].clone());
    this.blinklight1.position.set(-0.6, -0.35, 0);
    this.blinklight2.position.set(0.6, -0.35, 0);
    this.object.add(this.blinklight1);
    this.object.add(this.blinklight2);
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

  checkCollisions(player: any, endGame: any, states: any, audio: any, wayMap: any) {
    if (this.detectCollisionPlayer(player)) {
      endGame.style.display = 'flex';
      endGame.textContent = 'GAME OVER!';
      endGame.style.color = 'red';
      audio.pause();
      console.log(wayMap);
      states.play = false;
      states.end = true;
    }
  }
}
