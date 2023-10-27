/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { Track } from "../../three/anim/Anim";

interface NameLabelProps {
  height: number;
  track: Track;
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

  const [isSelected, setIsSelected] = useState(track.isSelected);
  const [target, setTarget] = useState(track.targetText);
  const [attr, setAttr] = useState(track.attr);

  const onChange = useCallback(() => {
    setTarget(track.targetText);
    setAttr(track.attr);
  }, [track]);

  const onSelectedChange = useCallback(
    (_isSelected: boolean) => {
      setIsSelected(_isSelected);
    },
    [track]
  );

  useEffect(() => {
    track.onChange.add(onChange);
    track.onSelectedChange.add(onSelectedChange);

    return () => {
      track.onChange.remove(onChange);
      track.onSelectedChange.remove(onSelectedChange);
    };
  }, [onChange, onSelectedChange]);

  function onClick(e: any) {
    props.onTrackSelect(track);
  }

  return (
    <div
      css={isSelected ? css_nameLabel_selected : css_nameLabel}
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
