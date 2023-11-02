/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import { ScrollSync } from "react-scroll-sync";
import { Tooltip } from "react-tooltip";
import Controller from "../Controller";
import Inspector from "../Inspector";
import ModelSelector from "../ModelSelector";
import NameLabelGroup from "../NameLabelGroup";
import Timebar from "../Timebar";
import TimelineGroup from "../TimelineGroup";
import FrameSize, { loadFrameSize, saveFrameSize } from "../global/FrameSize";
import AnimSelector from "../three/AnimSelector";
import World from "../three/World";
import { Track } from "../three/anim/Anim";

interface MyAppProps {
  world: World;
  selector: AnimSelector;
}

function GetDefaultObject(world: World) {
  const selectObj = localStorage.getItem("selected-object");
  if (!selectObj) return undefined;

  const selectObjId = Number(selectObj);
  return world.scene.getObjectById(selectObjId);
}

const timeBarHeight = 26;

export default function MyApp(props: MyAppProps) {
  const { world, selector } = props;
  const [object3D, setObject3D] = useState<THREE.Object3D | undefined>(
    undefined
  );
  const [tracks, setTracks] = useState<Track[] | undefined>(undefined);

  const [frameSize, setFrameSize] = useState<FrameSize>(loadFrameSize());

  const animController = object3D?.entity?.animController;
  const anim = animController?.anim;

  useEffect(() => {
    world.onHierarchyChange.add(() => {
      setObject3D(GetDefaultObject(world));
      // const objs = world.getAllObjects();
      // if (objs.length > 0) {

      //   setObject3D(objs[0]);
      // }
    });
  }, [world]);

  function onObjectSelect(objId: number) {
    const obj = world.scene.getObjectById(objId);
    setObject3D(obj);

    if (obj && obj.entity) {
      console.log(obj.id);
      localStorage.setItem("selected-object", obj.id.toString());
    }
  }

  const onTracksChange = useCallback((tracks: Track[]) => {
    setTracks([...tracks]);
  }, []);

  useEffect(() => {
    anim?.onTracksChange.add(onTracksChange);
    selector.setAnim(anim, animController);
    if (anim) {
      setTracks([...anim.tracks]);
      setFrameSize((prev) => ({ ...prev, fps: anim.fps }));
    } else {
      setTracks(undefined);
      setFrameSize((prev) => ({ ...prev, fps: 24 }));
    }
    return () => {
      anim?.onTracksChange.remove(onTracksChange);
    };
  }, [object3D, selector, onTracksChange]);

  useEffect(() => {
    saveFrameSize(frameSize);
  }, [frameSize]);

  function onAddTrack() {
    if (anim) {
      anim.addTrack();
    }
  }

  function onFrameCountChange(count: number) {
    setFrameSize((prev) => {
      return { ...prev, count };
    });
  }

  function onFrameWidthChange(width: number) {
    setFrameSize((prev) => {
      return { ...prev, width };
    });
  }

  const css_myApp = css`
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 200px;
    display: grid;
    grid-template-columns: 200px auto 200px;
    grid-template-rows: 34px ${timeBarHeight - 1}px auto;
    grid-template-areas:
      "controller controller controller"
      "model-selector timebar inspector"
      "name-label timeline inspector";
    font-family: sans-serif;
    color: #b1b8ba;
  `;

  return (
    <ScrollSync>
      <div id="my-app" css={css_myApp}>
        <Controller
          frameSize={frameSize}
          animController={animController}
          onFrameCountChange={onFrameCountChange}
          onFrameWidthChange={onFrameWidthChange}
        />

        <ModelSelector
          world={world}
          onObjectSelect={onObjectSelect}
          onAddTrack={onAddTrack}
        />
        <NameLabelGroup
          height={frameSize.height}
          selector={selector}
          tracks={tracks}
        />

        <Timebar
          frameSize={frameSize}
          height={timeBarHeight}
          animController={animController}
          fps={anim?.fps ?? 30}
        />
        <TimelineGroup
          frameSize={frameSize}
          selector={selector}
          anim={anim}
          tracks={tracks}
        />

        <Inspector world={world} anim={anim} selector={selector} />
        <Tooltip id="tooltip" />
      </div>
    </ScrollSync>
  );
}
