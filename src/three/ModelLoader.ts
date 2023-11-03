import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  loadWorldAnim,
  saveWorldAnim,
  worldAnimFromJson,
} from "../global/Storage";
import World from "./World";

export function loadDemo(world: World, loadDefaultAnim: boolean) {
  const loader = new GLTFLoader();
  loader.load(
    "demo/demo.glb",
    (gltf: GLTF) => {
      world.setGroup(gltf.scene);

      if (loadDefaultAnim) {
        console.log("loadDefaultAnim");
        fetch("demo/anim.json")
          .then((res) => res.text())
          .then((text) => {
            worldAnimFromJson(world, text);

            saveWorldAnim(world);

            localStorage.setItem("modelName", "demoSecne");
            localStorage.setItem("model", "demoScene");
          })
          .catch((err) => {
            throw err;
          });
      } else {
        loadWorldAnim(world);
      }
    },
    undefined,
    (err) => {
      console.error(err);
    }
  );
}

export function loadModel(
  fileName: string,
  arrBuff: ArrayBuffer
): Promise<THREE.Object3D> {
  return new Promise<THREE.Object3D>((resolve, reject) => {
    fileName = fileName.toLowerCase();
    if (fileName.endsWith("fbx")) {
      const loader = new FBXLoader();

      try {
        const object = loader.parse(arrBuff, "");
        resolve(object);
      } catch (e) {
        reject(e);
      }
    } else if (fileName.endsWith("glb") || fileName.endsWith("gltf")) {
      const loader = new GLTFLoader();
      loader.parse(
        arrBuff,
        "",
        (gltf: GLTF) => {
          resolve(gltf.scene);
        },
        (e) => {
          reject(e);
        }
      );
    } else {
      reject(new Error(`Can only load fbx or glb/gltf file. ${fileName}`));
    }
  });
}
