import * as THREE from "three";
import Entity from "./Entity";

export default class World {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  entities: Entity[] = [];

  myAppHeight: number;

  constructor(myAppHeight: number) {
    this.myAppHeight = myAppHeight;
    const width = window.innerWidth;
    const height = window.innerHeight - this.myAppHeight;

    this.camera = this.setupCamera(width, height);
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    this.renderer = this.setupRenderer({ antialias: true }, width, height);

    this.registerResize();
  }

  setupCamera(width: number, height: number) {
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    return camera;
  }

  setupRenderer(
    param: THREE.WebGLRendererParameters,
    width: number,
    height: number
  ) {
    const renderer = new THREE.WebGLRenderer(param);
    renderer.setSize(width, height);
    renderer.setAnimationLoop(this.update.bind(this));
    const threeContainer = document.getElementById("three-container");
    threeContainer?.appendChild(renderer.domElement);
    return renderer;
  }

  update(time: number) {
    this.entities.forEach((entity) => {
      entity.update(time);
    });

    this.renderer.render(this.scene, this.camera);
  }

  addEntity(entity: Entity) {
    this.scene.add(entity.mesh);
    this.entities.push(entity);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight - this.myAppHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    console.log("resize", width, height);
  }

  registerResize() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
