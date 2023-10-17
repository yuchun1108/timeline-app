import { ReactNode } from "react";
import {addChannel,AnimNode,Channel,Keyframe} from "../../global/AnimInfo"

interface InspectorProps {
  onAddChannel:()=>void;
}

export default function Controller(props: InspectorProps) {
  return <div id="controller">
    <button>play</button>
    <button onClick={props.onAddChannel}>+</button>
  </div>
}