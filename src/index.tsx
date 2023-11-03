import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileLoaderDiv from "./FileLoaderDiv";
import MyApp from "./MyApp";
import TopController from "./TopController";
import { stringToArrayBuff } from "./global/Common";
import { loadWorldAnim } from "./global/Storage";
import "./index.css";
import AnimSelector from "./three/AnimSelector";
import { loadDemo, loadModel } from "./three/ModelLoader";
import World from "./three/World";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const world = new World(200);
const selector = new AnimSelector();

root.render(
  <React.StrictMode>
    <FileLoaderDiv world={world} />
    <TopController world={world} />
    <MyApp world={world} selector={selector} />
    <ToastContainer
      autoClose={1500}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover
      theme="dark"
    />
  </React.StrictMode>
);

const lastModelName = localStorage.getItem("modelName");
const lastModelData = localStorage.getItem("model");

if (lastModelName === "demoSecne" && lastModelData === "demoScene") {
  loadDemo(world, false);
} else if (lastModelName && lastModelData) {
  console.log("load", lastModelName);

  const arrBuff = stringToArrayBuff(lastModelData);
  loadModel(lastModelName, arrBuff)
    .then((object) => {
      world.setGroup(object);
      loadWorldAnim(world);
    })
    .catch((e) => {
      toast.error("An error occurred while reading the last file");
      console.error(e);
    });
} else {
  loadDemo(world, true);
}
