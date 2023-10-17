import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MyApp from "./MyApp";
import { animInfo, AnimNode, Keyframe } from "./global/AnimInfo";
import { v4 as uuidv4 } from "uuid";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

  root.render(
    <React.StrictMode>
      <MyApp
        animInfo={animInfo}
      />
    </React.StrictMode>
  );