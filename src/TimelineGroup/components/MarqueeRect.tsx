/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import FrameSize from "../../global/FrameSize";

interface MarqueeRectProps {
  frameSize: FrameSize;
  trackIndexMin: number;
  trackIndexMax: number;
  frameIndexMin: number;
  frameIndexMax: number;
}

const css_Marquee = css`
  position: absolute;
  background-color: #304c53;
  pointer-events: none;
  border: solid #206c7e 1px;
`;

/**
 * 圈選框
 * @param props
 * @returns
 */
export default function MarqueeRect(props: MarqueeRectProps) {
  if (
    props.trackIndexMin === props.trackIndexMax &&
    props.frameIndexMin === props.frameIndexMax
  )
    return <></>;

  return (
    <div
      css={css_Marquee}
      className="marquee-rect"
      style={{
        top: props.trackIndexMin * props.frameSize.height,
        height:
          (props.trackIndexMax + 1 - props.trackIndexMin) *
            props.frameSize.height -
          3,
        left: props.frameIndexMin * props.frameSize.width,
        width:
          (props.frameIndexMax + 1 - props.frameIndexMin) *
            props.frameSize.width -
          2,
      }}
    />
  );
}
