import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadModel(
  fileName: string,
  arrBuff: ArrayBuffer
): Promise<THREE.Object3D> {
  return new Promise<THREE.Object3D>((resolve, reject) => {
    fileName = fileName.toLowerCase();
    console.log(fileName);
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
      reject(
        new ErrorEvent(`can only import fbx or glb/gltf file. ${fileName}`)
      );
    }
  });
}
