import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MyApp from "./MyApp";
import { AnimInfo, Keyframe } from "./global/AnimInfo";
import { v4 as uuidv4 } from "uuid";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const animInfo: AnimInfo = {
  channels: [
    {
      name: "channel-a",
      keyframes: [],
      id: uuidv4(),
    },
    {
      name: "channel-b",
      keyframes: [],
      id: uuidv4(),
    },
  ],
};

function onAddKeyFrame(channelId: string, index: number) {
  const channel = animInfo.channels.find((c) => c.id === channelId);
  if (channel === undefined) return;

  // console.log(channel.id);

  const keyframe = channel.keyframes.find((k) => k.index === index);
  if (keyframe === undefined) {
    // console.log("add key frame", index);
    const _keyframe: Keyframe = { index: index, id: uuidv4() };
    channel.keyframes.push(_keyframe);
    render();
  }
}

function onMoveKeyFrame(keyIds: string[], offset: number) {
  if (offset === 0) return;
  if (keyIds.length === 0) return;

  animInfo.channels.forEach((channel) => {
    const oldKeyframes: Keyframe[] = [];
    const newFrameIndices: number[] = [];

    channel.keyframes.forEach((keyframe) => {
      if (keyIds.includes(keyframe.id)) {
        keyframe.index += offset;
        newFrameIndices.push(keyframe.index);
      } else {
        oldKeyframes.push(keyframe);
      }
    });

    for(let i=channel.keyframes.length-1; i>=0 ;i--)
    {
      const keyframe = channel.keyframes[i];
      if(oldKeyframes.includes(keyframe) && newFrameIndices.includes(keyframe.index))
      {
        channel.keyframes.splice(i,1);
      }
    }
  });

  render();
}

function render() {
  root.render(
    <React.StrictMode>
      <MyApp
        animInfo={animInfo}
        onAddKeyFrame={onAddKeyFrame}
        onMoveKeyFrame={onMoveKeyFrame}
      />
    </React.StrictMode>
  );
}

render();
