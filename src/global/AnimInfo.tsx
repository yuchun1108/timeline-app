import { v4 as uuidv4 } from "uuid";

export interface AnimInfo {
  channels: Channel[];
}

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

export const animInfo: AnimInfo = {
  channels: [
    {
      discriminator: "channel",
      name: "channel-a",
      target: "box",
      attr: "position",
      keyframes: [],
      id: uuidv4(),
    },
    {
      discriminator: "channel",
      name: "channel-b",
      target: "box",
      attr: "position",
      keyframes: [],
      id: uuidv4(),
    },
  ],
};

export function addChannel() {
  animInfo.channels = [
    ...animInfo.channels,
    {
      discriminator: "channel",
      name: "new channel",
      target: "box",
      attr: "position",
      keyframes: [],
      id: uuidv4(),
    },
  ];
}

export function addKeyframe(channelId: string, index: number) {
  const channel = animInfo.channels.find((c) => c.id === channelId);
  if (!channel) return;

  const keyframe = channel.keyframes.find((k) => k.index === index);
  if (!keyframe) {
    const _keyframe: Keyframe = {
      discriminator: "keyframe",
      index: index,
      id: uuidv4(),
      value: "",
    };
    channel.keyframes = [
        ...channel.keyframes,
        _keyframe
    ]
  }
}
