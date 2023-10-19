import { v4 as uuidv4 } from "uuid";

export interface Anim {
  discriminator: string;
  uuid: string;
}

export interface Track extends Anim {
  discriminator: "track";
  name: string;
  target: string;
  attr: string;
  keyframes: Keyframe[];
}

export interface Keyframe extends Anim {
  discriminator: "keyframe";
  index: number;
  value: any;
}
export class AnimInfo {
  public tracks: Track[];

  constructor(tracks: Track[] = []) {
    this.tracks = tracks;
  }

  addTrack(name: string = "track"): void {
    this.tracks.push({
      discriminator: "track",
      name,
      target: "box",
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
    }
  }

  moveKeyFrame(nodes: Anim[], offset: number): boolean {
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
    });

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
}
