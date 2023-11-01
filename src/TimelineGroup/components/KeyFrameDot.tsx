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
  background: url("/image/keyframe.png") 0 0;
`;

const css_keyframe_selected = css`
  ${css_keyframe}
  background: url("/image/keyframe.png") -11px 0;
`;

const css_keyframe_firstSelect = css`
  ${css_keyframe}
  background: url("/image/keyframe.png") -22px 0;
`;

const css_keyframe_error = css`
  ${css_keyframe}
  background: url("/image/keyframe.png") -33px 0;
`;

const css_keyframe_error_selected = css`
  ${css_keyframe}
  background: url("/image/keyframe.png") -44px 0;
`;

const css_keyframe_error_firstSelect = css`
  ${css_keyframe}
  background: url("/image/keyframe.png") -55px 0;
`;

export default function KeyframeDot(props: KeyframeProps) {
  const { keyframe } = props;

  const [selectState, setSelectState] = useState(keyframe.selectState);
  const [index, setIndex] = useState(keyframe.index);

  const [isCorrect, setIsCorrect] = useState(
    props.keyframe.values !== undefined
  );

  const onChange = useCallback(() => {
    setIndex(keyframe.index);
    setIsCorrect(keyframe.values !== undefined);
  }, [keyframe]);

  const onSelectedChange = useCallback((_selectState: 0 | 1 | 2) => {
    setSelectState(_selectState);
  }, []);

  useEffect(() => {
    keyframe.onChange.add(onChange);
    keyframe.onSelectedChange.add(onSelectedChange);
    return () => {
      keyframe.onChange.remove(onChange);
      keyframe.onSelectedChange.remove(onSelectedChange);
    };
  }, [keyframe, onChange, onSelectedChange]);

  function onDragStart(e: any) {
    e.preventDefault();
    return false;
  }

  let style: SerializedStyles;

  if (isCorrect) {
    if (selectState === 1) style = css_keyframe_selected;
    else if (selectState === 2) style = css_keyframe_firstSelect;
    else style = css_keyframe;
  } else {
    if (selectState === 1) style = css_keyframe_error_selected;
    else if (selectState === 2) style = css_keyframe_error_firstSelect;
    else style = css_keyframe_error;
  }

  return (
    <div
      className="keyframe"
      css={style}
      style={{
        left:
          props.frameSize.width *
            (index + (selectState ? props.moveOffset : 0) + 0.5) -
          5,
      }}
      data-keyframeuuid={props.keyframe.uuid}
      onDragStart={onDragStart}
    ></div>
  );
}
