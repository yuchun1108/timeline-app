import { useEffect, useRef, useState } from "react";
import {
  AnimInfo,
  AnimNode,
  Channel,
  Keyframe,
  addChannel,
  animInfo,
} from "../global/AnimInfo";
import TimelineGroup from "../TimelineGroup";
import NameLabelGroup from "./components/NameLabelGroup";
import Inspector from "../Inspector";
import Controller from "./components/Controller";

interface MyAppProps {
  animInfo: AnimInfo;
}

export default function MyApp(props: MyAppProps) {
  const [channels, setChannels] = useState<Channel[]>(props.animInfo.channels);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [selectedNodes, setSelectedNodes] = useState<AnimNode[]>([]);
  // const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    function onWindowResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener("resize", onWindowResize);
  }, []);

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
      if (prev.length === 0 && _selectedNodes.length === 0) return prev;
      return _selectedNodes;
    });
  }

  // for(let i=0;i<objs.length;i++)
  // {
  //   const obj = objs[i];
  //   console.log(obj instanceof Channel);
  // }

  function onAddChannel() {
    addChannel();
    setChannels(props.animInfo.channels);
  }

  const timelineHeight = 20;

  return (
      <div id="my-app" style={{ width: innerWidth }}>
        <Controller onAddChannel={onAddChannel} />
        <NameLabelGroup
          height={timelineHeight}
          selectedNodes={selectedNodes}
          channels={channels}
          onChannelSelect={onChannelSelect}
        />

        <TimelineGroup
          width={innerWidth - 72}
          timelineHeight={timelineHeight}
          // selectedKeys={selectedKeys}
          selectedNodes={selectedNodes}
          channels={channels}
          onKeyframeSelect={onKeyframeSelect}
        />

        <Inspector
          selectedNodes={selectedNodes}
          key={selectedNodes.length > 0 ? selectedNodes[0].id : "empty"}
        />
      </div>
  );
}
