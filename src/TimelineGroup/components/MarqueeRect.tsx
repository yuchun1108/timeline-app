import FrameSize from "../../global/FrameSize";

interface MarqueeRectProps {
  frameSize: FrameSize;
  channelIndexMin: number;
  channelIndexMax: number;
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
    props.channelIndexMin === props.channelIndexMax &&
    props.frameIndexMin === props.frameIndexMax
  )
    return <></>;

  return (
    <div
      className="marquee-rect"
      style={{
        top: props.channelIndexMin * props.frameSize.height,
        height:
          (props.channelIndexMax + 1 - props.channelIndexMin) *
          props.frameSize.height,
        left: props.frameIndexMin * props.frameSize.width,
        width:
          (props.frameIndexMax + 1 - props.frameIndexMin) *
          props.frameSize.width,
      }}
    />
  );
}
