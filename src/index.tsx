import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MyApp from "./MyApp";
import { AnimInfo, KeyFrameInfo } from "./global/AnimInfo";
import { v4 as uuidv4 } from 'uuid';


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const animInfo: AnimInfo = {
  keyFrames: [],
};

function onAddKeyFrame(index: number) {
  const keyFrame = animInfo.keyFrames.find((k) => k.index === index);
  if (keyFrame === undefined) {
    console.log("add key frame", index);
    const keyFrame: KeyFrameInfo = { index: index, uuid:uuidv4()};
    animInfo.keyFrames.push(keyFrame);
    render();
  }
}

function render() {
  root.render(<React.StrictMode>
    <MyApp animInfo={animInfo}
    onAddKeyFrame={onAddKeyFrame} />
  </React.StrictMode>);
}

render();
