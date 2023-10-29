import Action from "../global/Actions";
import { isArrayEqual } from "../global/Common";
import { Anim, AnimNode, Keyframe, Track } from "./anim/Anim";
import AnimController from "./anim/AnimController";
import { animTimeToFrameIndex } from "./anim/AnimTool";

export default class AnimSelector {
  animController: AnimController | undefined = undefined;
  anim: Anim | undefined = undefined;
  nodes: AnimNode[] = [];
  private oldNodes: AnimNode[] = [];
  onSelectChange = new Action<(nodes: AnimNode[]) => void>();

  constructor() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("copy", this.onCopy.bind(this));
    window.addEventListener("paste", this.onPaste.bind(this));
  }

  setAnim(anim: Anim | undefined, animController: AnimController | undefined) {
    if (this.anim) {
      this.anim.onAddKeyframe = undefined;
    }
    this.anim = anim;
    if (this.anim) {
      this.anim.onAddKeyframe = this.onAddKeyframe.bind(this);
    }

    this.animController = animController;
    this.clear();
  }

  onAddKeyframe(keyframes: Keyframe[]) {
    this.selectByNodes(keyframes);
  }

  onKeyDown(e: KeyboardEvent) {
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

  onCopy(e: any) {
    if (!this.animController || !this.anim) return;

    if (this.nodes.length > 0) {
      e.preventDefault();

      const firstNode = this.nodes[0];
      if (!(firstNode instanceof Keyframe)) return;

      const baseIndex = firstNode.index;

      const nodeAttrArr: any[] = [];

      this.nodes.forEach((node) => {
        if (node instanceof Keyframe) {
          const attr = node.toAttrs();
          attr.index -= baseIndex;
          attr.trackUuid = node.track.uuid;
          nodeAttrArr.push(attr);
        }
      });

      const jsonStr = JSON.stringify(nodeAttrArr, null, "\t");

      console.log(jsonStr);

      e.clipboardData.setData("text", jsonStr);
    }
  }

  onPaste(e: any) {
    if (!this.animController || !this.anim) return;

    const jsonStr = e.clipboardData.getData("text");
    console.log(jsonStr);

    const baseIndex = animTimeToFrameIndex(
      this.animController.animTime,
      this.anim.fps
    );

    try {
      const nodeAttrArr = JSON.parse(jsonStr);
      if (Array.isArray(nodeAttrArr)) {
        const addKeyframes: Keyframe[] = [];
        nodeAttrArr.forEach((attr) => {
          const track = this.findTrackFromAttr(attr);
          if (!track) return;

          attr.index += baseIndex;

          const keyframe = new Keyframe(track, attr);
          addKeyframes.push(keyframe);
        });
        this.anim?.addKeyframes(addKeyframes);
      }
    } catch (e) {}
  }

  private findTrackFromAttr(attr: any): Track | undefined {
    const trackUuid = attr.trackUuid;
    if (!trackUuid) return undefined;

    const track = this.anim?.tracks.find((track) => track.uuid === trackUuid);
    if (!track) return undefined;
    attr.trackUuid = undefined;

    return track;
  }

  clear() {
    if (this.nodes.length > 0) {
      this.nodes.forEach((node) => {
        node.setSelectState(0);
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

    const firstNode = this.nodes.length > 0 ? this.nodes[0] : undefined;

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

    if (firstNode) {
      const i = this.nodes.indexOf(firstNode);
      if (i >= 0) {
        this.nodes.splice(i, 1);
      }
      this.nodes.unshift(firstNode);
    }

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
      node.setSelectState(0);
    });

    this.nodes.length = 0;
  }

  private setNodesSelectedAndApply(): boolean {
    this.nodes.forEach((node) => {
      node.setSelectState(1);
    });

    if (this.nodes.length > 0) {
      this.nodes[0].setSelectState(2);
    }

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
