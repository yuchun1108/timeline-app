import React from "react";
import ReactDOM from "react-dom/client";
import MyApp from "./MyApp";
import { AnimInfo } from "./global/AnimInfo";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const animInfo = new AnimInfo();
animInfo.addChannel("channel-A");
animInfo.addChannel("channel-B");

root.render(
  <React.StrictMode>
    <MyApp animInfo={animInfo} />
  </React.StrictMode>
);
