import { ReactElement } from "react";
import { AnimNode, Keyframe } from "../../global/AnimInfo";
import KeyframeDot from "./KeyFrame";
import TimelineBG from "./TimelineBG";

interface TimelineProps {
  width: number;
  height: number;
  frameCount: number;
  frameWidth: number;
  channelId: string;
  keyframes: Keyframe[];
  index: number;
  selectedNodes: AnimNode[];
  moveOffset: number;
}

export default function Timeline(props: TimelineProps) {
  const { keyframes } = props;

  console.log("refresh timeline");
  // const [keyframes, setKeyframes] = useState<Keyframe[]>(props.channel.keyframes);

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
            frameWidth={props.frameWidth}
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
            frameWidth={props.frameWidth}
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
      style={{ width: props.width, height: props.height }}
      data-channelid={props.channelId}
      data-index={props.index}
    >
      <TimelineBG
        channelId={props.channelId}
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
