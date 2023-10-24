import { ReactNode } from "react";
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
  let element: ReactNode;

  function onEaseChange(e: any) {
    console.log(e.target.value);
  }

  function onInOutChange(e: any) {
    console.log(e.target.value);
  }

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
              defaultValue={keyframe.text}
              onChange={(e: any) => {
                keyframe.setText(e.target.value);
                props.anim?.setDirty();
              }}
            />
          </label>

          <label>
            Easing
            <select onChange={onEaseChange}>
              <option value="linear">Linear</option>
              <option value="quad">Quad</option>
              <option value="qubic">Qubic</option>
              <option value="quart">Quart</option>
              <option value="quint">Quint</option>
              <option value="expo">Expo</option>
              <option value="circ">Circ</option>
              <option value="back">Back</option>
              <option value="elastic">Elastic</option>
              <option value="bounce">Bounce</option>
            </select>
            <select onChange={onInOutChange}>
              <option>In</option>
              <option>Out</option>
              <option>InOut</option>
            </select>
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
