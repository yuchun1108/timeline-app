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
  const [isCorrect, setIsCorrect] = useState(
    props.keyframe.values !== undefined
  );

  useEffect(() => {
    props.keyframe.onValuesChange = (values) => {
      setIsCorrect(values !== undefined);
    };

    return () => {
      props.keyframe.onValuesChange = undefined;
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
