/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import { useEffect, useState } from "react";
import FrameSize from "../../global/FrameSize";
import { Keyframe } from "../../three/anim/Anim";

interface KeyframeProps {
  frameSize: FrameSize;
  isSelected: boolean;
  keyframe: Keyframe;
  index: number;
}

const css_keyframe = css`
  position: absolute;
  top: 4px;
  width: 11px;
  height: 11px;
  background-image: url("/image/keyframe.png");
`;

const css_keyframe_selected = css`
  ${css_keyframe}
  background-image: url("/image/keyframe-selected.png");
`;

const css_keyframe_error = css`
  ${css_keyframe}
  background-image: url("/image/keyframe-error.png");
`;

const css_keyframe_error_selected = css`
  ${css_keyframe}
  background-image: url("/image/keyframe-selected-error.png");
`;

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
  }, [props.keyframe]);

  function onDragStart(e: any) {
    e.preventDefault();
    return false;
  }

  let style: SerializedStyles;

  if (isCorrect) {
    if (props.isSelected) style = css_keyframe_selected;
    else style = css_keyframe;
  } else {
    if (props.isSelected) style = css_keyframe_error_selected;
    else style = css_keyframe_error;
  }

  return (
    <div
      className="keyframe"
      css={style}
      style={{
        left: props.frameSize.width * (props.index + 0.5) - 5,
      }}
      data-keyframeuuid={props.keyframe.uuid}
      onDragStart={onDragStart}
    ></div>
  );
}
