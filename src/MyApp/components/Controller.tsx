import { useState } from "react";
import FrameSize from "../../global/FrameSize";
import AnimController from "../../three/anim/AnimController";

interface ControllerProps {
  frameSize: FrameSize;
  animController: AnimController | undefined;
  onFrameCountChange: (count: number) => void;
  onFrameWidthChange: (count: number) => void;
}

export default function Controller(props: ControllerProps) {
  const [frameCount, setFrameCount] = useState(props.frameSize.count);

  function onPlayClick(e: any) {
    props.animController?.play();
  }

  function onFrameCountChange(e: any) {
    props.onFrameCountChange(frameCount);
  }

  function onFrameWidthChange(e: any) {
    props.onFrameWidthChange(e.target.value);
  }

  return (
    <div id="controller">
      <button onClick={onPlayClick}>play</button>
      <div className="frame-size">
        <label>
          frame count
          <input
            type={"number"}
            value={frameCount}
            style={{ width: 40 }}
            onChange={(e: any) => {
              setFrameCount(e.target.value);
            }}
          />
          <button onClick={onFrameCountChange}>apply</button>
        </label>
        <label>
          width
          <input
            type={"range"}
            min={5}
            max={25}
            onChange={onFrameWidthChange}
          />
        </label>
      </div>
    </div>
  );
}
