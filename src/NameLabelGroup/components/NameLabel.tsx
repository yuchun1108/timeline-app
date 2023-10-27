/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { Track } from "../../three/anim/Anim";

interface NameLabelProps {
  height: number;
  track: Track;
  isSelected: boolean;
  onTrackSelect: (track: Track) => void;
}

const css_nameLabel = css`
  background-color: #364346;
  color: white;
  font-size: 0.85em;
  border-bottom: solid 1px #2c393c;
  padding-left: 4px;
  user-select: none;
`;

const css_nameLabel_selected = css`
  ${css_nameLabel}
  background-color: #2c7387;
`;

const css_nameLabel_span = css`
  vertical-align: middle;
`;

export default function NameLabel(props: NameLabelProps) {
  const { track } = props;

  const [target, setTarget] = useState(track.targetText);
  const [attr, setAttr] = useState(track.attr);

  const onTrackChange = useCallback(() => {
    setTarget(track.targetText);
    setAttr(track.attr);
  }, [track]);

  useEffect(() => {
    track.onChange = onTrackChange;
  }, [track, onTrackChange]);

  function onClick(e: any) {
    props.onTrackSelect(track);
  }

  return (
    <div
      css={props.isSelected ? css_nameLabel_selected : css_nameLabel}
      className={props.isSelected ? "name-label selected" : "name-label"}
      style={{ height: props.height - 1 }}
      onClick={onClick}
    >
      <span css={css_nameLabel_span}>
        {target}
        {" : "}
        {attr}
      </span>
    </div>
  );
}
