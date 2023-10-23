import React from "react";
import ReactDOM from "react-dom/client";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import MyApp from "./MyApp";
import { loadWorldAnim } from "./global/Storage";
import "./index.css";
import Entity from "./three/Entity";
import World from "./three/World";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const world = new World(200);

root.render(
  <React.StrictMode>
    <MyApp world={world} />
  </React.StrictMode>
);

const loader = new FBXLoader();
loader.load("Box.fbx", function (object) {
  // const mixer = new THREE.AnimationMixer( object );

  // const action = mixer.clipAction( object.animations[ 0 ] );
  // action.play();

  // object.traverse( function ( child ) {

  //   if ( child.isMesh ) {

  //     child.castShadow = true;
  //     child.receiveShadow = true;

  //   }

  // } );

  // scene.add( object );
  if (object.type === "Group") {
    object.name = "Box";
  }
  object.scale.set(0.1, 0.1, 0.1);
  object.traverse((obj) => {
    obj.entity = new Entity(obj);
    console.log(obj);
  });
  world.addObject(object);

  console.log(world.scene);
  console.log(object.children.find((c) => c.name === "Cube"));

  loadWorldAnim(world);
});
