import { useRef, ReactElement } from "react";
import TimelineBG from "./TimelineBG";
import KeyframeDot from "./KeyFrame";
import { AnimInfo, Channel, Keyframe } from "../../global/AnimInfo";

interface TimelineProps {
  width: number;
  height: number;
  frameCount: number;
  frameWidth: number;
  channel: Channel;
  index: number;
  selectedKeys: string[];
  dragOffset: number;
}

export default function Timeline(props: TimelineProps) {
  const keyFrameDots: ReactElement[] = [];

  props.channel.keyframes.forEach((keyframe) => {
    const isSelected = props.selectedKeys.includes(keyframe.id);
    if (!isSelected) {
      keyFrameDots.push(
        <KeyframeDot
          frameWidth={props.frameWidth}
          index={
            isSelected ? keyframe.index + props.dragOffset : keyframe.index
          }
          isSelected={isSelected}
          key={keyframe.id}
          keyframeId={keyframe.id}
        />
      );
    }
  });

  props.channel.keyframes.forEach((keyframe) => {
    const isSelected = props.selectedKeys.includes(keyframe.id);
    if (isSelected) {
      keyFrameDots.push(
        <KeyframeDot
          frameWidth={props.frameWidth}
          index={
            isSelected ? keyframe.index + props.dragOffset : keyframe.index
          }
          isSelected={isSelected}
          key={keyframe.id}
          keyframeId={keyframe.id}
        />
      );
    }
  });

  return (
    <div
      className="timeline"
      style={{ width: props.width, height: props.height }}
      data-channelid={props.channel.id}
      data-index={props.index}
    >
      <TimelineBG
        channelId={props.channel.id}
        frameCount={props.frameCount}
        frameWidth={props.frameWidth}
        width={props.width}
        height={props.height}
        index={props.index}
      />
      {keyFrameDots}
    </div>
  );
}
