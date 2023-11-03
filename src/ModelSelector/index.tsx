/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import World from "../three/World";

interface ModelSelectorProps {
  world: World;
  onAddTrack: () => void;
  onObjectSelect: (objId: number) => void;
}

interface Option {
  path: string | undefined;
  id: number;
  uuid: string;
}

const css_selector = css`
  width: 80%;
`;

function getModelOptions(world: World) {
  return world.getAllObjects()?.map<Option>((obj) => ({
    path: obj.entity ? obj.entity.path : "no path",
    id: obj.id,
    uuid: obj.uuid,
  }));
}

export default function ModelSelector(props: ModelSelectorProps) {
  const { world } = props;
  const selectorRef = useRef<HTMLSelectElement>(null);
  const [options, setOptions] = useState<Option[]>(getModelOptions(world));

  useEffect(() => {
    world.onHierarchyChange.add(() => {
      setOptions(getModelOptions(world));
    });
  }, [world]);

  useEffect(() => {
    const selectObj = localStorage.getItem("selected-object");

    if (selectorRef.current) {
      if (selectObj) {
        selectorRef.current.value = selectObj;
      }
    }
  }, [options]);

  function onOptionSelect(e: any) {
    props.onObjectSelect(Number(e.target.value));
  }

  const css_btn = css`
    background: none;
    border: none;
    float: right;
  `;

  return (
    <div
      id="model-selector"
      css={css`
        grid-area: model-selector;
        background-color: #293538;
        padding: 3px;
      `}
    >
      <select
        ref={selectorRef}
        css={css_selector}
        aria-label="model-selector"
        onChange={onOptionSelect}
      >
        {options.map((opt) => (
          <option key={opt.uuid} value={opt.id}>
            {opt.path}
          </option>
        ))}
      </select>
      <span data-tooltip-id="tooltip" data-tooltip-content="Add Track">
        <button
          aria-label="add-track"
          className="btn"
          css={css_btn}
          onClick={props.onAddTrack}
        >
          <FontAwesomeIcon icon={icon({ name: "plus" })} />
        </button>
      </span>
    </div>
  );
}
