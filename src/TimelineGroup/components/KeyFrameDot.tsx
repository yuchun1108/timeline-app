/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import FrameSize from "../../global/FrameSize";
import { Keyframe } from "../../three/anim/Anim";

interface KeyframeProps {
  frameSize: FrameSize;
  keyframe: Keyframe;
  moveOffset: number;
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
  const { keyframe } = props;

  const [isSelected, setIsSelected] = useState(keyframe.isSelected);
  const [index, setIndex] = useState(keyframe.index);

  const [isCorrect, setIsCorrect] = useState(
    props.keyframe.values !== undefined
  );

  const onChange = useCallback(() => {
    setIndex(keyframe.index);
    setIsCorrect(props.keyframe.values !== undefined);
  }, [keyframe]);

  const onSelectedChange = useCallback(
    (_isSelected: boolean) => {
      setIsSelected(_isSelected);
    },
    [keyframe]
  );

  useEffect(() => {
    keyframe.onChange.add(onChange);
    keyframe.onSelectedChange.add(onSelectedChange);
    return () => {
      keyframe.onChange.remove(onChange);
      keyframe.onSelectedChange.remove(onSelectedChange);
    };
  }, [onChange, onSelectedChange]);

  function onDragStart(e: any) {
    e.preventDefault();
    return false;
  }

  let style: SerializedStyles;

  if (isCorrect) {
    if (isSelected) style = css_keyframe_selected;
    else style = css_keyframe;
  } else {
    if (isSelected) style = css_keyframe_error_selected;
    else style = css_keyframe_error;
  }

  return (
    <div
      className="keyframe"
      css={style}
      style={{
        left:
          props.frameSize.width *
            (index + (isSelected ? props.moveOffset : 0) + 0.5) -
          5,
      }}
      data-keyframeuuid={props.keyframe.uuid}
      onDragStart={onDragStart}
    ></div>
  );
}
