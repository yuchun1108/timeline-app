import { useState } from "react";
import Inspector from "../Inspector";
import TimelineGroup from "../TimelineGroup";
import { AnimInfo, AnimNode, Channel } from "../global/AnimInfo";
import { isArrayEqual } from "../global/Common";
import Controller from "./components/Controller";
import NameLabelGroup from "./components/NameLabelGroup";

interface MyAppProps {
  animInfo: AnimInfo;
}

export default function MyApp(props: MyAppProps) {
  const [channels, setChannels] = useState<Channel[]>(props.animInfo.channels);

  const [selectedNodes, setSelectedNodes] = useState<AnimNode[]>([]);

  function onChannelSelect(channel: Channel) {
    setSelectedNodes([channel]);
  }

  function onKeyframeSelect(
    channelIds: string[],
    frameIndexMin: number,
    frameIndexMax: number
  ) {
    const _selectedNodes: AnimNode[] = [];

    for (let i = 0; i < props.animInfo.channels.length; i++) {
      const channel = props.animInfo.channels[i];
      if (channelIds.includes(channel.id)) {
        for (let j = 0; j < channel.keyframes.length; j++) {
          const keyframe = channel.keyframes[j];
          if (
            keyframe.index >= frameIndexMin &&
            keyframe.index <= frameIndexMax
          ) {
            _selectedNodes.push(keyframe);
          }
        }
      }
    }
    setSelectedNodes((prev) => {
      if (isArrayEqual(prev, _selectedNodes)) {
        console.log("is same");
        return prev;
      }
      console.log("is not same");
      return _selectedNodes;
    });
  }

  // for(let i=0;i<objs.length;i++)
  // {
  //   const obj = objs[i];
  //   console.log(obj instanceof Channel);
  // }

  function onAddChannel() {
    props.animInfo.addChannel();
    setChannels(props.animInfo.channels);
  }

  const timelineHeight = 20;

  return (
    <div id="my-app">
      <Controller onAddChannel={onAddChannel} />
      <NameLabelGroup
        height={timelineHeight}
        selectedNodes={selectedNodes}
        channels={channels}
        onChannelSelect={onChannelSelect}
      />

      <TimelineGroup
        // width={innerWidth - 72}
        timelineHeight={timelineHeight}
        // selectedKeys={selectedKeys}
        selectedNodes={selectedNodes}
        animInfo={props.animInfo}
        channels={channels}
        onKeyframeSelect={onKeyframeSelect}
      />

      <Inspector
        animInfo={props.animInfo}
        selectedNodes={selectedNodes}
        key={selectedNodes.length > 0 ? selectedNodes[0].id : "empty"}
      />
    </div>
  );
}
