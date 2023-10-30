import Action from "../../global/Actions";
import { toDecimal2 } from "../../global/Common";
import { AnimNode } from "./AnimNode";
import { getDefaultAttrValue, keyframeIndexToTime } from "./AnimTool";
import { Keyframe } from "./Keyframe";
import { Track } from "./Track";

export { AnimNode } from "./AnimNode";
export { Keyframe } from "./Keyframe";
export { Track } from "./Track";

export class Anim {
  fps: number = 30;
  tracks: Track[];
  timeLength: number = 0;
  private _isDirty: boolean = false;

  onAddKeyframe: ((keyframes: Keyframe[]) => void) | undefined;
  onTracksChange = new Action<(tracks: Track[]) => void>();

  constructor(tracks: Track[] = []) {
    this.tracks = tracks;
  }

  addTrack(): void {
    const track = new Track({ attr: "position" });
    this.tracks.push(track);
    this.onTracksChange.forEach((func) => func(this.tracks));
    this._isDirty = true;
  }

  removeTrack(trackUuid: string): void {
    let hasChange = false;
    for (let i = this.tracks.length - 1; i >= 0; i--) {
      if (this.tracks[i].uuid === trackUuid) {
        this.tracks.splice(i, 1);
        hasChange = true;
      }
    }

    if (hasChange) {
      this.onTracksChange.forEach((func) => func(this.tracks));
      this._isDirty = true;
    }
  }

  addKeyframeByIndex(trackUuid: string, index: number) {
    const track = this.tracks.find((t) => t.uuid === trackUuid);
    if (!track) return;

    const _keyframe = track.keyframes.find((k) => k.index === index);
    if (_keyframe) return;

    const time = keyframeIndexToTime(index, this.fps);
    let text = "";
    let values: number[] | undefined = track.getValues(time, this.fps);

    if (values === undefined || values.length === 0) {
      text = getDefaultAttrValue(track.attr);
    } else {
      for (let i = 0; i < values.length; i++) {
        text += toDecimal2(values[i]);
        if (i < values.length - 1) {
          text += ", ";
        }
      }
    }

    const keyframe = new Keyframe(track, { index, text });
    track.keyframes.push(keyframe);

    track.sortKeyframes();
    this.calcTimeLength();

    track.nodifyKeyframeChange();
    this.onAddKeyframe?.([keyframe]);

    this._isDirty = true;
  }

  addKeyframes(keyframes: Keyframe[]) {
    const changedTracks: Track[] = [];

    keyframes.forEach((keyframe) => {
      const track = keyframe.track;
      const index = keyframe.index;

      for (let i = track.keyframes.length - 1; i >= 0; i--) {
        const _keyframe = track.keyframes[i];
        if (_keyframe.index === index) {
          track.keyframes.splice(i, 1);
        }
      }
      track.keyframes.push(keyframe);
      if (!changedTracks.includes(track)) changedTracks.push(track);
    });

    changedTracks.forEach((track) => {
      track.sortKeyframes();
      track.nodifyKeyframeChange();
    });
    this.calcTimeLength();

    this.onAddKeyframe?.(keyframes);

    this._isDirty = true;
  }

  // addKeyframe(
  //   track: string | Track | undefined,
  //   indexOrKeyframes: number | Keyframe[]
  // ): void {
  //   // if (typeof track === "string") {
  //   //   track = this.tracks.find((t) => t.uuid === track);
  //   // }
  //   // if (!track) return;

  //   // let addKeyframes: Keyframe[] = [];

  //   // if (typeof indexOrKeyframes === "number") {
  //   //   const index = indexOrKeyframes;
  //   // } else {
  //   //   addKeyframes = indexOrKeyframes;
  //   //   addKeyframes.forEach((keyframe) => {
  //   //     if (track instanceof Track) keyframe.track = track;
  //   //   });
  //   // }

  //   track.keyframes.push(...addKeyframes);

  //   track.sortKeyframes();
  //   this.calcTimeLength();

  //   track.onKeyframesChange.forEach((func) => {
  //     if (track instanceof Track) {
  //       func(track.keyframes);
  //     }
  //   });
  //   this.onAddKeyframe?.(addKeyframes);

  //   this._isDirty = true;
  // }

  moveKeyFrame(nodes: AnimNode[], offset: number): boolean {
    if (offset === 0) return false;
    if (nodes.length === 0) return false;

    let hasChange = false;

    this.tracks.forEach((track) => {
      const oldKeyframes: Keyframe[] = [];
      const newFrameIndices: number[] = [];

      track.keyframes.forEach((keyframe) => {
        if (nodes.includes(keyframe)) {
          keyframe.setIndex(keyframe.index + offset);
          newFrameIndices.push(keyframe.index);
          hasChange = true;
        } else {
          oldKeyframes.push(keyframe);
        }
      });

      let hasRemoveKeyframe = false;

      for (let i = track.keyframes.length - 1; i >= 0; i--) {
        const keyframe = track.keyframes[i];
        if (
          oldKeyframes.includes(keyframe) &&
          newFrameIndices.includes(keyframe.index)
        ) {
          track.keyframes.splice(i, 1);
          hasRemoveKeyframe = true;
        }
      }

      track.sortKeyframes();

      if (hasRemoveKeyframe) {
        track.nodifyKeyframeChange();
      }
    });

    if (hasChange) {
      this.calcTimeLength();
      this._isDirty = true;
    }

    return hasChange;
  }

  removeKeyframe(keyframeUUids: string[]) {
    let hasChange = false;

    this.tracks.forEach((track) => {
      const keyframes = track.keyframes;
      let _hasChange = false;
      for (let i = keyframes.length - 1; i >= 0; i--) {
        const keyframe = keyframes[i];
        if (keyframeUUids.includes(keyframe.uuid)) {
          keyframes.splice(i, 1);
          hasChange = _hasChange = true;
        }
      }
      if (_hasChange) {
        track.nodifyKeyframeChange();
      }
    });

    this._isDirty = hasChange;
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
    const attrs = {
      fps: this.fps,
      tracks: this.tracks.map((track) => track.toAttrs()),
    };
    return JSON.stringify(attrs, null, "\t");
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

  markDirty() {
    this._isDirty = true;
  }

  isDirty() {
    return this._isDirty || !this.tracks.every((track) => !track.isDirty());
  }

  cleanDirty() {
    this._isDirty = false;
    this.tracks.forEach((track) => track.cleanDirty());
  }
}
