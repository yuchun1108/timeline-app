import { ReactElement } from "react";
import { AnimNode, Keyframe } from "../../global/AnimInfo";
import FrameSize from "../../global/FrameSize";
import KeyframeDot from "./KeyFrame";
import TimelineBG from "./TimelineBG";

interface TimelineProps {
  frameSize: FrameSize;
  channelId: string;
  keyframes: Keyframe[];
  index: number;
  selectedNodes: AnimNode[];
  moveOffset: number;
}

export default function Timeline(props: TimelineProps) {
  const { keyframes } = props;

  const keyFrameDots: ReactElement[] = [];

  if (keyframes) {
    keyframes.forEach((keyframe) => {
      const isSelected =
        props.selectedNodes !== null
          ? props.selectedNodes.includes(keyframe)
          : false;
      if (!isSelected) {
        keyFrameDots.push(
          <KeyframeDot
            frameWidth={props.frameSize.width}
            index={
              isSelected ? keyframe.index + props.moveOffset : keyframe.index
            }
            isSelected={isSelected}
            key={keyframe.id}
            keyframeId={keyframe.id}
          />
        );
      }
    });

    keyframes.forEach((keyframe) => {
      const isSelected =
        props.selectedNodes !== null
          ? props.selectedNodes.includes(keyframe)
          : false;
      if (isSelected) {
        keyFrameDots.push(
          <KeyframeDot
            frameWidth={props.frameSize.width}
            index={
              isSelected ? keyframe.index + props.moveOffset : keyframe.index
            }
            isSelected={isSelected}
            key={keyframe.id}
            keyframeId={keyframe.id}
          />
        );
      }
    });
  }

  return (
    <div
      className="timeline"
      style={{ width: "100%", height: props.frameSize.height }}
      data-channelid={props.channelId}
      data-index={props.index}
    >
      <TimelineBG
        channelId={props.channelId}
        frameSize={props.frameSize}
        index={props.index}
      />
      {keyFrameDots}
    </div>
  );
}
