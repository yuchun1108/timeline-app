/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { printToNewTab } from "../global/Common";
import AnimSelector from "../three/AnimSelector";
import World from "../three/World";
import { Anim, AnimNode, Keyframe, Track } from "../three/anim/Anim";
interface InspectorProps {
  world: World;
  anim: Anim | undefined;
  selector: AnimSelector;
}

const css_inspector = css`
  grid-area: inspector;
  background-color: #364346;
  position: relative;
  border-left: solid 2px #20292b;
`;

const css_exportBtn = css`
  background-color: #2a373a;
  border: none;
  color: white;
  font-size: 14px;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  padding: 8px 0 8px 0;
  cursor: pointer;
`;

const css_exportBtn_text = css`
  margin: 0 8px 0 8px;
  vertical-align: middle;
`;

const css_title = css`
  background-color: #293538;
  height: 24px;
  padding: 4px 0px 2px 8px;
  color: white;
`;

const css_titleIcon = css`
  font-size: 12px;
  margin-right: 6px;
`;

const css_titleText = css`
  user-select: none;
  vertical-align: middle;
  font-size: 0.95em;
`;

const css_contents = css`
  padding: 4px 6px 4px 6px;
`;

const css_attr = css`
  height: 26px;
`;

const css_attr_label = css`
  vertical-align: middle;
  font-size: 0.85em;
`;

const css_attr_input = css`
  float: right;
  width: 50%;
`;

let tooltip_attr_list = "<div><h3>Available Attrs</h3><ul>";
const attr_list = [
  "position",
  "position-x",
  "position-y",
  "position-z",
  "position-xy",
  "position-yz",
  "position-xz",
  "scale",
  "scale-x",
  "scale-y",
  "scale-z",
  "scale-xyz",
  "rotation",
  "rotation-x",
  "rotation-y",
  "rotation-z",
];
attr_list.forEach((attr) => {
  tooltip_attr_list += "<li>" + attr + "</li>";
});
tooltip_attr_list += "</ul></div>";

export default function Inspector(props: InspectorProps) {
  const { selector } = props;
  const [selectedNodes, setSelectedNodes] = useState<AnimNode[]>([]);

  const onSelectChange = useCallback((nodes: AnimNode[]) => {
    setSelectedNodes([...nodes]);
  }, []);

  useEffect(() => {
    selector.onSelectChange.add(onSelectChange);
    return () => {
      selector.onSelectChange.remove(onSelectChange);
    };
  }, [selector, onSelectChange]);

  const track =
    selectedNodes.length > 0 && selectedNodes[0] instanceof Track
      ? selectedNodes[0]
      : undefined;

  const keyframe =
    selectedNodes.length > 0 && selectedNodes[0] instanceof Keyframe
      ? selectedNodes[0]
      : undefined;

  function onEaseChange(e: any) {
    keyframe?.setEaseName(e.target.value);
  }

  function onOptChange(e: any) {
    track?.setOpt(e.target.value);
  }

  function onInOutChange(e: any) {
    keyframe?.setEaseEnd(e.target.value);
  }

  function exportAnim(anim: Anim) {
    printToNewTab(anim.toJson("\t"));
  }

  let element: ReactNode;
  // if (selectedNodes.length > 1) {
  // } else
  if (track) {
    element = (
      <>
        <div css={css_title}>
          <span css={css_titleIcon}>
            <FontAwesomeIcon icon={icon({ name: "bars-staggered" })} />
          </span>
          <span css={css_titleText}>Track</span>
        </div>

        <div css={css_contents} key={track.uuid}>
          <div css={css_attr}>
            <label css={css_attr_label}>
              target
              <input
                css={css_attr_input}
                type="text"
                autoCorrect="off"
                autoComplete="off"
                defaultValue={track.targetText}
                onChange={(e: any) => {
                  track.setTargetText(e.target.value);
                }}
              />
            </label>
          </div>

          <span data-tooltip-id="tooltip" data-tooltip-html={tooltip_attr_list}>
            <div css={css_attr}>
              <label css={css_attr_label} htmlFor="input-track-attr">
                attr
              </label>
              <input
                id="input-track-attr"
                css={css_attr_input}
                type="text"
                autoCorrect="off"
                autoComplete="off"
                defaultValue={track.attr}
                onChange={(e: any) => {
                  track.setAttr(e.target.value);
                }}
              />
            </div>
          </span>

          <div css={css_attr}>
            <label css={css_attr_label} htmlFor="selector-track-opt">
              opt
            </label>
            <select
              id="selector-track-opt"
              css={css_attr_input}
              style={{ width: "40%" }}
              defaultValue={track.opt}
              onChange={onOptChange}
            >
              <option value="add">add</option>
              <option value="override">override</option>
            </select>
          </div>
        </div>
      </>
    );
  } else if (keyframe) {
    element = (
      <>
        <div css={css_title}>
          <span css={css_titleIcon}>
            <FontAwesomeIcon icon={icon({ name: "diamond" })} />
          </span>

          <span css={css_titleText}>Keyframe</span>
        </div>

        <div css={css_contents} key={keyframe.uuid}>
          <div css={css_attr}>
            <label css={css_attr_label} htmlFor="input-keyframe-value">
              value
            </label>
            <input
              id="input-keyframe-value"
              css={css_attr_input}
              type="text"
              autoCorrect="off"
              autoComplete="off"
              defaultValue={keyframe.text}
              onChange={(e: any) => {
                keyframe.setText(e.target.value);
              }}
            />
          </div>

          <div css={css_attr}>
            <label css={css_attr_label} htmlFor="select-keyframe-easing">
              easing
            </label>
            <select
              id="select-keyframe-easing"
              css={css_attr_input}
              style={{ width: "30%" }}
              defaultValue={keyframe.easeEnd}
              onChange={onInOutChange}
              // disabled={ease === "" || ease === "linear"}
            >
              <option value="in">in</option>
              <option value="out">out</option>
              <option value="inout">in-out</option>
            </select>
            <select
              id="select-keyframe-easing"
              css={css_attr_input}
              style={{ width: "40%" }}
              defaultValue={keyframe.easeName}
              onChange={onEaseChange}
            >
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
          </div>
        </div>
      </>
    );
  } else {
    element = <div css={css_title}></div>;
  }

  return (
    <div id="inspector" css={css_inspector}>
      {element}

      <button
        css={css_exportBtn}
        onClick={() => {
          if (props.anim) exportAnim(props.anim);
        }}
      >
        <FontAwesomeIcon icon={icon({ name: "file-export" })} />
        <span css={css_exportBtn_text}>Export</span>
      </button>
    </div>
  );
}
