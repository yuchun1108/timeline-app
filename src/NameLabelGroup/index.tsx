/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback } from "react";
import AnimSelector from "../three/AnimSelector";
import { Track } from "../three/anim/Anim";
import NameLabel from "./components/NameLabel";

interface NameLabelGroupProps {
  height: number;
  tracks: Track[] | undefined;
  selector: AnimSelector;
}

export default function NameLabelGroup(props: NameLabelGroupProps) {
  const onTrackSelect = useCallback(
    (track: Track) => {
      props.selector.selectByNodes([track]);
    },
    [props.selector]
  );

  return (
    <div
      id="name-label-group"
      css={css`
        grid-area: name-label;
        position: relative;
        background-color: #364346;
      `}
    >
      {props.tracks?.map((track) => {
        return (
          <NameLabel
            height={props.height}
            key={track.uuid}
            track={track}
            onTrackSelect={onTrackSelect}
          />
        );
      })}
    </div>
  );
}
