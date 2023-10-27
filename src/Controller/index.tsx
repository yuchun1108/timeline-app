/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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

  const css_controller = css`
    grid-area: controller;
    background-color: #293538;
    position: relative;
    border-bottom: solid 2px #20292b;
  `;

  const css_control_button_group = css`
    margin: auto;
    width: 100px;
  `;

  const css_control_btn = css`
    margin: 2px 2px 1px 2px;
    border: none;
    background-color: #20292b;
    color: #b1b8ba;
    font-size: 20px;
    width: 36px;
    cursor: pointer;
  `;

  const css_frame_size = css`
    position: absolute;
    top: 0;
    right: 0;
  `;

  return (
    <div id="controller" css={css_controller}>
      <div className="control-buttons" css={css_control_button_group}>
        <button className="btn" css={css_control_btn} onClick={onPlayClick}>
          <a data-tooltip-id="tooltip" data-tooltip-content="Play">
            <FontAwesomeIcon icon={icon({ name: "play" })} />
          </a>
        </button>
        <button className="btn" css={css_control_btn} onClick={onPlayClick}>
          <a data-tooltip-id="tooltip" data-tooltip-content="Pause">
            <FontAwesomeIcon icon={icon({ name: "pause" })} />
          </a>
        </button>
      </div>
      <div className="frame-size" css={css_frame_size}>
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
          <button
            className="btn"
            css={css_control_btn}
            onClick={onFrameCountChange}
          >
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
