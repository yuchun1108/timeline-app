interface MarqueeRectProps {
  frameWidth: number;
  timelineHeight: number;
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
        top: props.channelIndexMin * props.timelineHeight,
        height:
          (props.channelIndexMax + 1 - props.channelIndexMin) *
          props.timelineHeight,
        left: props.frameIndexMin * props.frameWidth,
        width:
          (props.frameIndexMax + 1 - props.frameIndexMin) * props.frameWidth,
      }}
    />
  );
}
