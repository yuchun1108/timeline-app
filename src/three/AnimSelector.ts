import Action from "../global/Actions";
import { isArrayEqual } from "../global/Common";
import { Anim, AnimNode, Keyframe, Track } from "./anim/Anim";

export default class AnimSelector {
  anim: Anim | undefined = undefined;
  nodes: AnimNode[] = [];
  private oldNodes: AnimNode[] = [];
  onSelectChange = new Action<(nodes: AnimNode[]) => void>();

  constructor() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  setAnim(anim: Anim | undefined) {
    if (this.anim) {
      this.anim.onAddKeyframe = undefined;
    }
    this.anim = anim;
    if (this.anim) {
      this.anim.onAddKeyframe = this.onAddKeyframe.bind(this);
    }
    this.clear();
  }

  onAddKeyframe(keyframe: Keyframe) {
    this.selectByNodes([keyframe]);
  }

  onKeyDown(e: any) {
    if (!this.anim) return;
    if (this.nodes.length === 0) return;
    if (e.code === "Delete") {
      console.log();

      if (this.nodes[0] instanceof Track) {
        this.anim.removeTrack(this.nodes[0].uuid);
      } else if (this.nodes[0] instanceof Keyframe) {
        const keyframeUuids = this.nodes
          .filter((node) => node instanceof Keyframe)
          .map((keyframe) => keyframe.uuid);

        this.anim.removeKeyframe(keyframeUuids);
      }

      this.clear();
    }
  }

  clear() {
    if (this.nodes.length > 0) {
      this.nodes.forEach((node) => {
        node.setSelected(false);
        node.applySelectChange();
      });

      this.nodes.length = 0;
      this.notifySelectChange();
    }
  }

  selectByNodes(nodes: AnimNode[]) {
    if (!this.anim) return;

    this.setOldNodesUnselected();

    this.nodes.push(...nodes);

    const hasChange = this.setNodesSelectedAndApply();
    if (hasChange) this.notifySelectChange();
  }

  selectByUuids(uuids: string[]) {
    if (!this.anim) return;

    this.setOldNodesUnselected();

    this.anim.tracks.forEach((track) => {
      if (uuids.includes(track.uuid)) {
        this.nodes.push(track);
      }
      track.keyframes.forEach((keyframe) => {
        if (uuids.includes(keyframe.uuid)) {
          this.nodes.push(keyframe);
        }
      });
    });

    const hasChange = this.setNodesSelectedAndApply();
    if (hasChange) this.notifySelectChange();
  }

  selectByRange(tracks: Track[], frameIndexMin: number, frameIndexMax: number) {
    if (!this.anim) return;

    this.setOldNodesUnselected();

    tracks.forEach((track) => {
      track.keyframes.forEach((keyframe) => {
        if (
          keyframe.index >= frameIndexMin &&
          keyframe.index <= frameIndexMax
        ) {
          this.nodes.push(keyframe);
        }
      });
    });

    const hasChange = this.setNodesSelectedAndApply();
    if (hasChange) this.notifySelectChange();
  }

  isSelected(value: AnimNode | string): boolean {
    if (typeof value === "string") {
      return this.nodes.find((node) => node.uuid === value) !== undefined;
    } else if (value instanceof AnimNode) {
      return this.nodes.includes(value);
    }
    return false;
  }

  private setOldNodesUnselected() {
    this.oldNodes.length = 0;
    this.oldNodes = [...this.nodes];
    this.oldNodes.forEach((node) => {
      node.setSelected(false);
    });

    this.nodes.length = 0;
  }

  private setNodesSelectedAndApply(): boolean {
    this.nodes.forEach((node) => {
      node.setSelected(true);
    });

    if (isArrayEqual(this.oldNodes, this.nodes)) {
      return false;
    }

    this.oldNodes.forEach((node) => {
      node.applySelectChange();
    });
    this.nodes.forEach((node) => {
      node.applySelectChange();
    });

    return true;
  }

  private notifySelectChange() {
    this.onSelectChange.forEach((func) => {
      func(this.nodes);
    });
  }
}
