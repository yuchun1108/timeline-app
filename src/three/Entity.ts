import * as THREE from "three";
import AnimController from "./anim/AnimController";

declare module "three" {
  interface Object3D {
    entity: Entity | undefined;
  }
}

export default class Entity {
  target: THREE.Object3D;
  animController: AnimController;
  path: string = "";

  originPos: THREE.Vector3 = new THREE.Vector3();
  originRot: THREE.Euler = new THREE.Euler();
  originScale: THREE.Vector3 = new THREE.Vector3();

  constructor(target: THREE.Object3D) {
    this.target = target;
    this.originPos.copy(target.position);
    this.originRot.copy(target.rotation);
    this.originScale.copy(target.scale);
    this.animController = new AnimController(target);
  }

  resetTransfrom() {
    this.target.position.copy(this.originPos);
    this.target.rotation.copy(this.originRot);
    this.target.scale.copy(this.originScale);
  }

  fillPath() {
    let parent: THREE.Object3D | null = this.target;
    let path: string = this.target.name;

    for (let i = 0; i < 100; i++) {
      parent = parent?.parent;
      if (!parent) break;
      path = parent.name + "." + path;
    }

    this.path = path;
  }

  update(deltaTime: number) {
    this.animController.update(deltaTime);
  }
}
