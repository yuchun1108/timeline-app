import { inverseLerp, lerp } from "three/src/math/MathUtils";
import { v4 as uuidv4 } from "uuid";
import { onlyNumbers } from "./Common";

export interface AnimNode {
  discriminator: string;
  uuid: string;
}

export interface Track extends AnimNode {
  discriminator: "track";
  name: string;
  attr: string;
  keyframes: Keyframe[];
}

export interface Keyframe extends AnimNode {
  discriminator: "keyframe";
  index: number;
  value: any;
}
export class Anim {
  fps: number = 24;
  tracks: Track[];
  timeLength: number = 0;

  constructor(tracks: Track[] = []) {
    this.tracks = tracks;
  }

  addTrack(name: string = "new track"): void {
    this.tracks.push({
      discriminator: "track",
      name,
      attr: "position",
      keyframes: [],
      uuid: uuidv4(),
    });
  }

  addKeyframe(trackUuid: string, index: number): void {
    const track = this.tracks.find((t) => t.uuid === trackUuid);
    if (!track) return;

    const keyframe = track.keyframes.find((k) => k.index === index);
    if (!keyframe) {
      const _keyframe: Keyframe = {
        discriminator: "keyframe",
        index: index,
        uuid: uuidv4(),
        value: "",
      };
      track.keyframes.push(_keyframe);

      this.sortKeyframes(track);
      this.calcTimeLength();
    }
  }

  private sortKeyframes(track: Track) {
    track.keyframes.sort((a, b) => a.index - b.index);
  }

  private calcTimeLength() {
    this.timeLength = 0;
    this.tracks.forEach((track) => {
      if (track.keyframes.length === 0) return;
      const lastKeyframe = track.keyframes[track.keyframes.length - 1];
      const lastKeyframeTime = this.keyframeIndexToTime(lastKeyframe.index);
      this.timeLength = Math.max(this.timeLength, lastKeyframeTime);
    });
    console.log("timeLength", this.timeLength);
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

      this.sortKeyframes(track);
    });

    if (hasChange) this.calcTimeLength();

    return hasChange;
  }

  toJson(): string {
    function replacer(key: string, value: any) {
      if (key === "uuid") return undefined;
      else if (key === "discriminator") return undefined;
      else return value;
    }
    return JSON.stringify(this, replacer, "\t");
  }

  apply(obj: THREE.Object3D, time: number) {
    this.tracks.forEach((track) => {
      this.applyTrack(obj, track, time);
    });
  }

  private applyTrack(obj: THREE.Object3D, track: Track, time: number) {
    switch (track.attr) {
      case "position":
        const value = this.getTrackValue(track, time);
        if (Array.isArray(value) && value.length === 3) {
          obj.position.set(value[0], value[1], value[2]);
        }
        break;
    }
  }

  keyframeIndexToTime(index: number): number {
    return index / this.fps;
  }

  getTrackValue(
    track: Track,
    time: number
  ): undefined | number | Array<number> {
    const { keyframes } = track;

    let keyA: Keyframe | undefined = undefined;
    let keyB: Keyframe | undefined = undefined;
    let p: number = 0;

    if (keyframes.length === 0) return undefined;
    else if (keyframes.length === 1) keyA = keyB = track.keyframes[0];
    else if (time <= this.keyframeIndexToTime(keyframes[0].index)) {
      keyA = keyB = keyframes[0];
    } else if (
      time >= this.keyframeIndexToTime(keyframes[keyframes.length - 1].index)
    ) {
      keyA = keyB = keyframes[keyframes.length - 1];
    } else {
      for (let i = 0; i < keyframes.length - 1; i++) {
        const _keyA = keyframes[i];
        const _keyB = keyframes[i + 1];
        const _timeA = this.keyframeIndexToTime(_keyA.index);
        const _timeB = this.keyframeIndexToTime(_keyB.index);

        if (time >= _timeA && time < _timeB) {
          keyA = _keyA;
          keyB = _keyB;
          p = inverseLerp(_timeA, _timeB, time);
          break;
        }
      }
    }

    if (!keyA || !keyB) return undefined;

    try {
      const valueA = JSON.parse(keyA.value);
      const valueB = JSON.parse(keyB.value);

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return lerp(valueA, valueB, p);
      } else if (Array.isArray(valueA) && Array.isArray(valueB)) {
        if (
          valueA.length === valueB.length &&
          onlyNumbers(valueA) &&
          onlyNumbers(valueB)
        ) {
          const arr = new Array<number>(valueA.length);
          for (let i = 0; i < arr.length; i++) {
            arr[i] = lerp(valueA[i], valueB[i], p);
          }
          return arr;
        }
      }
    } catch (e) {}

    return undefined;
  }
}
