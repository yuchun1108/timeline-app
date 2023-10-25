export function keyframeIndexToTime(index: number, fps: number): number {
  return index / fps;
}

export function isNum(value: any): boolean {
  return !isNaN(value);
}

export function isNumArray(value: any, len: number = -1): boolean {
  if (len < 0) {
    return Array.isArray(value) && value.every((v) => isNum(v));
  } else {
    return (
      Array.isArray(value) &&
      value.length === len &&
      value.every((v) => isNum(v))
    );
  }
}

export function getAttrNeedValueCount(attr: string): number {
  switch (attr) {
    case "position":
      return 3;
    default:
      return 1;
  }
}
