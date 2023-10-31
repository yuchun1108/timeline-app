import React from "react";
import ReactDOM from "react-dom/client";
import FileLoaderDiv from "./FileLoaderDiv";
import MyApp from "./MyApp";
import { stringToArrayBuff } from "./global/Common";
import { loadWorldAnim } from "./global/Storage";
import "./index.css";
import AnimSelector from "./three/AnimSelector";
import { loadModel } from "./three/ModelLoader";
import World from "./three/World";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const world = new World(200);
const selector = new AnimSelector();

root.render(
  <React.StrictMode>
    <FileLoaderDiv world={world} />
    <MyApp world={world} selector={selector} />
  </React.StrictMode>
);

const lastModelName = localStorage.getItem("modelName");
const lastModelData = localStorage.getItem("model");
if (lastModelName && lastModelData) {
  const arrBuff = stringToArrayBuff(lastModelData);
  loadModel(lastModelName, arrBuff)
    .then((object) => {
      world.setGroup(object);
      loadWorldAnim(world);
    })
    .catch((e) => {
      console.log(e);
    });
}
