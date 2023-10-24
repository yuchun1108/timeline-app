import { v4 as uuidv4 } from "uuid";
import { AnimNode } from "./AnimNode";
import { Track } from "./Track";

function isNum(value: any): boolean {
  return !isNaN(value);
}

function isNumArray(value: any, len: number): boolean {
  return (
    Array.isArray(value) && value.length === len && value.every((v) => isNum(v))
  );
}

export class Keyframe implements AnimNode {
  uuid: string;
  parent: Track;
  index: number = 0;
  value: string = "";
  isCorrect: boolean;
  lastIsCorrect: boolean;
  ease: string = "";
  onIsCorrectChange: ((isCorrect: boolean) => void) | undefined;

  constructor(parent: Track, attrs: any = {}) {
    Object.assign(this, attrs);
    this.uuid = uuidv4();
    this.parent = parent;
    this.lastIsCorrect = this.isCorrect = this.checkIsCorrect();
  }

  setValue(value: string) {
    this.value = value;
    this.isCorrect = this.checkIsCorrect();
    if (this.lastIsCorrect !== this.isCorrect) {
      this.onIsCorrectChange?.(this.isCorrect);
      this.lastIsCorrect = this.isCorrect;
    }
  }

  checkIsCorrect(): boolean {
    try {
      const json = JSON.parse(this.value);
      switch (this.parent.attr) {
        case "position":
          return (this.isCorrect = isNumArray(json, 3));
      }
    } catch (e) {}
    return false;
  }
}
