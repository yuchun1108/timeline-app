/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactElement, useCallback, useEffect, useState } from "react";
import FrameSize from "../../global/FrameSize";
import AnimSelector from "../../three/AnimSelector";
import { Keyframe, Track } from "../../three/anim/Anim";
import KeyframeDot from "./KeyFrameDot";
import TimelineBG from "./TimelineBG";

interface TimelineProps {
  frameSize: FrameSize;
  track: Track;
  index: number;
  moveOffset: number;
  selector: AnimSelector;
}

const css_timeline = css`
  position: relative;
  border-bottom: solid 1px #232d30;
`;

export default function Timeline(props: TimelineProps) {
  const { track } = props;

  const [keyframes, setKeyframes] = useState<Keyframe[]>([...track.keyframes]);
  const [tempKeyframes, setTempKeyframes] = useState<Keyframe[]>([
    ...track.cloneKeyframes,
  ]);

  const onKeyframesChange = useCallback(
    (keyframes: Keyframe[], tempKeyframes: Keyframe[]) => {
      setKeyframes([...keyframes]);
      setTempKeyframes([...tempKeyframes]);
    },
    []
  );

  useEffect(() => {
    track.onKeyframesChange.add(onKeyframesChange);
    return () => {
      track.onKeyframesChange.remove(onKeyframesChange);
    };
  }, [track]);

  const keyFrameDots: ReactElement[] = [];

  if (keyframes) {
    keyframes.forEach((keyframe) => {
      const isSelected = props.selector.isSelected(keyframe);
      if (!isSelected) {
        keyFrameDots.push(
          <KeyframeDot
            frameSize={props.frameSize}
            keyframe={keyframe}
            key={keyframe.uuid}
            moveOffset={props.moveOffset}
          />
        );
      }
    });

    keyframes.forEach((keyframe) => {
      const isSelected = props.selector.isSelected(keyframe);
      if (isSelected) {
        keyFrameDots.push(
          <KeyframeDot
            frameSize={props.frameSize}
            keyframe={keyframe}
            key={keyframe.uuid}
            moveOffset={props.moveOffset}
          />
        );
      }
    });

    tempKeyframes.forEach((keyframe) => {
      keyFrameDots.push(
        <KeyframeDot
          frameSize={props.frameSize}
          keyframe={keyframe}
          key={keyframe.uuid}
          moveOffset={0}
        />
      );
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
      data-trackuuid={track.uuid}
      data-index={props.index}
    >
      <TimelineBG
        trackUuid={track.uuid}
        frameSize={props.frameSize}
        index={props.index}
      />
      {keyFrameDots}
    </div>
  );
}
