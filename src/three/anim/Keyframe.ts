import { v4 as uuidv4 } from "uuid";
import { AnimNode } from "./AnimNode";
import { getAttrNeedValueCount, isNumArray } from "./AnimTool";
import { Track } from "./Track";

export class Keyframe implements AnimNode {
  uuid: string;
  parent: Track;
  index: number = 0;

  text: string = "";
  values: number[] | undefined = undefined;
  easeName: string = "linear";
  easeEnd: string = "in";
  private _isDirty: boolean = false;
  onValuesChange: ((values: number[] | undefined) => void) | undefined;

  constructor(parent: Track, attrs: any = {}) {
    Object.assign(this, attrs);
    this.uuid = uuidv4();
    this.parent = parent;
    this.parseValues();
  }

  setText(text: string) {
    this.text = text;
    this.parseValues();
    this.onValuesChange?.(this.values);
    this.markDirty();
  }

  parseValues() {
    const needValueCount = getAttrNeedValueCount(this.parent.attr);
    try {
      const value = JSON.parse("[" + this.text + "]");
      if (isNumArray(value, needValueCount)) {
        this.values = value;
      } else {
        this.values = undefined;
      }
    } catch (e) {}
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
