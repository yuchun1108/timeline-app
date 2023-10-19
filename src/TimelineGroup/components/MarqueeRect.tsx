import FrameSize from "../../global/FrameSize";

interface MarqueeRectProps {
  frameSize: FrameSize;
  trackIndexMin: number;
  trackIndexMax: number;
  frameIndexMin: number;
  frameIndexMax: number;
}

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
      className="marquee-rect"
      style={{
        top: props.trackIndexMin * props.frameSize.height,
        height:
          (props.trackIndexMax + 1 - props.trackIndexMin) *
          props.frameSize.height,
        left: props.frameIndexMin * props.frameSize.width,
        width:
          (props.frameIndexMax + 1 - props.frameIndexMin) *
          props.frameSize.width,
      }}
    />
  );
}
