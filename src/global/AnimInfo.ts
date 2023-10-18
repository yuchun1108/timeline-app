import { v4 as uuidv4 } from "uuid";

export interface AnimNode {
  discriminator: string;
  id: string;
}

export interface Channel extends AnimNode {
  discriminator: "channel";
  name: string;
  target: string;
  attr: string;
  keyframes: Keyframe[];
}

export interface Keyframe extends AnimNode {
  discriminator: "keyframe";
  index: number;
  value: any;
}
export class AnimInfo {
  public channels: Channel[];

  constructor(channels: Channel[] = []) {
    this.channels = channels;
  }

  addChannel(name: string = "channel"): void {
    this.channels.push({
      discriminator: "channel",
      name,
      target: "box",
      attr: "position",
      keyframes: [],
      id: uuidv4(),
    });
  }

  addKeyframe(channelId: string, index: number): void {
    const channel = this.channels.find((c) => c.id === channelId);
    if (!channel) return;

    const keyframe = channel.keyframes.find((k) => k.index === index);
    if (!keyframe) {
      const _keyframe: Keyframe = {
        discriminator: "keyframe",
        index: index,
        id: uuidv4(),
        value: "",
      };
      channel.keyframes.push(_keyframe);
    }
  }

  moveKeyFrame(nodes: AnimNode[], offset: number): boolean {
    if (offset === 0) return false;
    if (nodes.length === 0) return false;

    let hasChange = false;

    this.channels.forEach((channel) => {
      const oldKeyframes: Keyframe[] = [];
      const newFrameIndices: number[] = [];

      channel.keyframes.forEach((keyframe) => {
        if (nodes.includes(keyframe)) {
          keyframe.index += offset;
          newFrameIndices.push(keyframe.index);
          hasChange = true;
        } else {
          oldKeyframes.push(keyframe);
        }
      });

      for (let i = channel.keyframes.length - 1; i >= 0; i--) {
        const keyframe = channel.keyframes[i];
        if (
          oldKeyframes.includes(keyframe) &&
          newFrameIndices.includes(keyframe.index)
        ) {
          channel.keyframes.splice(i, 1);
        }
      }
    });

    return hasChange;
  }

  toJson(): string {
    function replacer(key: string, value: any) {
      if (key === "id") return undefined;
      else if (key === "discriminator") return undefined;
      else return value;
    }
    return JSON.stringify(this, replacer, "\t");
  }
}
