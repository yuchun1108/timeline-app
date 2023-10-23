import { useEffect, useState } from "react";
import World from "../../three/World";

interface InspectorProps {
  world: World;
  onAddTrack: () => void;
  onObjectSelect: (objId: number) => void;
}

interface Option {
  path: string | undefined;
  id: number;
  uuid: string;
}

export default function Controller(props: InspectorProps) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const { world } = props;
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
  }, []);

  function onOptionSelect(e: any) {
    props.onObjectSelect(Number(e.target.value));
  }

  return (
    <div id="controller">
      <select onChange={onOptionSelect}>
        {options.map((opt) => (
          <option key={opt.uuid} value={opt.id}>
            {opt.path}
          </option>
        ))}
      </select>
      <button>play</button>
      <button onClick={props.onAddTrack}>+</button>
    </div>
  );
}
