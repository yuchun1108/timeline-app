import * as THREE from "three";
import { AnimInfo } from "../global/Anim";

export default class Entity {
  target: THREE.Object3D;
  animInfo: AnimInfo | undefined = undefined;

  constructor(target: THREE.Object3D) {
    this.target = target;

    // const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // const material = new THREE.MeshNormalMaterial();

    // this.mesh = new THREE.Mesh(geometry, material);
  }

  update(time: number) {
    this.target.rotation.x = time / 200;
    this.target.rotation.y = time / 1000;
  }
}
