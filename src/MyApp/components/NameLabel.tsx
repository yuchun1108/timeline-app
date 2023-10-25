import { useCallback, useEffect, useState } from "react";
import { Track } from "../../three/anim/Anim";

interface NameLabelProps {
  height: number;
  track: Track;
  isSelected: boolean;
  onTrackSelect: (track: Track) => void;
}

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
  }, [track]);

  function onClick(e: any) {
    props.onTrackSelect(track);
  }

  return (
    <div
      className={props.isSelected ? "name-label selected" : "name-label"}
      style={{ height: props.height }}
      onClick={onClick}
    >
      <span>{target}</span>
      <span>{attr}</span>
    </div>
  );
}
