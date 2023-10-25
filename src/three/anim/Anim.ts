import { toDecimal2 } from "../../global/Common";
import { AnimNode } from "./AnimNode";
import { keyframeIndexToTime } from "./AnimTool";
import { Keyframe } from "./Keyframe";
import { Track } from "./Track";

export type { AnimNode } from "./AnimNode";
export { Keyframe } from "./Keyframe";
export { Track } from "./Track";

export class Anim {
  fps: number = 30;
  tracks: Track[];
  timeLength: number = 0;
  isDirty: boolean = false;

  onAddKeyframe: ((keyframe: Keyframe) => void) | undefined;

  constructor(tracks: Track[] = []) {
    this.tracks = tracks;
  }

  addTrack(): void {
    const track = new Track({ attr: "position" });
    this.tracks.push(track);
    this.isDirty = true;
  }

  removeTrack(trackUuid: string): void {
    for (let i = this.tracks.length - 1; i >= 0; i--) {
      if (this.tracks[i].uuid === trackUuid) {
        this.tracks.splice(i, 1);
      }
    }
  }

  addKeyframe(trackUuid: string, index: number): void {
    const track = this.tracks.find((t) => t.uuid === trackUuid);
    if (!track) return;

    const _keyframe = track.keyframes.find((k) => k.index === index);
    if (_keyframe) return;

    const time = keyframeIndexToTime(index, this.fps);
    let text = "";
    let values: number[] | undefined = track.getValue(time, this.fps);

    if (values === undefined || values.length === 0) {
      text = "";
    } else {
      for (let i = 0; i < values.length; i++) {
        text += toDecimal2(values[i]);
        if (i < values.length - 1) {
          text += ", ";
        }
      }
    }

    const keyframe: Keyframe = new Keyframe(track, { index, text });
    track.keyframes.push(keyframe);

    track.sortKeyframes();
    this.calcTimeLength();

    this.onAddKeyframe?.(keyframe);

    this.isDirty = true;
  }

  moveKeyFrame(nodes: AnimNode[], offset: number): boolean {
    if (offset === 0) return false;
    if (nodes.length === 0) return false;

    let hasChange = false;

    this.tracks.forEach((track) => {
      const oldKeyframes: Keyframe[] = [];
      const newFrameIndices: number[] = [];

      track.keyframes.forEach((keyframe) => {
        if (nodes.includes(keyframe)) {
          keyframe.index += offset;
          newFrameIndices.push(keyframe.index);
          hasChange = true;
        } else {
          oldKeyframes.push(keyframe);
        }
      });

      for (let i = track.keyframes.length - 1; i >= 0; i--) {
        const keyframe = track.keyframes[i];
        if (
          oldKeyframes.includes(keyframe) &&
          newFrameIndices.includes(keyframe.index)
        ) {
          track.keyframes.splice(i, 1);
        }
      }

      track.sortKeyframes();
    });

    if (hasChange) {
      this.calcTimeLength();
      this.isDirty = true;
    }

    return hasChange;
  }

  removeKeyframe(keyframeUUids: string[]) {
    let hasChange = false;

    this.tracks.forEach((track) => {
      const keyframes = track.keyframes;
      for (let i = keyframes.length - 1; i >= 0; i--) {
        const keyframe = keyframes[i];
        if (keyframeUUids.includes(keyframe.uuid)) {
          keyframes.splice(i, 1);
          hasChange = true;
        }
      }
    });

    this.isDirty = hasChange;
  }

  private calcTimeLength() {
    this.timeLength = 0;
    this.tracks.forEach((track) => {
      if (track.keyframes.length === 0) return;
      const lastKeyframe = track.keyframes[track.keyframes.length - 1];
      const lastKeyframeTime = keyframeIndexToTime(
        lastKeyframe.index,
        this.fps
      );
      this.timeLength = Math.max(this.timeLength, lastKeyframeTime);
    });
  }

  toJson(): string {
    function replacer(key: string, value: any) {
      if (
        key === "timeLength" ||
        key === "parent" ||
        key === "uuid" ||
        key === "isDirty" ||
        key === "isCorrect" ||
        key === "lastIsCorrect"
      )
        return undefined;
      else return value;
    }
    return JSON.stringify(this, replacer, "\t");
  }

  fromJson(text: string) {
    const json = JSON.parse(text);
    const { tracks, ...anim } = json;
    Object.assign(this, anim);

    const tracksLen = tracks ? tracks.length : 0;

    this.tracks = new Array(tracksLen);
    for (let i = 0; i < tracksLen; i++) {
      this.tracks[i] = new Track(tracks[i]);
      this.tracks[i].sortKeyframes();
    }

    this.calcTimeLength();
  }

  apply(obj: THREE.Object3D, time: number) {
    this.tracks.forEach((track) => {
      track.apply(obj, time, this.fps);
    });
  }

  setDirty() {
    this.isDirty = true;
  }
}
