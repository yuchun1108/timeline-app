import { useEffect, useRef } from "react";

interface TimelineBGProps {
    frameCount:number;
  frameWidth: number;
  width: number;
  height: number;
}

export default function TimelineBG(props: TimelineBGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let context: CanvasRenderingContext2D | null = null;

  function refresh() {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = props.width;
      canvas.height = props.height;
      context = canvas.getContext("2d");
    }
    if (context) {
      context.beginPath();
      for(let i=0;i<props.frameCount;i++)
      {
        const posX = Math.round((i + 0.5) * props.frameWidth);
        context.moveTo(posX, 0);
        context.lineTo(posX, props.height);
      }
      
      context.closePath();
      context.stroke();
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  refresh();

  return <canvas ref={canvasRef}></canvas>;
}
