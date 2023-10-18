import { AnimNode, Channel } from "../../global/AnimInfo";
import NameLabel from "./NameLabel";

interface NameLabelGroupProps {
  height: number;
  channels: Channel[];
  selectedNodes: AnimNode[];
  onChannelSelect: (channel: Channel) => void;
}

export default function NameLabelGroup(props: NameLabelGroupProps) {
  return (
    <div id="name-label-group">
      {props.channels.map((channel) => {
        const isSelected =
          props.selectedNodes !== null && props.selectedNodes.includes(channel);

        return (
          <NameLabel
            isSelected={isSelected}
            height={props.height}
            key={channel.id}
            channel={channel}
            onChannelSelect={props.onChannelSelect}
          />
        );
      })}
    </div>
  );
}
