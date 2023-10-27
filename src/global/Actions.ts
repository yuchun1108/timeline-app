export default class Action<T> {
  arr: T[] = [];

  add(func: T) {
    if (!this.arr.includes(func)) this.arr.push(func);
  }

  remove(func: T) {
    const i = this.arr.indexOf(func);
    if (i >= 0) {
      this.arr.splice(i, 1);
    }
  }

  forEach(callbackFn: (func: T) => void) {
    this.arr.forEach(callbackFn);
  }
}
