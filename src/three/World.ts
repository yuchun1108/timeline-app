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
  dirLight;

  private lastTime: number = -1;

  constructor(myAppHeight: number) {
    this.myAppHeight = myAppHeight;
    const width = window.innerWidth;
    const height = window.innerHeight - this.myAppHeight;

    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.05, 500);
    this.camera.position.set(0, 0, 10);

    this.scene = new THREE.Scene();

    this.renderer = this.setupRenderer({ antialias: true }, width, height);

    this.registerResize();

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
    hemiLight.position.set(0, 200, 0);
    this.scene.add(hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 5);
    this.dirLight.position.set(0, 200, 100);
    this.dirLight.castShadow = true;

    // dirLight.shadow.mapSize.width = 2048;
    // dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.bias = -0.0001;
    this.scene.add(this.dirLight);

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(new THREE.Color(0.01, 0.01, 0.01), 1);
    const threeContainer = document.getElementById("three-container");
    threeContainer?.appendChild(renderer.domElement);
    return renderer;
  }

  //#endregion

  setAllAnimPlay() {
    this.scene.traverse((obj) => {
      obj.entity?.animController.play();
    });
  }

  setAllAnimStop() {
    this.scene.traverse((obj) => {
      obj.entity?.animController.stop();
    });
  }

  update(time: number) {
    time *= 0.001;
    if (this.lastTime < 0) this.lastTime = time;
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    this.resetAnimTransform();

    this.scene.traverse((obj) => {
      obj.entity?.update(deltaTime);
    });

    const isDirty = this.checkHasDirty();

    if (isDirty) {
      saveWorldAnim(this);

      this.scene.traverse((obj) => {
        obj.entity?.animController.forceUpdate();
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  private resetAnimTransform() {
    const animPlayingEnts: Entity[] = [];

    this.scene.traverse((obj) => {
      if (obj.entity?.animController.isPlaying) {
        animPlayingEnts.push(obj.entity);
      }
      // obj.entity?.animController?.resetTransform();
    });

    animPlayingEnts.forEach((entity) => entity.resetTransfrom());
  }

  checkHasDirty(): boolean {
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
    return isDirty;
  }

  clearGroup() {
    if (this.group) this.scene.remove(this.group);

    this.onHierarchyChange.forEach((f) => f());
  }

  setGroup(group: THREE.Object3D) {
    this.clearGroup();
    this.group = group;

    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
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

    this.dirLight.shadow.camera.top = max.y;
    this.dirLight.shadow.camera.bottom = min.y;
    this.dirLight.shadow.camera.left = min.x;
    this.dirLight.shadow.camera.right = max.x;
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
