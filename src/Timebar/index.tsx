import { useEffect, useRef, useState } from "react";
import { ScrollSyncPane } from "react-scroll-sync";
import FrameSize from "../global/FrameSize";
import AnimController from "../three/AnimController";

interface TimebarProps {
  frameSize: FrameSize;
  height: number;
  animController: AnimController | undefined;
}

export default function Timebar(props: TimebarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameCount = useRef(0);
  const frameWidth = useRef(0);

  const lastAnimController = useRef<AnimController | undefined>(undefined);
  if (lastAnimController.current !== props.animController) {
    if (lastAnimController.current)
      lastAnimController.current.onAnimTimeChange = undefined;
    if (props.animController)
      props.animController.onAnimTimeChange = onAnimTimeChange;
    lastAnimController.current = props.animController;
  }

  function onAnimTimeChange(animTime: number) {
    setAnimTime(animTime);
  }

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
  const [animTime, setAnimTime] = useState(0);

  function updateTimePos(posX: number) {
    const _animTime = posXtoTime(posX);
    props.animController?.stop();
    props.animController?.setAnimTime(_animTime);
    setAnimTime(_animTime);
  }

  function posXtoTime(posX: number) {
    return (
      (posX - props.frameSize.width * 0.5) /
      props.frameSize.width /
      props.frameSize.fps
    );
  }

  function timeToPosX(timePos: number) {
    return (
      timePos * props.frameSize.width * props.frameSize.fps +
      props.frameSize.width * 0.5
    );
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
  return (
    <ScrollSyncPane>
      <div
        id="timebar"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onDragStart={(e) => false}
      >
        <canvas className="timeline-bg" ref={canvasRef}></canvas>
        <div
          className="time-pos"
          style={{
            left: timeToPosX(animTime),
          }}
        />
      </div>
    </ScrollSyncPane>
  );
}
