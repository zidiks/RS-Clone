import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { Mesh } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { User } from '../user';
import { AudioService } from './audio.service';
import { globalProps } from './globalprops';
import { ShopComponent } from './shop/shop.component';
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
  scene: any;
  constructor(
    public userManager: UserService,
    public skinManager: SkinService
  ) {
    this.userManager.getUser().subscribe(data => {
      if (data) {
        globalProps.coins = data.coins;
        globalProps.highScore = data.highScore;
      }
      this.user = data;
    });
  }

  ngOnInit(): void {
    const Hi = <HTMLDivElement>document.getElementById('hi');
    if (globalProps.hiScreen) {
      audioManager.playBg();
      Hi.style.display = 'none';
    }
    const clock = new THREE.Clock();
    const domScene = <HTMLDivElement>document.getElementById('menu-background');
    const domHi = <HTMLDivElement>document.getElementById('hi-play');
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog('lightblue', 10, 30);
    this.scene.background =  new THREE.Color('lightblue');
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = false;
    domScene.appendChild( renderer.domElement );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    light.position.set(2, 10, 15);
    this.scene.add(light);

    this.scene.add(this.skin);

    // const floor = new THREE.Mesh(
    //   new THREE.PlaneGeometry(10, 100, 10, 10),
    //   new THREE.MeshPhongMaterial( { color: 0xFFE89F } )
    // );
    // floor.rotation.x = -(Math.PI / 2);
    // floor.position.y -= 2;
    // floor.receiveShadow = true;
    // scene.add(floor);

    domHi.addEventListener('click', () => {
      audioManager.playBg();
      Hi.style.display = 'none';
      globalProps.hiScreen = true;
    });
    
    
    this.skinManager.setSkinTarget(this.skin, this.mixer);

    this.skinManager.showSkin('/assets/player.fbx');

    const animate = () => {  
      const delta = clock.getDelta();
      if (this.mixer && this.mixer.target) {
        this.mixer.target.update( delta );
      }

      requestAnimationFrame( animate );

      renderer.render( this.scene, camera );
    }
    animate();
  }

  ngOnDestroy() {
    audioManager.pauseAll();
  }

}