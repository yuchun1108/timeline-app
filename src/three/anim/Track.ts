import { inverseLerp, lerp } from "three/src/math/MathUtils";
import { v4 as uuidv4 } from "uuid";
import { AnimNode } from "./AnimNode";
import { keyframeIndexToTime } from "./AnimTool";
import { Keyframe } from "./Keyframe";

export class Track implements AnimNode {
  uuid: string;
  attr: string = "";
  keyframes: Keyframe[] = [];

  constructor(attrs: any = {}) {
    const { keyframes, ...track } = attrs;
    Object.assign(this, track);
    this.uuid = uuidv4();

    const keyframesLen = keyframes ? keyframes.length : 0;

    this.keyframes = new Array(keyframesLen);
    for (let i = 0; i < keyframesLen; i++) {
      this.keyframes[i] = new Keyframe(this, keyframes[i]);
    }
  }

  sortKeyframes() {
    this.keyframes.sort((a, b) => a.index - b.index);
  }

  apply(obj: THREE.Object3D, time: number, fps: number) {
    switch (this.attr) {
      case "position":
        const value = this.getValue(time, fps);
        if (Array.isArray(value) && value.length === 3) {
          obj.position.set(value[0], value[1], value[2]);
        }
        break;
    }
  }

  getValue(time: number, fps: number): number[] | undefined {
    const keyframes = this.keyframes;
    let keyA: Keyframe | undefined = undefined;
    let keyB: Keyframe | undefined = undefined;
    let p: number = 0;

    if (keyframes.length === 0) {
      return undefined;
    } else if (keyframes.length === 1) {
      keyA = keyB = keyframes[0];
    } else if (time <= keyframeIndexToTime(keyframes[0].index, fps)) {
      keyA = keyB = keyframes[0];
    } else if (
      time >= keyframeIndexToTime(keyframes[keyframes.length - 1].index, fps)
    ) {
      keyA = keyB = keyframes[keyframes.length - 1];
    } else {
      for (let i = 0; i < keyframes.length - 1; i++) {
        const _keyA = keyframes[i];
        const _keyB = keyframes[i + 1];
        const _timeA = keyframeIndexToTime(_keyA.index, fps);
        const _timeB = keyframeIndexToTime(_keyB.index, fps);

        if (time >= _timeA && time < _timeB) {
          keyA = _keyA;
          keyB = _keyB;
          p = inverseLerp(_timeA, _timeB, time);
          break;
        }
      }
    }

    if (!keyA || !keyB) return undefined;
    if (!keyA.values || !keyB.values) return undefined;

    if (keyA.values.length === keyB.values.length) {
      const arr = new Array<number>(keyA.values.length);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = lerp(keyA.values[i], keyB.values[i], p);
      }
      return arr;
    }

    return undefined;
  }
}
