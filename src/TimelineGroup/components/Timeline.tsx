import { ReactElement } from "react";
import FrameSize from "../../global/FrameSize";
import { AnimNode, Keyframe } from "../../three/Anim";
import KeyframeDot from "./KeyFrameDot";
import TimelineBG from "./TimelineBG";

interface TimelineProps {
  frameSize: FrameSize;
  trackUuid: string;
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
            frameSize={props.frameSize}
            index={
              isSelected ? keyframe.index + props.moveOffset : keyframe.index
            }
            isSelected={isSelected}
            keyframe={keyframe}
            key={keyframe.uuid}
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
            frameSize={props.frameSize}
            index={
              isSelected ? keyframe.index + props.moveOffset : keyframe.index
            }
            isSelected={isSelected}
            keyframe={keyframe}
            key={keyframe.uuid}
          />
        );
      }
    });
  }

  return (
    <div
      className="timeline"
      style={{ width: "100%", height: props.frameSize.height }}
      data-trackuuid={props.trackUuid}
      data-index={props.index}
    >
      <TimelineBG
        trackUuid={props.trackUuid}
        frameSize={props.frameSize}
        index={props.index}
      />
      {keyFrameDots}
    </div>
  );
}
