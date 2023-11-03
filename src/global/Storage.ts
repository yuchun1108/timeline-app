import { toast } from "react-toastify";
import { Object3D } from "three";
import World from "../three/World";

interface EntityAnimPair {
  key: string;
  animJson: string;
}

export function worldAnimToJson(
  world: World,
  space: string | undefined = undefined
): string {
  const animDatas: EntityAnimPair[] = [];

  const objs = world.getAllObjects();
  objs.forEach((obj) => {
    const entity = obj.entity;
    if (!entity) return;
    const key = getObjKey(obj);
    const animJson = entity.animController.anim.toJson();

    if (key) animDatas.push({ key, animJson: animJson });
  });

  const animDatasJson = JSON.stringify(animDatas, null, space);
  return animDatasJson;
}

export function worldAnimFromJson(world: World, animDatasJson: string) {
  const animDatas: EntityAnimPair[] = JSON.parse(animDatasJson);

  const objs = world.getAllObjects();
  objs.forEach((obj) => {
    const entity = obj.entity;
    if (!entity) return;
    const key = getObjKey(obj);

    const animData = animDatas.find((_animData) => _animData.key === key);
    const animJson = animData?.animJson;
    if (animJson) {
      entity.animController.anim.fromJson(animJson);
    }
  });
}

export function saveWorldAnim(world: World) {
  const objs = world.getAllObjects();
  localStorage.setItem("pathList", getPathList(objs));

  const animDatasJson = worldAnimToJson(world);
  localStorage.setItem("animDatas", animDatasJson);
}

export function loadWorldAnim(world: World) {
  const objs = world.getAllObjects();
  const pathList = localStorage.getItem("pathList");
  if (pathList !== getPathList(objs)) {
    console.log("world paths are different.");
    console.log(pathList);
    console.log(getPathList(objs));
    return;
  }

  const animDatasJson = localStorage.getItem("animDatas");
  if (!animDatasJson) return;

  try {
    worldAnimFromJson(world, animDatasJson);
  } catch (e) {
    toast.error("An error occurred while reading worldAnim");
    console.error(e);
  }
}

function getObjKey(obj: Object3D): string | undefined {
  return obj.entity?.path;
}

function getPathList(objs: Object3D[]): string {
  const pathList = objs.map((obj) => obj.entity?.path);
  return pathList.toString();
}
