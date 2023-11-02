/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef } from "react";
import FrameSize, { drawTimelineFrame } from "../../global/FrameSize";

interface TimelineBGProps {
  trackUuid: string;
  index: number;
  frameSize: FrameSize;
  fps: number;
}

const css_timeline_bg = css`
  position: absolute;
  top: 0;
  left: 0;
`;

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
      canvas.height = props.frameSize.height - 1;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

      if (context)
        drawTimelineFrame(
          context,
          props.frameSize,
          props.fps,
          props.frameSize.height - 1
        );
    }
  }, [props.frameSize]);

  function onDragStart(e: any) {
    e.preventDefault();
    return false;
  }

  return (
    <canvas
      css={css_timeline_bg}
      className="timeline-bg"
      ref={canvasRef}
      data-trackuuid={props.trackUuid}
      data-index={props.index}
      onDragStart={onDragStart}
    ></canvas>
  );
}
