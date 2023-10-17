import { useRef, ReactElement, useState } from "react";
import TimelineBG from "./TimelineBG";
import KeyframeDot from "./KeyFrame";
import { AnimInfo,AnimNode, Channel, Keyframe } from "../../global/AnimInfo";

interface TimelineProps {
  width: number;
  height: number;
  frameCount: number;
  frameWidth: number;
  channel: Channel;
  index: number;
  selectedNodes: AnimNode[];
  dragOffset: number;
}

export default function Timeline(props: TimelineProps) {

  const [keyframes, setKeyframes] = useState<Keyframe[]>(props.channel.keyframes);

  const keyFrameDots: ReactElement[] = [];

  keyframes.forEach((keyframe) => {
    const isSelected = props.selectedNodes !== null ? props.selectedNodes.includes(keyframe) : false;
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

  keyframes.forEach((keyframe) => {
    const isSelected = props.selectedNodes !== null ? props.selectedNodes.includes(keyframe) : false;
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
