import { useEffect, useRef } from "react";

interface TimelineBGProps {
  channelId: string;
  index: number;
  frameCount: number;
  frameWidth: number;
  width: number;
  height: number;
}

export default function TimelineBG(props: TimelineBGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function refresh() {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = props.width;
      canvas.height = props.height;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (context) {
  
        context.beginPath();
        for (let i = 0; i < props.frameCount; i++) {
          const posX = Math.round((i + 0.5) * props.frameWidth);
          context.moveTo(posX, 0);
          context.lineTo(posX, props.height);
        }
        context.closePath();
        context.stroke();

      }
    }
  }

  useEffect(() => {
    refresh();
  }, []);
  refresh();

  function onDragStart(e: any) {
    e.preventDefault();
    return false;
  }

  return (
    <canvas
      className="timeline-bg"
      ref={canvasRef}
      data-channelid={props.channelId}
      data-index={props.index}
      onDragStart={onDragStart}
    ></canvas>
  );
}
