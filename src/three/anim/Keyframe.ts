import { isArrayEqual } from "../../global/Common";
import { AnimNode } from "./AnimNode";
import { getAttrNeedValueCount, isNumArray } from "./AnimTool";
import { Track } from "./Track";

export class Keyframe extends AnimNode {
  track: Track;
  index: number = 0;
  text: string = "";

  private lastValues: number[] | undefined = undefined;
  values: number[] | undefined = undefined;

  easeName: string = "linear";
  easeEnd: string = "in";
  private _isDirty: boolean = false;

  constructor(parent: Track, attrs: any = {}) {
    super();
    Object.assign(this, attrs);
    this.track = parent;
    this.parseValues();
  }

  setText(text: string) {
    this.text = text;
    this.parseValues();
    this.markDirty();
  }

  setIndex(index: number) {
    this.index = index;
    this.markDirty();
    this.onChange.forEach((func) => func());
  }

  setEaseName(easeName: string) {
    this.easeName = easeName;
    this.markDirty();
  }

  setEaseEnd(easeEnd: string) {
    this.easeEnd = easeEnd;
    this.markDirty();
  }

  parseValues() {
    const needValueCount = getAttrNeedValueCount(this.track.attr);

    if (needValueCount === 0) {
      this.values = undefined;
    } else {
      try {
        const value = JSON.parse("[" + this.text + "]");
        if (isNumArray(value, needValueCount)) {
          this.values = value;
        } else {
          this.values = undefined;
        }
      } catch (e) {}
    }

    if (!isArrayEqual(this.lastValues, this.values)) {
      this.onChange.forEach((func) => func());
      this.lastValues = this.values ? [...this.values] : undefined;
    }
  }

  toAttrs() {
    return {
      index: this.index,
      easeName: this.easeName,
      easeEnd: this.easeEnd,
      text: this.text,
    };
  }

  markDirty() {
    this._isDirty = true;
  }

  isDirty() {
    return this._isDirty;
  }

  cleanDirty() {
    this._isDirty = false;
  }
}
