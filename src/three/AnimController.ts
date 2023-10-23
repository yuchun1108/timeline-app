import { Anim } from "../global/Anim";

export default class AnimController {
  target: THREE.Object3D;
  anim: Anim;
  animTime: number = 0;

  constructor(target: THREE.Object3D) {
    this.target = target;
    this.anim = new Anim();
  }

  update(deltaTime: number) {
    if (this.anim.timeLength > 0) {
      this.animTime += deltaTime;
      this.animTime %= this.anim.timeLength;

      this.anim.apply(this.target, this.animTime);
    }
  }
}
