import { ReactNode, useState } from "react";
import { printToNewTab } from "../global/Common";
import { saveWorldAnim } from "../global/Storage";
import { Anim, AnimNode, Keyframe, Track } from "../three/Anim";
import World from "../three/World";
interface InspectorProps {
  world: World;
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

    if (firstNode instanceof Track) {
      const track: Track = firstNode;
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
    if (firstNode instanceof Keyframe) {
      const keyframe: Keyframe = firstNode;
      element = (
        <>
          <div className="select-type">Keyframe</div>
          <label>
            Value
            <input
              type="text"
              defaultValue={keyframe.value}
              onChange={(e: any) => {
                keyframe.setValue(e.target.value);
                props.anim?.setDirty();
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
      <button
        onClick={() => {
          saveWorldAnim(props.world);
        }}
      >
        save
      </button>

      <button
        onClick={() => {
          localStorage.clear();
        }}
      >
        clear storage
      </button>
    </div>
  );
}
