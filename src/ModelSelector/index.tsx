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
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    world.onHierarchyChange.push(() => {
      const objs = world.getAllObjects();
      setOptions(
        objs.map<Option>((obj) => ({
          path: obj.entity ? obj.entity.path : "no path",
          id: obj.id,
          uuid: obj.uuid,
        }))
      );
    });
  }, [world]);

  function onOptionSelect(e: any) {
    props.onObjectSelect(Number(e.target.value));
  }
  return (
    <div id="model-selector">
      <select aria-label="model-selector" onChange={onOptionSelect}>
        {options.map((opt) => (
          <option key={opt.uuid} value={opt.id}>
            {opt.path}
          </option>
        ))}
      </select>
      <button className="btn" onClick={props.onAddTrack}>
        <a data-tooltip-id="tooltip" data-tooltip-content="Add Track">
          <FontAwesomeIcon icon={icon({ name: "plus" })} />
        </a>
      </button>
    </div>
  );
}
