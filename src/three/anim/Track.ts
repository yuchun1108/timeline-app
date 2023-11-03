import * as THREE from "three";
import { inverseLerp, lerp } from "three/src/math/MathUtils";
import Action from "../../global/Actions";
import { AnimNode } from "./AnimNode";
import { getAttrNeedValueCount, keyframeIndexToTime } from "./AnimTool";
import getEaseFunc from "./EaseFunc";
import { Keyframe } from "./Keyframe";

export class Track extends AnimNode {
  targetText: string = "";
  targetPath: string[] = [""];
  attr: string = "";
  opt: string = "add";
  keyframes: Keyframe[] = [];
  cloneKeyframes: Keyframe[] = [];
  _isDirty: boolean = false;

  onKeyframesChange = new Action<
    (keyframes: Keyframe[], cloneKeyframes: Keyframe[]) => void
  >();

  constructor(attrs: any = {}) {
    super();
    const { keyframes, ...track } = attrs;
    Object.assign(this, track);

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
    this.onChange.forEach((func) => func());
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
    this.onChange.forEach((func) => func());
    this.markDirty();
  }

  setOpt(opt: string) {
    this.opt = opt;
    this.onChange.forEach((func) => func());
    this.markDirty();
  }

  sortKeyframes() {
    this.keyframes.sort((a, b) => a.index - b.index);
  }

  getTarget(obj: THREE.Object3D): THREE.Object3D | undefined {
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
    }

    return target;
  }

  apply(obj: THREE.Object3D, time: number, fps: number) {
    let target = this.getTarget(obj);
    if (!target) return;

    const values = this.getValues(time, fps);
    if (values === undefined) return;

    const needValueCount = getAttrNeedValueCount(this.attr);
    if (needValueCount === 0 || values.length !== needValueCount) return;

    if (this.attr.startsWith("position")) {
      this.applyPosition(target, values);
    } else if (this.attr.startsWith("scale")) {
      this.applyScale(target, values);
    } else if (this.attr.startsWith("rotation")) {
      this.applyRotation(target, values);
    }
  }

  private applyPosition(target: THREE.Object3D, values: number[]) {
    const pos = new THREE.Vector3();

    if (this.opt === "override") {
      pos.copy(target.position);
    }

    switch (this.attr) {
      case "position":
        pos.fromArray(values);
        break;
      case "position-x":
        pos.x = values[0];
        break;
      case "position-y":
        pos.y = values[0];
        break;
      case "position-z":
        pos.z = values[0];
        break;
      case "position-xy":
        pos.x = values[0];
        pos.y = values[1];
        break;
      case "position-yz":
        pos.y = values[0];
        pos.z = values[1];
        break;
      case "position-xz":
        pos.x = values[0];
        pos.z = values[1];
        break;
    }

    if (this.opt === "add") {
      target.position.add(pos);
    } else if (this.opt === "override") {
      target.position.copy(pos);
    }
  }

  private applyScale(target: THREE.Object3D, values: number[]) {
    const scale = new THREE.Vector3();

    if (this.opt === "override") {
      scale.copy(target.scale);
    }

    switch (this.attr) {
      case "scale-xyz":
        scale.fromArray(values);
        break;
      case "scale":
        scale.x = scale.y = scale.z = values[0];
        break;
      case "scale-x":
        scale.x = values[0];
        break;
      case "scale-y":
        scale.y = values[0];
        break;
      case "scale-z":
        scale.z = values[0];
        break;
    }

    if (this.opt === "add") {
      target.scale.add(scale);
    } else if (this.opt === "override") {
      target.scale.copy(scale);
    }
  }

  private applyRotation(target: THREE.Object3D, values: number[]) {
    const rotation = new THREE.Euler(0, 0, 0);

    const degrees = values.map((value) => (value / 180) * Math.PI);

    if (this.opt === "override") {
      rotation.copy(target.rotation);
    }

    switch (this.attr) {
      case "rotation":
        rotation.set(degrees[0], degrees[1], degrees[2]);
        break;
      case "rotation-x":
        rotation.x = degrees[0];
        break;
      case "rotation-y":
        rotation.y = degrees[0];
        break;
      case "rotation-z":
        rotation.z = degrees[0];
        break;
    }

    if (this.opt === "add") {
      target.rotation.x += rotation.x;
      target.rotation.y += rotation.y;
      target.rotation.z += rotation.z;
    } else if (this.opt === "override") {
      target.rotation.copy(rotation);
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
      opt: this.opt,
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

  nodifyKeyframeChange() {
    this.onKeyframesChange.forEach((func) =>
      func(this.keyframes, this.cloneKeyframes)
    );
  }
}
