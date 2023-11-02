import { Object3D } from "three";
import World from "../three/World";

export function saveWorldAnim(world: World) {
  const objs = world.getAllObjects();
  localStorage.setItem("pathList", getPathList(objs));

  objs.forEach((obj) => {
    const entity = obj.entity;
    if (!entity) return;
    const key = getObjKey(obj);
    localStorage.setItem(key, entity.animController.anim.toJson());
  });
}

export function loadWorldAnim(world: World) {
  const objs = world.getAllObjects();
  const pathList = localStorage.getItem("pathList");

  if (pathList !== getPathList(objs)) {
    console.log("world is not the same");
    return;
  }

  objs.forEach((obj) => {
    const entity = obj.entity;
    if (!entity) return;
    const key = getObjKey(obj);
    const json = localStorage.getItem(key);
    if (json) entity.animController.anim.fromJson(json);
  });
}

function getObjKey(obj: Object3D) {
  return "anim_" + obj.id;
}

function getPathList(objs: Object3D[]): string {
  const pathList = objs.map((obj) => obj.entity?.path);
  return pathList.toString();
}
