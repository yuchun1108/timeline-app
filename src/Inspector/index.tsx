import { ReactNode, useState } from "react";
import { printToNewTab } from "../global/Common";
import { saveWorldAnim } from "../global/Storage";
import World from "../three/World";
import { Anim, AnimNode, Keyframe, Track } from "../three/anim/Anim";
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

  const track =
    selectedNodes.length > 0 && selectedNodes[0] instanceof Track
      ? selectedNodes[0]
      : undefined;

  const keyframe =
    selectedNodes.length > 0 && selectedNodes[0] instanceof Keyframe
      ? selectedNodes[0]
      : undefined;

  const [ease, setEase] = useState<string>(keyframe ? keyframe.easeName : "");

  function onEaseChange(e: any) {
    setEase(e.target.value);
    keyframe?.setEaseName(e.target.value);
  }

  function onInOutChange(e: any) {
    keyframe?.setEaseEnd(e.target.value);
  }

  let element: ReactNode;
  if (track) {
    element = (
      <>
        <div className="select-type">Track</div>

        <label>
          Attr
          <select>
            <option>position</option>
          </select>
          <input
            type="text"
            defaultValue={track.attr}
            onChange={(e: any) => {
              track.setAttr(e.target.value);
            }}
          />
        </label>
      </>
    );
  } else if (keyframe) {
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
            }}
          />
        </label>

        <label>
          Easing
          <select defaultValue={keyframe.easeName} onChange={onEaseChange}>
            <option value="linear">linear</option>
            <option value="quad">quad</option>
            <option value="qubic">qubic</option>
            <option value="quart">quart</option>
            <option value="quint">quint</option>
            <option value="sine">sine</option>
            <option value="expo">expo</option>
            <option value="circ">circ</option>
            <option value="back">back</option>
            <option value="elastic">elastic</option>
            <option value="bounce">bounce</option>
          </select>
          <select
            defaultValue={keyframe.easeEnd}
            onChange={onInOutChange}
            disabled={ease === "" || ease === "linear"}
          >
            <option value="in">in</option>
            <option value="out">out</option>
            <option value="inout">in-out</option>
          </select>
        </label>
      </>
    );
  } else {
    element = <></>;
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
