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
import FrameSize from "../global/FrameSize";
import AnimSelector from "../three/AnimSelector";
import World from "../three/World";
import { Anim, Track } from "../three/anim/Anim";
import AnimController from "../three/anim/AnimController";

interface MyAppProps {
  world: World;
  selector: AnimSelector;
}

export default function MyApp(props: MyAppProps) {
  const { world } = props;
  const [animController, setAnimController] = useState<
    AnimController | undefined
  >(
    world.getAllObjects().length > 0
      ? world.getAllObjects()[0].entity?.animController
      : undefined
  );
  const [anim, setAnim] = useState<Anim | undefined>(
    world.getAllObjects().length > 0
      ? world.getAllObjects()[0].entity?.animController.anim
      : undefined
  );
  const [tracks, setTracks] = useState<Track[] | undefined>(undefined);

  const timeBarHeight = 26;
  const [frameSize, setFrameSize] = useState<FrameSize>({
    width: 20,
    count: 60,
    height: 20,
    fps: 24,
  });

  useEffect(() => {
    world.onHierarchyChange.add(() => {
      const objs = world.getAllObjects();
      if (objs.length > 0) {
        setAnimController(objs[0].entity?.animController);
        setAnim(objs[0].entity?.animController.anim);
      }
    });
  }, [world]);

  function onObjectSelect(objId: number) {
    const obj = world.scene.getObjectById(objId);

    setAnimController(obj?.entity?.animController);
    setAnim(obj?.entity?.animController.anim);
  }

  const onTracksChange = useCallback((tracks: Track[]) => {
    setTracks([...tracks]);
  }, []);

  useEffect(() => {
    anim?.onTracksChange.add(onTracksChange);
    props.selector.setAnim(anim, animController);
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
  }, [anim, props.selector, animController, onTracksChange]);

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
    grid-template-rows: 30px ${timeBarHeight - 1}px auto;
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
          selector={props.selector}
          tracks={tracks}
        />

        <Timebar
          frameSize={frameSize}
          height={timeBarHeight}
          animController={animController}
        />
        <TimelineGroup
          frameSize={frameSize}
          selector={props.selector}
          anim={anim}
          tracks={tracks}
        />

        <Inspector world={world} anim={anim} selector={props.selector} />
        <Tooltip id="tooltip" />
      </div>
    </ScrollSync>
  );
}
