import { Object3D } from "three";
import Entity from "../three/Entity";
import World from "../three/World";

export function saveWorldAnim(world: World) {
  const objs = world.getAllObjects();
  localStorage.setItem("pathList", getPathList(objs));

  objs.forEach((obj) => {
    const entity = obj.entity;
    if (!entity) return;
    const key = getObjKey(entity);
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
    const key = getObjKey(entity);
    const json = localStorage.getItem(key);
    if (json) entity.animController.anim.fromJson(json);
  });
}

function getObjKey(entity: Entity) {
  return "anim_" + entity.path;
}

function getPathList(objs: Object3D[]): string {
  const pathList = objs.map((obj) => obj.entity?.path);
  return pathList.toString();
}
