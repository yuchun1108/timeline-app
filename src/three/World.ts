import * as THREE from "three";
import { saveWorldAnim } from "../global/Storage";

export default class World {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  myAppHeight: number;
  onHierarchyChange: (() => void)[] = [];

  private lastTime: number = -1;

  constructor(myAppHeight: number) {
    this.myAppHeight = myAppHeight;
    const width = window.innerWidth;
    const height = window.innerHeight - this.myAppHeight;

    this.camera = this.setupCamera(width, height);
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    this.renderer = this.setupRenderer({ antialias: true }, width, height);

    this.registerResize();

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
    hemiLight.position.set(0, 200, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 5);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    this.scene.add(dirLight);
  }

  //#region setup

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

  //#endregion

  update(time: number) {
    time *= 0.001;
    if (this.lastTime < 0) this.lastTime = time;
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    this.scene.traverse((obj) => {
      obj.entity?.update(deltaTime);
    });

    this.renderer.render(this.scene, this.camera);

    this.checkHasDirtyAndSave();
  }

  checkHasDirtyAndSave() {
    let isDirty = false;
    this.scene.traverse((obj) => {
      if (obj.entity) {
        const anim = obj.entity.animController.anim;
        if (anim.isDirty) isDirty = true;
        anim.isDirty = false;
      }
    });

    if (isDirty) {
      saveWorldAnim(this);
      console.log("save");
    }
  }

  addObject(obj: THREE.Object3D) {
    this.scene.add(obj);
    this.scene.traverse((obj) => {
      obj.entity?.fillPath();
    });

    this.onHierarchyChange.forEach((f) => f());
  }

  getAllObjects(): THREE.Object3D[] {
    const objs: THREE.Object3D[] = [];
    this.scene.traverse((obj) => {
      if (obj.entity) {
        objs.push(obj);
      }
    });
    return objs;
  }

  //#region window-resize

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight - this.myAppHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  registerResize() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  //#endregion
}
