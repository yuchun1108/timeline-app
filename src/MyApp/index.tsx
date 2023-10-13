import "./index.css";
import { useEffect, useRef, useState } from "react";
import { AnimInfo, Keyframe } from ".././global/AnimInfo";
import TimelineGroup from "./components/TimelineGroup";

interface MyAppProps {
  animInfo: AnimInfo;
  onAddKeyFrame: (channelId: string, index: number) => void;
  onMoveKeyFrame: (uuids: string[], offset: number) => void;
}

export default function MyApp(props: MyAppProps) {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    function onWindowResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener("resize", onWindowResize);
  }, []);

  function onKeyframeSelect(channelIds:string[],frameIndexMin:number,frameIndexMax:number) {

    const _selectedKeys = [];

    for(let i=0; i<props.animInfo.channels.length; i++)
    {
      const channel = props.animInfo.channels[i];
      if(channelIds.includes(channel.id))
      {
        for(let j=0; j<channel.keyframes.length; j++)
        {
          const keyframe = channel.keyframes[j];
          if(keyframe.index >= frameIndexMin && keyframe.index <= frameIndexMax)
          {
            _selectedKeys.push(keyframe.id);
          }
        }
      }
    }

    setSelectedKeys(_selectedKeys);
  }

  return (
    <div
      id="my-app"
      style={{ width: innerWidth }}
    >
      <TimelineGroup 
        width={innerWidth}
        selectedKeys={selectedKeys}
        channels={props.animInfo.channels}
        onAddKeyFrame={props.onAddKeyFrame}
        onMoveKeyFrame={props.onMoveKeyFrame}
        onKeyframeSelect={onKeyframeSelect}
      />
    </div>
  );
}
