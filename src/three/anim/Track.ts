import { inverseLerp, lerp } from "three/src/math/MathUtils";
import { v4 as uuidv4 } from "uuid";
import { AnimNode } from "./AnimNode";
import { getAttrNeedValueCount, keyframeIndexToTime } from "./AnimTool";
import getEaseFunc from "./EaseFunc";
import { Keyframe } from "./Keyframe";

export class Track implements AnimNode {
  uuid: string;
  targetText: string = "";
  targetPath: string[] = [""];
  attr: string = "";
  keyframes: Keyframe[] = [];
  _isDirty: boolean = false;
  onChange: (() => void) | undefined;

  constructor(attrs: any = {}) {
    const { keyframes, ...track } = attrs;
    Object.assign(this, track);
    this.uuid = uuidv4();

    const keyframesLen = keyframes ? keyframes.length : 0;

    this.keyframes = new Array(keyframesLen);
    for (let i = 0; i < keyframesLen; i++) {
      this.keyframes[i] = new Keyframe(this, keyframes[i]);
    }

    this.parseTargetPath();
  }

  setTargetText(target: string) {
    this.targetText = target;

    this.parseTargetPath();
    console.log(this.targetText, this.targetPath);
    this.onChange?.();
    this.markDirty();
  }

  parseTargetPath() {
    let target = this.targetText.trim();
    if (target.startsWith(".")) {
      target = target.slice(1);
    }

    this.targetPath = target.split(".");
  }

  setAttr(attr: string) {
    this.attr = attr;
    this.keyframes.forEach((keyframe) => {
      keyframe.parseValues();
    });
    this.onChange?.();
    this.markDirty();
  }

  sortKeyframes() {
    this.keyframes.sort((a, b) => a.index - b.index);
  }

  apply(obj: THREE.Object3D, time: number, fps: number) {
    let target: THREE.Object3D | undefined = obj;

    if (this.targetPath.length === 0 || this.targetPath[0] === "") {
      target = obj;
    } else {
      for (let i = 0; i < this.targetPath.length; i++) {
        if (!target) break;
        target = target.children.find(
          (child) => child.name === this.targetPath[i]
        );
        if (!target) break;
      }

      if (!target) return;
    }

    const values = this.getValues(time, fps);
    if (values === undefined) return;

    const needValueCount = getAttrNeedValueCount(this.attr);
    if (needValueCount === 0 || values.length !== needValueCount) return;

    switch (this.attr) {
      case "position":
        target.position.set(values[0], values[1], values[2]);
        break;
      case "position-x":
        target.position.setX(values[0]);
        break;
      case "position-y":
        target.position.setY(values[0]);
        break;
      case "position-z":
        target.position.setZ(values[0]);
        break;
      case "position-xy":
        target.position.setX(values[0]).setY(values[1]);
        break;
      case "position-yz":
        target.position.setY(values[0]).setZ(values[1]);
        break;
      case "position-xz":
        target.position.setX(values[0]).setZ(values[1]);
        break;
      case "scale-xyz":
        target.scale.set(values[0], values[1], values[2]);
        break;
      case "scale":
        target.scale.set(values[0], values[0], values[0]);
        break;
      case "scale-x":
        target.scale.setX(values[0]);
        break;
      case "scale-y":
        target.scale.setY(values[0]);
        break;
      case "scale-z":
        target.scale.setZ(values[0]);
        break;
      case "rotation":
        target.rotation.set(
          (values[0] / 180) * Math.PI,
          (values[1] / 180) * Math.PI,
          (values[2] / 180) * Math.PI
        );
        break;
      case "rotation-x":
        target.rotation.set(
          (values[0] / 180) * Math.PI,
          target.rotation.y,
          target.rotation.z
        );
        break;
      case "rotation-y":
        target.rotation.set(
          target.rotation.x,
          (values[0] / 180) * Math.PI,
          target.rotation.z
        );
        break;
      case "rotation-z":
        target.rotation.set(
          target.rotation.x,
          target.rotation.y,
          (values[0] / 180) * Math.PI
        );
        break;
    }
  }

  getValues(time: number, fps: number): number[] | undefined {
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
    if (keyA === keyB) return keyA.values;

    if (keyA.values.length === keyB.values.length) {
      let _easeFunc = getEaseFunc("linear");
      if (keyA.easeName !== "" && keyA.easeName !== "linear") {
        _easeFunc = getEaseFunc(keyA.easeName + "_" + keyA.easeEnd);
      }

      if (_easeFunc !== undefined) {
        p = _easeFunc(p);
      }

      const arr = new Array<number>(keyA.values.length);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = lerp(keyA.values[i], keyB.values[i], p);
      }
      return arr;
    }

    return undefined;
  }

  toAttrs() {
    return {
      targetText: this.targetText,
      attr: this.attr,
      keyframes: this.keyframes.map((keyframe) => keyframe.toAttrs()),
    };
  }

  markDirty() {
    this._isDirty = true;
  }

  isDirty() {
    return (
      this._isDirty || !this.keyframes.every((keyframe) => !keyframe.isDirty())
    );
  }

  cleanDirty() {
    this._isDirty = false;
    this.keyframes.forEach((keyframe) => keyframe.cleanDirty());
  }
}
