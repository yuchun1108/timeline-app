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
  ease: string = "";
  onValuesChange: ((values: number[] | undefined) => void) | undefined;

  constructor(parent: Track, attrs: any = {}) {
    Object.assign(this, attrs);
    this.uuid = uuidv4();
    this.parent = parent;
    this.parseValues();
    // this.lastIsCorrect = this.isCorrect = this.checkIsCorrect();
  }

  setText(text: string) {
    this.text = text;
    this.parseValues();
    this.onValuesChange?.(this.values);
  }

  // setValue(value: string) {
  //   this.value = value;
  //   this.isCorrect = this.checkIsCorrect();
  //   if (this.lastIsCorrect !== this.isCorrect) {
  //     this.onIsCorrectChange?.(this.isCorrect);
  //     this.lastIsCorrect = this.isCorrect;
  //   }
  // }

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
}
