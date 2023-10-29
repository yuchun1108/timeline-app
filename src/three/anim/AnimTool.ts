export function keyframeIndexToTime(index: number, fps: number): number {
  return index / fps;
}

export function animTimeToFrameIndex(animTime: number, fps: number): number {
  return Math.round(animTime * fps);
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
    case "scale-xyz":
    case "rotation":
      return 3;
    case "position-xy":
    case "position-yz":
    case "position-xz":
      return 2;
    case "position-x":
    case "position-y":
    case "position-z":
    case "scale-x":
    case "scale-y":
    case "scale-z":
    case "rotation-x":
    case "rotation-y":
    case "rotation-z":
    case "scale":
      return 1;
    default:
      return 0;
  }
}
