import { Channel } from "../../global/AnimInfo";

interface NameLabelProps {
  height: number;
  channel: Channel;
  isSelected: boolean;
  onChannelSelect: (channel: Channel) => void;
}

export default function NameLabel(props: NameLabelProps) {
  function onClick(e: any) {
    props.onChannelSelect(props.channel);
  }
  return (
    <div
      className={props.isSelected ? "name-label selected" : "name-label"}
      style={{ height: props.height }}
      onClick={onClick}
    >
      {props.channel.name}
    </div>
  );
}
