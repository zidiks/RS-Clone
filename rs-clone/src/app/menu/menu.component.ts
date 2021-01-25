import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { User } from '../user';
import { AudioService } from './audio.service';
import { globalProps } from './globalprops';
import { SkinService } from './skin.service';
import { UserService} from './user.service';

export const audioManager = new AudioService();

interface mix {
  [key:string]: THREE.AnimationMixer
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit, OnDestroy {
  audioManager: AudioService = audioManager;
  public user: User | undefined;
  mixer: mix | undefined = {};
  skin: THREE.Group = new THREE.Group();
  playerAction: any;
  scene = new THREE.Scene();
  RESIZER: any;
  REQANIMFRAME: any;
  constructor(
    public router: Router,
    public userManager: UserService,
    public skinManager: SkinService
  ) {
    this.skinManager.setSkinTarget(this.skin, this.mixer);
    this.userManager.getUser().subscribe(data => {
      if (data) {
        globalProps.coins = data.coins;
        globalProps.highScore = data.highScore;
        globalProps.boughtSkins = data.boughtSkins;
          if (globalProps.activeSkin !== data.activeSkin) {
            globalProps.activeSkin = data.activeSkin;
            this.skinManager.showSkin(`/assets/skins/${globalProps.activeSkin}/menu.fbx`);
          }
      }
      this.user = data;
    });
  }

  ngOnInit(): void {
    this.router.navigate(['']);
    const Hi = <HTMLDivElement>document.getElementById('hi');
    if (globalProps.hiScreen) {
      audioManager.playBg();
      Hi.style.display = 'none';
    }
    const domScene = <HTMLDivElement>document.getElementById('menu-background');
    const domHi = <HTMLDivElement>document.getElementById('hi-play');

THREE.Cache.enabled = true;
const scene = this.scene;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
domScene.appendChild(renderer.domElement);

scene.fog = new THREE.Fog("lightblue", 15, 25);
scene.background = new THREE.Color("lightblue");

this.RESIZER = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  console.log('resizew!');
}

window.addEventListener( 'resize', this.RESIZER, false );

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

{
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    "assets/menu/images/CCMaY.jpg",
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt;
    },
  );
}

const light = new THREE.DirectionalLight(0xffffff, 0.7);
light.position.set(8, 15, 7);
light.castShadow = true;
light.shadow.camera.top = 30;
light.shadow.camera.right = 20;
light.shadow.camera.bottom = -10;
light.shadow.camera.left = -20;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 2000;
light.shadow.mapSize.width = window.innerWidth * 2;
light.shadow.mapSize.height = window.innerHeight * 2;
scene.add(light);

this.scene.add(this.skin);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.y -= 0;
cube.receiveShadow = true;
cube.castShadow = true;
cube.visible = false;
scene.add(cube);

camera.position.y += 1;

const clock = new THREE.Clock();
let angle = 10;
const angularSpeed = THREE.MathUtils.degToRad(20);
let delta = 10;
const radius = 3;

function envRender(objSrc: string, mtlSrc: string, ...position: number[]) {
  const mtlLoader = new MTLLoader();
  mtlLoader.load(mtlSrc, (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(objSrc, (object) => {
      object.position.set(position[0], position[1], position[2]);
      object.traverse((child) => {
        child.receiveShadow = true;
        child.castShadow = true;
      });
      scene.add(object);
    }, () => console.log("load..."), () => console.log("err!"));
  });
}

envRender("assets/menu/models/sity_3.vox.obj", "assets/menu/models/sity_3.vox.mtl", 0, -1, 0);
envRender("assets/menu/models/sity_1.vox.obj", "assets/menu/models/sity_1.vox.mtl", 19, -1, 0);
envRender("assets/menu/models/train/train.vox.obj", "assets/menu/models/train/train.vox.mtl", 9, -1, -7);

let mixer: any;

// const loader = new FBXLoader();
// loader.load("assets/menu/models/player-menu.fbx", (object) => {
//   mixer = new THREE.AnimationMixer(object);
//   const playerAction = mixer.clipAction(object.animations[0]);

//   object.traverse((child) => {
//     if (child instanceof Mesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });

//   object.scale.set(0.9, 0.9, 0.9);
//   object.position.y -= 0.5;
//   object.position.z = 0;
//   object.rotation.y += 90;
//   playerAction.play();

//   scene.add(object);
// });

const render = () => {
  delta = clock.getDelta();
  camera.position.x = Math.cos(angle) * radius;
  camera.position.z = Math.sin(angle) * radius;
  angle += angularSpeed * delta;
  if (this.mixer && this.mixer.target) {
    this.mixer.target.update( delta );
  }

  camera.lookAt(cube.position);

  this.REQANIMFRAME = requestAnimationFrame(render);

  renderer.render(scene, camera);
}
render();

    domHi.addEventListener('click', () => {
      audioManager.playBg();
      Hi.style.display = 'none';
      globalProps.hiScreen = true;
    });

    this.skinManager.showSkin(`/assets/skins/${globalProps.activeSkin}/menu.fbx`);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.REQANIMFRAME);
    audioManager.pauseAll();
    window.removeEventListener( 'resize', this.RESIZER, false );
  }

}
