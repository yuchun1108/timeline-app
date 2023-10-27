import { v4 as uuidv4 } from "uuid";
import Action from "../../global/Actions";
export class AnimNode {
  uuid: string;
  isSelected: boolean = false;
  onChange = new Action<() => void>();
  onSelectedChange = new Action<(isSelected: boolean) => void>();

  private newIsSelected: boolean = false;

  constructor() {
    this.uuid = uuidv4();
  }

  setSelected(isSelected: boolean) {
    this.newIsSelected = isSelected;
  }

  applySelectChange() {
    if (this.isSelected !== this.newIsSelected) {
      this.isSelected = this.newIsSelected;

      this.onSelectedChange.forEach((func) => {
        func(this.isSelected);
      });
    }
  }
}
