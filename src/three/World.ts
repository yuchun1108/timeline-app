import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Action from "../global/Actions";
import { saveWorldAnim } from "../global/Storage";
import Entity from "./Entity";

export default class World {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  myAppHeight: number;
  onHierarchyChange = new Action<() => void>();
  boxHelper: THREE.BoxHelper;
  controls: OrbitControls;
  group: THREE.Object3D | undefined = undefined;

  private lastTime: number = -1;

  constructor(myAppHeight: number) {
    this.myAppHeight = myAppHeight;
    const width = window.innerWidth;
    const height = window.innerHeight - this.myAppHeight;

    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.05, 1000);
    this.camera.position.set(0, 0, 10);

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

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.controls.enablePan = false;
    this.controls.enableDamping = true;

    this.boxHelper = new THREE.BoxHelper(this.scene);
    //this.scene.add(this.boxHelper);
  }

  //#region setup

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
        if (anim.isDirty()) {
          isDirty = true;
          anim.cleanDirty();
        }
      }
    });

    if (isDirty) {
      saveWorldAnim(this);
      console.log("save");
    }
  }

  clearGroup() {
    if (this.group) this.scene.remove(this.group);

    this.onHierarchyChange.forEach((f) => f());
  }

  setGroup(group: THREE.Object3D) {
    this.clearGroup();
    this.group = group;

    this.group.traverse((obj) => {
      obj.entity = new Entity(obj);
    });

    this.scene.add(group);
    this.scene.traverse((obj) => {
      obj.entity?.fillPath();
    });

    this.updateBoxHelper();

    this.onHierarchyChange.forEach((f) => f());
  }

  private updateBoxHelper() {
    this.boxHelper.update();
    console.log(this.boxHelper);
    const attr = this.boxHelper.geometry.attributes;
    const count = attr.position.count;
    const arr = attr.position.array;
    const min: THREE.Vector3 = new THREE.Vector3(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
    const max: THREE.Vector3 = new THREE.Vector3(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    );
    if (arr instanceof Float32Array) {
      for (let i = 0; i < count; i++) {
        min.x = Math.min(min.x, arr[i * 3 + 0]);
        min.y = Math.min(min.y, arr[i * 3 + 1]);
        min.z = Math.min(min.z, arr[i * 3 + 2]);

        max.x = Math.max(max.x, arr[i * 3 + 0]);
        max.y = Math.max(max.y, arr[i * 3 + 1]);
        max.z = Math.max(max.z, arr[i * 3 + 2]);
      }
    }

    const centerY = (min.y + max.y) / 2;
    this.camera.position.set(0, centerY, 2 * (max.y - min.y));
    this.camera.quaternion.identity();
    this.controls.target.set(0, (min.y + max.y) / 2, 0);
    console.log(min, max);
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
