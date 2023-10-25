import { useEffect, useRef } from "react";
import FrameSize, { drawTimelineFrame } from "../../global/FrameSize";

interface TimelineBGProps {
  trackUuid: string;
  index: number;
  frameSize: FrameSize;
}

export default function TimelineBG(props: TimelineBGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameCount = useRef(0);
  const frameWidth = useRef(0);

  useEffect(() => {
    if (
      frameCount.current === props.frameSize.count &&
      frameWidth.current === props.frameSize.width
    )
      return;

    const canvas = canvasRef.current;
    if (canvas) {
      const width = props.frameSize.count * props.frameSize.width;
      canvas.width = width;
      canvas.height = props.frameSize.height;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

      if (context)
        drawTimelineFrame(context, props.frameSize, props.frameSize.height);
    }
  }, [props.frameSize]);

  function onDragStart(e: any) {
    e.preventDefault();
    return false;
  }

  return (
    <canvas
      className="timeline-bg"
      ref={canvasRef}
      data-trackuuid={props.trackUuid}
      data-index={props.index}
      onDragStart={onDragStart}
    ></canvas>
  );
}
