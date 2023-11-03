/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import World from "../three/World";

import "react-toastify/dist/ReactToastify.css";

interface TopControllerProps {
  world: World;
}

const divWidth = 90;

const css_div = css`
  position: absolute;
  top: 0;
  left: 50%;
  width: ${divWidth}px;
  margin-left: -${divWidth / 2}px;
  background-color: #2c393c;
  border-radius: 0 0 10px 10px;
  color: white;
  padding: 4px;
  text-align: center;
`;

const css_btn = css`
  margin: 2px 4px 4px 4px;
  border: none;
  background-color: #20292b;
  color: #b1b8ba;
  font-size: 20px;
  width: 36px;
  height: 32px;
  cursor: pointer;
`;

export default function TopController(props: TopControllerProps) {
  const { world } = props;

  function onPlayAllClick() {
    world.setAllAnimPlay();
  }

  function onStopAllClick() {
    world.setAllAnimStop();
  }

  return (
    <div css={css_div}>
      <span data-tooltip-id="tooltip" data-tooltip-content="Play All">
        <button className="btn" css={css_btn} onClick={onPlayAllClick}>
          <FontAwesomeIcon icon={icon({ name: "play" })} />
        </button>
      </span>
      <span data-tooltip-id="tooltip" data-tooltip-content="Stop All">
        <button className="btn" css={css_btn} onClick={onStopAllClick}>
          <FontAwesomeIcon icon={icon({ name: "pause" })} />
        </button>
      </span>
    </div>
  );
}
