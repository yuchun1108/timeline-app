import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MyApp from "./MyApp";
import { AnimInfo,AnimNode, Keyframe } from "./global/AnimInfo";
import { v4 as uuidv4 } from "uuid";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const animInfo: AnimInfo = {
  channels: [
    {
      discriminator: "channel",
      name: "channel-a",
      target:"box",
      attr:"position",
      keyframes: [],
      id: uuidv4(),
    },
    {
      discriminator: "channel",
      name: "channel-b",
      target:"box",
      attr:"position",
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
    const _keyframe: Keyframe = { discriminator:"keyframe", index: index, id: uuidv4() ,value:""};
    channel.keyframes.push(_keyframe);
    render();
  }
}

function onMoveKeyFrame(nodes:AnimNode[], offset: number) {
  if (offset === 0) return;
  if (nodes.length === 0) return;

  // nodes.forEach(node=>{

  //   if(node.discriminator === "keyframe")
  //   {
  //     const keyframe = node as Keyframe;
  //     keyframe.index += offset;
  //   }
  // });

  animInfo.channels.forEach((channel) => {
    const oldKeyframes: Keyframe[] = [];
    const newFrameIndices: number[] = [];

    channel.keyframes.forEach((keyframe) => {
      if (nodes.includes(keyframe)) {
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
