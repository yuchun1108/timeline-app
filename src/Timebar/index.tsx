/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { ScrollSyncPane } from "react-scroll-sync";
import FrameSize, { drawTimelineFrame } from "../global/FrameSize";
import AnimController from "../three/anim/AnimController";

interface TimebarProps {
  frameSize: FrameSize;
  fps: number;
  height: number;
  animController: AnimController | undefined;
}

const css_timebar = css`
  grid-area: timebar;
  background-color: #232d30;

  border-bottom: solid 1px;
  position: relative;
  overflow: hidden;
`;

const css_time_pos = css`
  position: absolute;
  top: 0;
  left: 10px;
  width: 1px;
  height: 100%;
  background-color: red;
  pointer-events: none;
`;

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

  useEffect(() => {
    if (
      frameCount.current === props.frameSize.count &&
      frameWidth.current === props.frameSize.width
    )
      return;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const width = props.frameSize.count * props.frameSize.width;
      canvas.width = width;
      canvas.height = props.height - 1;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (context)
        drawTimelineFrame(
          context,
          props.frameSize,
          props.fps,
          props.height - 1
        );
    }
  }, [props.frameSize, props.height]);

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
      (posX - props.frameSize.width * 0.5) / props.frameSize.width / props.fps
    );
  }

  function timeToPosX(timePos: number) {
    return (
      timePos * props.frameSize.width * props.fps + props.frameSize.width * 0.5
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
        css={css_timebar}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onDragStart={(e) => false}
      >
        <canvas className="timeline-bg" ref={canvasRef}></canvas>
        <div
          css={css_time_pos}
          className="time-pos"
          style={{
            left: timeToPosX(animTime),
          }}
        />
      </div>
    </ScrollSyncPane>
  );
}
