export default interface FrameSize {
  width: number;
  count: number;
  height: number;
}

export function saveFrameSize(frameSize: FrameSize) {
  const str = JSON.stringify(frameSize);
  localStorage.setItem("frameSize", str);
}

export function loadFrameSize(): FrameSize {
  const str = localStorage.getItem("frameSize");
  if (str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
    }
  }
  return {
    width: 20,
    count: 60,
    height: 20,
  };
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
