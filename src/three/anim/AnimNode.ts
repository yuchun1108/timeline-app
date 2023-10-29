import { v4 as uuidv4 } from "uuid";
import Action from "../../global/Actions";
export class AnimNode {
  uuid: string;
  selectState: 0 | 1 | 2 = 0;
  onChange = new Action<() => void>();
  onSelectedChange = new Action<(selectState: 0 | 1 | 2) => void>();

  private newSelectState: 0 | 1 | 2 = 0;

  constructor() {
    this.uuid = uuidv4();
  }

  setSelectState(selectState: 0 | 1 | 2) {
    this.newSelectState = selectState;
  }

  setSelected(isSelected: 0 | 1 | 2) {
    this.newSelectState = isSelected;
  }

  applySelectChange() {
    if (this.selectState !== this.newSelectState) {
      this.selectState = this.newSelectState;
      this.onSelectedChange.forEach((func) => {
        func(this.selectState);
      });
    }
  }

  toAttrs() {}
}
