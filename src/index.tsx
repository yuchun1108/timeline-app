import React from "react";
import ReactDOM from "react-dom/client";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import MyApp from "./MyApp";
import { Anim } from "./global/Anim";
import "./index.css";
import Entity from "./three/Entity";
import World from "./three/World";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const anim = new Anim();
anim.addTrack("track-A");
anim.addTrack("track-B");

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
});

const a = 1.5;
const b = 2.0;
const c = 1.6;

const str = "123";

const valueA = JSON.parse(str);

const arr = new Array<number>(3);
arr[0] = 1;
arr[1] = 2;
arr[2] = 3;

const u = undefined;

console.log(Array.isArray(u));

let aa = 7.1;
const bb = 2;
aa %= bb;
console.log(aa);
