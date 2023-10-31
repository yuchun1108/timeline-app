/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
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

export default function ModelSelector(props: ModelSelectorProps) {
  const { world } = props;
  const [options, setOptions] = useState<Option[]>(
    world.getAllObjects()?.map<Option>((obj) => ({
      path: obj.entity ? obj.entity.path : "no path",
      id: obj.id,
      uuid: obj.uuid,
    }))
  );

  useEffect(() => {
    world.onHierarchyChange.add(() => {
      const objs = world.getAllObjects();
      setOptions(
        objs.map<Option>((obj) => ({
          path: obj.entity ? obj.entity.path : "no path",
          id: obj.id,
          uuid: obj.uuid,
        }))
      );
    });
  }, []);

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
      <select aria-label="model-selector" onChange={onOptionSelect}>
        {options.map((opt) => (
          <option key={opt.uuid} value={opt.id}>
            {opt.path}
          </option>
        ))}
      </select>
      <button
        aria-label="add-track"
        className="btn"
        css={css_btn}
        onClick={props.onAddTrack}
      >
        <a data-tooltip-id="tooltip" data-tooltip-content="Add Track">
          <FontAwesomeIcon icon={icon({ name: "plus" })} />
        </a>
      </button>
    </div>
  );
}
