/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { AnimNode, Track } from "../three/anim/Anim";
import NameLabel from "./components/NameLabel";

interface NameLabelGroupProps {
  height: number;
  tracks: Track[] | undefined;
  selectedNodes: AnimNode[];
  onTrackSelect: (track: Track) => void;
}

export default function NameLabelGroup(props: NameLabelGroupProps) {
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
        const isSelected =
          props.selectedNodes !== null && props.selectedNodes.includes(track);

        return (
          <NameLabel
            isSelected={isSelected}
            height={props.height}
            key={track.uuid}
            track={track}
            onTrackSelect={props.onTrackSelect}
          />
        );
      })}
    </div>
  );
}
