import * as THREE from "three";
import AnimController from "./AnimController";

declare module "three" {
  interface Object3D {
    entity: Entity | undefined;
  }
}

export default class Entity {
  target: THREE.Object3D;
  animController: AnimController;
  path: string = "";

  constructor(target: THREE.Object3D) {
    this.target = target;
    this.animController = new AnimController(target);
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
