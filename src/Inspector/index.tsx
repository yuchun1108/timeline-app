import { ReactNode, useState } from "react";
import { Anim, AnimNode, Keyframe, Track } from "../global/Anim";
import { printToNewTab } from "../global/Common";
interface InspectorProps {
  anim: Anim | undefined;
  selectedNodes: AnimNode[];
}

function exportAnim(anim: Anim) {
  printToNewTab(anim.toJson());
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
  //   }
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

          <label>
            Attr
            <input
              type="text"
              defaultValue={track.attr}
              onChange={(e: any) => {
                track.attr = e.target.value;
              }}
            />
          </label>
        </>
      );
    }
    if (firstNode.discriminator === "keyframe") {
      const keyframe = firstNode as Keyframe;
      element = (
        <>
          <div className="select-type">Keyframe</div>
          <label>
            Value
            <input
              type="text"
              defaultValue={keyframe.value}
              onChange={(e: any) => {
                keyframe.value = e.target.value;
              }}
            />
          </label>
        </>
      );
    }
  }

  return (
    <div id="inspector">
      {element}
      <button
        onClick={() => {
          if (props.anim) exportAnim(props.anim);
        }}
      >
        export
      </button>
    </div>
  );
}
