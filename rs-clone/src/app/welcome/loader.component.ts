import { Component, OnInit } from '@angular/core';
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit {
  REQANIMFRAME: any;
  constructor() { }

  ngOnInit(): void {
    let userData: any;
    let renderer: any;
    let scene: any;
    let camera: any;
    let guiData: any;

    function loadSVG(url: string) {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      const loader = new SVGLoader();

      loader.load(url, (data) => {
        const { paths } = data;

        const group = new THREE.Group();
        group.scale.multiplyScalar(0.25);
        group.position.x = -70;
        group.position.y = 70;
        group.scale.y *= -1;

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
//@ts-ignore
          const fillColor = path.userData.style.fill;
          if (guiData.drawFillShapes && fillColor !== undefined && fillColor !== "none") {
            const material = new THREE.MeshBasicMaterial({
              color: new THREE.Color().setStyle(fillColor),
              //@ts-ignore
              opacity: path.userData.style.fillOpacity,
              //@ts-ignore
              transparent: path.userData.style.fillOpacity < 1,
              side: THREE.DoubleSide,
              depthWrite: false,
              wireframe: guiData.fillShapesWireframe,
            });

            const shapes = path.toShapes(true);

            for (let j = 0; j < shapes.length; j++) {
              const shape = shapes[j];

              const geometry = new THREE.ShapeBufferGeometry(shape);
              const mesh = new THREE.Mesh(geometry, material);

              group.add(mesh);
            }
          }
//@ts-ignore
          const strokeColor = path.userData.style.stroke;

          if (guiData.drawStrokes && strokeColor !== undefined && strokeColor !== "none") {
            const material = new THREE.MeshBasicMaterial({
              color: new THREE.Color().setStyle(strokeColor),
              //@ts-ignore
              opacity: path.userData.style.strokeOpacity,
              //@ts-ignore
              transparent: path.userData.style.strokeOpacity < 1,
              side: THREE.DoubleSide,
              depthWrite: false,
              wireframe: guiData.strokesWireframe,
            });

            for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
              const subPath = path.subPaths[j];
//@ts-ignore
              const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);

              if (geometry) {
                const mesh = new THREE.Mesh(geometry, material);

                group.add(mesh);
              }
            }
          }
        }

        scene.add(group);
      });
    }

    function init() {
      const container = document.getElementById("container");

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.set(0, 0, 200);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      window.addEventListener("resize", onWindowResize, false);

      guiData = {
        currentURL: "assets/loader/Threejs-logot.svg",
        drawFillShapes: true,
        drawStrokes: true,
        fillShapesWireframe: false,
        strokesWireframe: true,
      };

      loadSVG(guiData.currentURL);

      const update = (url: string, ...position: any[]) => {
        setTimeout(() => {
          guiData.currentURL = url;
          camera.position.set(...position);
          loadSVG(guiData.currentURL);
        }, 5000);
      };
      update("assets/loader/angular.svg", -35, 40, 90);
      setTimeout(() => {
        update("assets/loader/firebase.svg", -10, 10, 100);
      }, 4000);
      setTimeout(() => {
        update("assets/loader/loading.svg", -10, 10, 100);
      }, 8000);
      setTimeout(() => {
        document.location.href = '/';
      }, 20000);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    init();

    function render() {
      renderer.render(scene, camera);
      camera.position.z += 1;
    }

    function animate() {
      requestAnimationFrame(animate);
      // camera.position.z += 0.01;
      render();
    }
    animate();
  }
  ngOnDestroy() {
    cancelAnimationFrame(this.REQANIMFRAME);
  }

}
