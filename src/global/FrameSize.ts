export default interface FrameSize {
  width: number;
  count: number;
  height: number;
  fps: number;
}

export function drawTimelineFrame(
  context: CanvasRenderingContext2D,
  frameSize: FrameSize,
  frameHeight: number
) {
  const halfSec = Math.round(frameSize.fps * 0.5);

  context.lineWidth = 0.5;
  context.beginPath();
  for (let i = 0; i < frameSize.count; i++) {
    if (i % frameSize.fps === 0) continue;
    if (i % frameSize.fps === halfSec) continue;

    const posX = Math.round((i + 0.5) * frameSize.width) + 0.5;
    context.moveTo(posX, 0);
    context.lineTo(posX, frameHeight);
  }
  context.closePath();
  context.stroke();

  context.lineWidth = 2;
  context.beginPath();
  for (let i = 0; i < frameSize.count; i++) {
    if (i % frameSize.fps === 0) {
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
    if (i % frameSize.fps === 0) continue;
    if (i % frameSize.fps === halfSec) {
      const posX = Math.round((i + 0.5) * frameSize.width) + 0.5;
      context.moveTo(posX, 0);
      context.lineTo(posX, frameHeight);
    }
  }
  context.closePath();
  context.stroke();
}
