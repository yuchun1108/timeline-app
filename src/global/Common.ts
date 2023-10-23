export const globalVar = {};

export function isArrayEqual(a: any[], b: any): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function printToNewTab(str: string) {
  const w = window.open();
  if (w) {
    const span = w.document.createElement("span");
    span.style.whiteSpace = "pre-wrap";
    span.innerText = str;
    w.document.body.appendChild(span);
  }
}

export function onlyNumbers(array: Array<any>) {
  return array.every((item) => {
    return typeof item === "number";
  });
}

export function toDecimal2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
