import { AnimNode, Track } from "../../global/Anim";
import NameLabel from "./NameLabel";

interface NameLabelGroupProps {
  height: number;
  tracks: Track[] | undefined;
  selectedNodes: AnimNode[];
  onTrackSelect: (track: Track) => void;
}

export default function NameLabelGroup(props: NameLabelGroupProps) {
  return (
    <div id="name-label-group">
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
