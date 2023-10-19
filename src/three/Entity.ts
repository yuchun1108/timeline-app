import * as THREE from "three";
import { AnimInfo } from "../global/AnimInfo";

export default class Entity {
  mesh: THREE.Mesh;
  animInfo: AnimInfo | undefined = undefined;

  constructor() {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(geometry, material);
  }

  update(time: number) {
    this.mesh.rotation.x = time / 200;
    this.mesh.rotation.y = time / 1000;
  }
}
