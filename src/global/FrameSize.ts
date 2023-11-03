import { toast } from "react-toastify";

export default interface FrameSize {
  width: number;
  count: number;
  height: number;
}

let frameSize: FrameSize | undefined = undefined;

export function saveFrameSize(frameSize: FrameSize) {
  const str = JSON.stringify(frameSize);
  localStorage.setItem("frameSize", str);
}

export function loadFrameSize(): FrameSize {
  if (frameSize === undefined) {
    const str = localStorage.getItem("frameSize");
    if (str) {
      try {
        frameSize = JSON.parse(str);
      } catch (e) {
        toast.error("An error occurred while reading frameSize");
        console.error(e);
      }
    }
  }

  if (frameSize === undefined) {
    frameSize = {
      width: 20,
      count: 60,
      height: 20,
    };
  }

  return frameSize;
}

export function drawTimelineFrame(
  context: CanvasRenderingContext2D,
  frameSize: FrameSize,
  fps: number,
  frameHeight: number
) {
  const halfSec = Math.round(fps * 0.5);

  context.lineWidth = 1;
  context.beginPath();
  for (let i = 0; i < frameSize.count; i++) {
    if (i % fps === 0) continue;
    if (i % fps === halfSec) continue;

    const posX = Math.round((i + 0.5) * frameSize.width) + 0.5;
    context.moveTo(posX, frameHeight * 0.5);
    context.lineTo(posX, frameHeight);
  }
  context.closePath();
  context.stroke();

  context.lineWidth = 2;
  context.beginPath();
  for (let i = 0; i < frameSize.count; i++) {
    if (i % fps === 0) {
      const posX = Math.round((i + 0.5) * frameSize.width) + 0.5;
      context.moveTo(posX, 0);
      context.lineTo(posX, frameHeight);
    }
  }
  context.closePath();
  context.stroke();

  context.lineWidth = 1.5;
  context.beginPath();
  for (let i = 0; i < frameSize.count; i++) {
    if (i % fps === 0) continue;
    if (i % fps === halfSec) {
      const posX = Math.round((i + 0.5) * frameSize.width) + 0.5;
      context.moveTo(posX, frameHeight * 0.25);
      context.lineTo(posX, frameHeight);
    }
  }
  context.closePath();
  context.stroke();
}
