import { ReactNode } from "react";
import {AnimNode,Channel,Keyframe} from "../../global/AnimInfo"

interface InspectorProps {
  selectedNodes:AnimNode[] | null;
}

export default function Inspector(props: InspectorProps) {

  const animNodes = props.selectedNodes;
  let element:ReactNode;

  if(animNodes === null || animNodes.length === 0)
  {
    element = <></>
  }
  else
  {
    const firstNode = animNodes[0];
    if(firstNode.discriminator === "channel")
    {
      const channel = firstNode as Channel;
      element = <p>channel:{channel.name}</p>
    }
    if(firstNode.discriminator === "keyframe")
    {
      const keyframe = firstNode as Keyframe;
      element = <p>keyframe</p>
    }
  }


  return <div id="inspector">
    {element}
  </div>;
}