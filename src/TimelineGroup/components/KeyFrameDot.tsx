import { useEffect, useState } from "react";
import FrameSize from "../../global/FrameSize";
import { Keyframe } from "../../three/Anim";

interface KeyframeProps {
  frameSize: FrameSize;
  // frameWidth: number;
  isSelected: boolean;
  keyframe: Keyframe;

  index: number;
  // keyframeUuid: string;
  // isCorrect: boolean;
}

export default function KeyframeDot(props: KeyframeProps) {
  const [isCorrect, setIsCorrect] = useState(props.keyframe.isCorrect);

  useEffect(() => {
    props.keyframe.onIsCorrectChange = (_isCorrect) => {
      setIsCorrect(_isCorrect);
    };

    return () => {
      props.keyframe.onIsCorrectChange = undefined;
    };
  }, []);

  function onDragStart(e: any) {
    e.preventDefault();
    return false;
  }

  let className = "keyframe";
  if (props.isSelected) className += " selected";
  if (!isCorrect) className += " incorrect";

  return (
    <div
      className={className}
      style={{
        left: props.frameSize.width * (props.index + 0.5) - 5,
      }}
      data-keyframeuuid={props.keyframe.uuid}
      onDragStart={onDragStart}
    ></div>
  );
}
