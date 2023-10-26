import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import FrameSize from "../global/FrameSize";
import AnimController from "../three/anim/AnimController";

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

  function onFrameCountKeyDown(e: any) {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      onFrameCountChange();
    }
  }

  function onFrameCountChange() {
    props.onFrameCountChange(frameCount);
  }

  function onFrameWidthChange(e: any) {
    props.onFrameWidthChange(e.target.value);
  }

  return (
    <div id="controller">
      <div className="control-buttons">
        <button className="btn" onClick={onPlayClick}>
          <a data-tooltip-id="tooltip" data-tooltip-content="Play">
            <FontAwesomeIcon icon={icon({ name: "play" })} />
          </a>
        </button>
        <button className="btn" onClick={onPlayClick}>
          <a data-tooltip-id="tooltip" data-tooltip-content="Pause">
            <FontAwesomeIcon icon={icon({ name: "pause" })} />
          </a>
        </button>
      </div>
      <div className="frame-size">
        <a data-tooltip-id="tooltip" data-tooltip-content="Frame Count">
          <input
            type={"number"}
            value={frameCount}
            style={{ width: 40 }}
            onChange={(e: any) => {
              setFrameCount(e.target.value);
            }}
            onKeyDown={onFrameCountKeyDown}
          />
          <button className="btn" onClick={onFrameCountChange}>
            <FontAwesomeIcon icon={icon({ name: "check" })} />
          </button>
        </a>
        <a data-tooltip-id="tooltip" data-tooltip-content="Frame Width">
          <input
            type={"range"}
            min={5}
            max={25}
            style={{ width: 70 }}
            onChange={onFrameWidthChange}
          />
        </a>
      </div>
    </div>
  );
}
