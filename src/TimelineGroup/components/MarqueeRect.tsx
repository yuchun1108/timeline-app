/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import FrameSize from "../../global/FrameSize";
import Marquee from "./Marquee";

interface MarqueeRectProps {
  frameSize: FrameSize;
  marquee: Marquee;
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
  const { marquee } = props;

  const [isShow, setIsShow] = useState(marquee.isShow);
  const [trackIndexMin, setTrackIndexMin] = useState(0);
  const [trackIndexMax, setTrackIndexMax] = useState(0);
  const [frameIndexMin, setFrameIndexMin] = useState(0);
  const [frameIndexMax, setFrameIndexMax] = useState(0);

  useEffect(() => {
    marquee.onRectChange.add(() => {
      setTrackIndexMin(marquee.getTrackIndexMin());
      setTrackIndexMax(marquee.getTrackIndexMax());
      setFrameIndexMin(marquee.getFrameIndexMin());
      setFrameIndexMax(marquee.getFrameIndexMax());
    });
    marquee.onIsShowChange.add((_isShow) => {
      setIsShow(_isShow);
    });
  }, []);

  return isShow ? (
    <div
      css={css_Marquee}
      className="marquee-rect"
      style={{
        top: trackIndexMin * props.frameSize.height,
        height:
          (trackIndexMax + 1 - trackIndexMin) * props.frameSize.height - 3,
        left: frameIndexMin * props.frameSize.width,
        width: (frameIndexMax + 1 - frameIndexMin) * props.frameSize.width - 2,
      }}
    />
  ) : (
    <></>
  );
}
