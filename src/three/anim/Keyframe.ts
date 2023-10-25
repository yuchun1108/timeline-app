import { v4 as uuidv4 } from "uuid";
import { isArrayEqual } from "../../global/Common";
import { AnimNode } from "./AnimNode";
import { getAttrNeedValueCount, isNumArray } from "./AnimTool";
import { Track } from "./Track";

export class Keyframe implements AnimNode {
  uuid: string;
  track: Track;
  index: number = 0;

  text: string = "";
  values: number[] | undefined = undefined;
  private lastValues: number[] | undefined = undefined;
  easeName: string = "linear";
  easeEnd: string = "in";
  private _isDirty: boolean = false;
  onValuesChange: ((values: number[] | undefined) => void) | undefined;

  constructor(parent: Track, attrs: any = {}) {
    Object.assign(this, attrs);
    this.uuid = uuidv4();
    this.track = parent;
    this.parseValues();
  }

  setText(text: string) {
    this.text = text;
    this.parseValues();
    this.markDirty();
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
      this.onValuesChange?.(this.values);
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
