import { Anim } from "./Anim";

export default class AnimController {
  target: THREE.Object3D;
  anim: Anim;
  private lastAnimTime: number = 0;
  animTime: number = 0;
  isPlaying: boolean = false;

  onAnimTimeChange: ((animTime: number) => void) | undefined;

  constructor(target: THREE.Object3D) {
    this.target = target;
    this.anim = new Anim();
  }

  update(deltaTime: number) {
    if (this.anim.timeLength > 0) {
      if (this.isPlaying) {
        this.animTime += deltaTime;
        this.animTime %= this.anim.timeLength;
        this.onAnimTimeChange?.(this.animTime);
      }

      if (this.animTime !== this.lastAnimTime) {
        this.anim.apply(this.target, this.animTime);
      }
      this.lastAnimTime = this.animTime;
    }
  }

  play() {
    this.isPlaying = true;
  }

  stop() {
    this.isPlaying = false;
  }

  setAnimTime(animTime: number) {
    this.lastAnimTime = this.animTime = animTime % this.anim.timeLength;
    this.anim.apply(this.target, this.animTime);
  }
}
