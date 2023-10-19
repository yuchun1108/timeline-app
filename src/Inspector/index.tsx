import { ReactNode, useState } from "react";
import { Anim, AnimInfo, Keyframe, Track } from "../global/Anim";
import { printToNewTab } from "../global/Common";
interface InspectorProps {
  animInfo: AnimInfo;
  selectedNodes: Anim[];
}

function exportAnimInfo(animInfo: AnimInfo) {
  printToNewTab(animInfo.toJson());
}

export default function Inspector(props: InspectorProps) {
  const { selectedNodes } = props;
  // const animNodes = props.selectedNodes;
  let element: ReactNode;

  // const selectedNodes = useRef<AnimNode[]>(null);
  const [value, setValue] = useState<string>();

  // if (selectedNodes.current !== props.selectedNodes) {
  //   selectedNodes.current = props.selectedNodes;

  //   if (props.selectedNodes !== null && props.selectedNodes.length > 0) {
  //     const firstNode = props.selectedNodes[0];
  //     if (firstNode.discriminator === "keyframe") {
  //       const keyframe = firstNode as Keyframe;
  //       setValue(keyframe.value);
  //       console.log('setValue', keyframe);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (
  //     props.selectedNodes !== null &&
  //     props.selectedNodes.length > 0 &&
  //     props.selectedNodes[0].discriminator === "keyframe"
  //   ) {
  //     const keyframe = props.selectedNodes[0] as Keyframe;
  //     keyframe.value = value;
  //     console.log(keyframe.value);
  //   }
  //   // console.log(value);
  // }, [value]);

  if (selectedNodes.length === 0) {
    element = <></>;
  } else {
    const firstNode = selectedNodes[0];
    if (firstNode.discriminator === "track") {
      const track = firstNode as Track;
      element = (
        <>
          <div className="select-type">Track</div>
          <label>Target</label>
          <input type="text"></input>
          <label>Attr</label>
          <input type="text"></input>
        </>
      );
    }
    if (firstNode.discriminator === "keyframe") {
      const keyframe = firstNode as Keyframe;
      element = (
        <>
          <div className="select-type">Keyframe</div>
          <label>Value</label>
          <input
            type="text"
            defaultValue={keyframe.value}
            onChange={(e: any) => {
              keyframe.value = e.target.value;
            }}
          ></input>
        </>
      );
    }
  }

  return (
    <div id="inspector">
      {element}
      {/* <a href={exportAnimInfo(props.animInfo)}>AAA</a> */}
      <button onClick={() => exportAnimInfo(props.animInfo)}>export</button>
    </div>
  );
}
