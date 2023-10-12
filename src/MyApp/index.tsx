import "./index.css";
import Timeline from "./components/Timeline";
import { useEffect, useState } from "react";
import { AnimInfo, Keyframe } from ".././global/AnimInfo";

interface MyAppProps {
  animInfo: AnimInfo;
  onAddKeyFrame: (channelId: string, index: number) => void;
  onMoveKeyFrameIndex: (uuids: string[], offset: number) => void;
}

export default function MyApp(props: MyAppProps) {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [dragIndexOffset, setDragIndexOffset] = useState(0);

  useEffect(() => {
    function onWindowResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener("resize", onWindowResize);
  }, []);

  function onKeyFrameSelect(channelId: string, index: number) {
    const channel = props.animInfo.channels.find((c) => c.id === channelId);

    if (channel !== undefined) {
      channel.keyframes.forEach((keyframe) => {
        if (keyframe.index === index) {
          setSelectedKeys([keyframe.id]);
        }
      });
    }
  }

  function onDragIndexMove(offset: number) {
    setDragIndexOffset(offset);
  }

  function onDragIndexEnd() {
    props.onMoveKeyFrameIndex(selectedKeys, dragIndexOffset);
    setDragIndexOffset(0);
  }

  return (
    <div id="my-app" style={{ width: innerWidth }}>
      {props.animInfo.channels.map((channel) => (
        <Timeline
          width={innerWidth}
          channel={channel}
          key={channel.id}
          selectedKeys={selectedKeys}
          dragIndexOffset={dragIndexOffset}
          onAddKeyFrame={props.onAddKeyFrame}
          onKeyFrameSelect={onKeyFrameSelect}
          onDragIndexMove={onDragIndexMove}
          onDragIndexEnd={onDragIndexEnd}
        />
      ))}
    </div>
  );
}
