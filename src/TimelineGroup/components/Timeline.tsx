/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactElement } from "react";
import FrameSize from "../../global/FrameSize";
import { AnimNode, Keyframe } from "../../three/anim/Anim";
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

const css_timeline = css`
  position: relative;
  border-bottom: solid 1px #232d30;
`;

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
      css={css_timeline}
      className="timeline"
      style={{
        width: props.frameSize.count * props.frameSize.width,
        height: props.frameSize.height - 1,
      }}
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
