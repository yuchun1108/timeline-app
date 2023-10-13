import "./index.css";
import { useEffect, useRef, useState } from "react";
import { AnimInfo, AnimNode,Channel, Keyframe } from ".././global/AnimInfo";
import TimelineGroup from "./components/TimelineGroup";
import NameLabelGroup from "./components/NameLabelGroup";
import Inspector from "./components/Inspector";

interface MyAppProps {
  animInfo: AnimInfo;
  onAddKeyFrame: (channelId: string, index: number) => void;
  onMoveKeyFrame: (nodes: AnimNode[], offset: number) => void;
}

export default function MyApp(props: MyAppProps) {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [selectedNodes, setSelectedNodes] = useState<AnimNode[] | null>(null);
  // const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    function onWindowResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener("resize", onWindowResize);
  }, []);

  function onChannelSelect(channel:Channel){
    setSelectedNodes([channel]);
  }

  function onKeyframeSelect(
    channelIds: string[],
    frameIndexMin: number,
    frameIndexMax: number
  ) {
    const _selectedNodes:AnimNode[] = [];

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

    setSelectedNodes(_selectedNodes);
  }

  // for(let i=0;i<objs.length;i++)
  // {
  //   const obj = objs[i];
  //   console.log(obj instanceof Channel);
  // }

  const timelineHeight = 20;

  return (
    <div id="my-app" style={{ width: innerWidth }}>
      <NameLabelGroup
        height={timelineHeight}
        selectedNodes = {selectedNodes}
        channels={props.animInfo.channels}
        onChannelSelect={onChannelSelect}
      />

      <TimelineGroup
        width={innerWidth - 72}
        timelineHeight={timelineHeight}
        // selectedKeys={selectedKeys}
        selectedNodes = {selectedNodes}
        channels={props.animInfo.channels}
        onAddKeyFrame={props.onAddKeyFrame}
        onMoveKeyFrame={props.onMoveKeyFrame}
        onKeyframeSelect={onKeyframeSelect}
      />

      <Inspector selectedNodes={selectedNodes}/>
    </div>
  );
}
