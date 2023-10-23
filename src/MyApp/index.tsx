import { useEffect, useState } from "react";
import Inspector from "../Inspector";
import Timebar from "../Timebar";
import TimelineGroup from "../TimelineGroup";
import { Anim, AnimNode, Track } from "../global/Anim";
import { isArrayEqual } from "../global/Common";
import FrameSize from "../global/FrameSize";
import World from "../three/World";
import Controller from "./components/Controller";
import NameLabelGroup from "./components/NameLabelGroup";

interface MyAppProps {
  world: World;
}

export default function MyApp(props: MyAppProps) {
  const [anim, setAnim] = useState<Anim | undefined>(undefined);
  const [tracks, setTracks] = useState<Track[] | undefined>(undefined);

  const [selectedNodes, setSelectedNodes] = useState<AnimNode[]>([]);

  const timeBarHeight = 30;
  const [frameSize, setFrameSize] = useState<FrameSize>({
    width: 20,
    count: 60,
    height: 20,
    fps: 24,
  });

  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const { world } = props;
    world.onHierarchyChange.push(() => {
      const objs = world.getAllObjects();
      if (objs.length > 0) {
        setAnim(objs[0].entity?.animController.anim);
      }
    });
  }, []);

  useEffect(() => {
    if (anim) {
      setTracks([...anim.tracks]);
      setFrameSize((prev) => ({ ...prev, fps: anim.fps }));
    } else {
      setTracks(undefined);
      setFrameSize((prev) => ({ ...prev, fps: 24 }));
    }
    setSelectedNodes([]);
  }, [anim]);

  function onObjectSelect(objId: number) {
    const obj = props.world.scene.getObjectById(objId);
    setAnim(obj?.entity?.animController.anim);
  }

  function onTrackSelect(track: Track) {
    setSelectedNodes([track]);
  }

  function onKeyframeSelect(
    trackUuids: string[],
    frameIndexMin: number,
    frameIndexMax: number
  ) {
    if (!anim) return;

    const _selectedNodes: AnimNode[] = [];

    for (let i = 0; i < anim.tracks.length; i++) {
      const track = anim.tracks[i];
      if (trackUuids.includes(track.uuid)) {
        for (let j = 0; j < track.keyframes.length; j++) {
          const keyframe = track.keyframes[j];
          if (
            keyframe.index >= frameIndexMin &&
            keyframe.index <= frameIndexMax
          ) {
            _selectedNodes.push(keyframe);
          }
        }
      }
    }
    setSelectedNodes((prev) => {
      if (isArrayEqual(prev, _selectedNodes)) {
        return prev;
      }
      return _selectedNodes;
    });
  }

  function onAddTrack() {
    if (anim) {
      anim.addTrack();
      setTracks([...anim.tracks]);
    }
  }

  function onKeyDown(e: any) {
    if (e.code === "Delete") {
      if (anim === undefined) return;

      if (selectedNodes.length === 0) return;

      if (selectedNodes[0].discriminator === "track") {
        anim.removeTrack(selectedNodes[0].uuid);
        setTracks([...anim.tracks]);
      } else if (selectedNodes[0].discriminator === "keyframe") {
        const keyframeUuids = selectedNodes
          .filter((node) => node.discriminator === "keyframe")
          .map((node) => node.uuid);

        if (keyframeUuids.length > 0) {
          anim.removeKeyframe(keyframeUuids);
          setSelectedNodes([]);
        }
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [anim, selectedNodes]);

  const timelineHeight = 20;

  function onTimelineGroupScroll(scrollLeft: number) {
    setScrollLeft(scrollLeft);
  }

  return (
    <div id="my-app" style={{ gridTemplateRows: `${timeBarHeight}px auto` }}>
      <Controller
        world={props.world}
        onObjectSelect={onObjectSelect}
        onAddTrack={onAddTrack}
      />
      <NameLabelGroup
        height={timelineHeight}
        selectedNodes={selectedNodes}
        tracks={tracks}
        onTrackSelect={onTrackSelect}
      />

      <Timebar
        frameSize={frameSize}
        height={timeBarHeight}
        scrollLeft={scrollLeft}
      />
      <TimelineGroup
        frameSize={frameSize}
        selectedNodes={selectedNodes}
        anim={anim}
        tracks={tracks}
        onKeyframeSelect={onKeyframeSelect}
        onTimelineGroupScroll={onTimelineGroupScroll}
      />

      <Inspector
        world={props.world}
        anim={anim}
        selectedNodes={selectedNodes}
        key={selectedNodes.length > 0 ? selectedNodes[0].uuid : "empty"}
      />
    </div>
  );
}
