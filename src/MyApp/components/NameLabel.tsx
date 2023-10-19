import { Track } from "../../global/Anim";

interface NameLabelProps {
  height: number;
  track: Track;
  isSelected: boolean;
  onTrackSelect: (track: Track) => void;
}

export default function NameLabel(props: NameLabelProps) {
  function onClick(e: any) {
    props.onTrackSelect(props.track);
  }
  return (
    <div
      className={props.isSelected ? "name-label selected" : "name-label"}
      style={{ height: props.height }}
      onClick={onClick}
    >
      {props.track.name}
    </div>
  );
}
