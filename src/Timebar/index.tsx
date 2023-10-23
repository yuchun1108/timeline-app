import { useEffect, useRef, useState } from "react";
import FrameSize from "../global/FrameSize";

interface TimebarProps {
  frameSize: FrameSize;
  height: number;
  scrollLeft: number;
}

export default function Timebar(props: TimebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameCount = useRef(0);
  const frameWidth = useRef(0);

  function refresh() {
    if (
      frameCount.current === props.frameSize.count &&
      frameWidth.current === props.frameSize.width
    )
      return;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const width = props.frameSize.count * props.frameSize.width;
      canvas.width = width;
      canvas.height = props.height;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (context) {
        context.beginPath();
        for (let i = 0; i < props.frameSize.count; i++) {
          const posX = Math.round((i + 0.5) * props.frameSize.width);
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

  const isMouseDown = useRef(false);
  const [timePos, setTimePos] = useState(0);

  function updateTimePos(posX: number) {
    const _timePos = posX / props.frameSize.width / props.frameSize.fps;
    setTimePos(_timePos);
  }

  function getPosX(timePos: number) {
    return timePos * props.frameSize.width * props.frameSize.fps;
  }

  function onMouseDown(e: any) {
    isMouseDown.current = true;
    updateTimePos(e.nativeEvent.offsetX);
  }

  function onMouseMove(e: any) {
    if (isMouseDown.current) {
      updateTimePos(e.nativeEvent.offsetX);
    }
  }

  function onMouseUp(e: any) {
    isMouseDown.current = false;
  }

  function onMouseLeave(e: any) {
    isMouseDown.current = false;
  }

  if (scrollRef.current) scrollRef.current.scrollLeft = props.scrollLeft;

  return (
    <div
      id="timebar"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onDragStart={(e) => false}
      ref={scrollRef}
    >
      <canvas className="timeline-bg" ref={canvasRef}></canvas>
      <div
        className="time-pos"
        style={{
          left: getPosX(timePos),
        }}
      />
    </div>
  );
}
