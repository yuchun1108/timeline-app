import { useCallback, useEffect, useRef } from "react";
import FrameSize from "../../global/FrameSize";

interface TimelineBGProps {
  trackUuid: string;
  index: number;
  frameSize: FrameSize;
}

export default function TimelineBG(props: TimelineBGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameCount = useRef(0);
  const frameWidth = useRef(0);

  const refresh = useCallback(() => {
    if (
      frameCount.current === props.frameSize.count &&
      frameWidth.current === props.frameSize.width
    )
      return;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const width = props.frameSize.count * props.frameSize.width;
      canvas.width = width;
      canvas.height = props.frameSize.height;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (context) {
        context.beginPath();
        for (let i = 0; i < props.frameSize.count; i++) {
          const posX = Math.round((i + 0.5) * props.frameSize.width);
          context.moveTo(posX, 0);
          context.lineTo(posX, props.frameSize.height);
        }
        context.closePath();
        context.stroke();
      }
    }
  }, [props.frameSize]);

  useEffect(() => {
    refresh();
  }, [refresh]);
  refresh();

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
