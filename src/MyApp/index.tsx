import { useCallback, useEffect, useState } from "react";
import { ScrollSync } from "react-scroll-sync";
import { Tooltip } from "react-tooltip";
import Controller from "../Controller";
import Inspector from "../Inspector";
import ModelSelector from "../ModelSelector";
import Timebar from "../Timebar";
import TimelineGroup from "../TimelineGroup";
import { isArrayEqual } from "../global/Common";
import FrameSize from "../global/FrameSize";
import World from "../three/World";
import { Anim, AnimNode, Keyframe, Track } from "../three/anim/Anim";
import AnimController from "../three/anim/AnimController";
import NameLabelGroup from "./components/NameLabelGroup";

interface MyAppProps {
  world: World;
}

export default function MyApp(props: MyAppProps) {
  const { world } = props;
  const [animController, setAnimController] = useState<
    AnimController | undefined
  >(undefined);
  const [anim, setAnim] = useState<Anim | undefined>(undefined);
  const [tracks, setTracks] = useState<Track[] | undefined>(undefined);

  const [selectedNodes, setSelectedNodes] = useState<AnimNode[]>([]);

  const timeBarHeight = 26;
  const [frameSize, setFrameSize] = useState<FrameSize>({
    width: 20,
    count: 60,
    height: 20,
    fps: 24,
  });

  useEffect(() => {
    world.onHierarchyChange.push(() => {
      const objs = world.getAllObjects();
      if (objs.length > 0) {
        setAnimController(objs[0].entity?.animController);
        setAnim(objs[0].entity?.animController.anim);
      }
    });
  }, [world]);

  useEffect(() => {
    if (anim) {
      setTracks([...anim.tracks]);
      setFrameSize((prev) => ({ ...prev, fps: anim.fps }));
    } else {
      setTracks(undefined);
      setFrameSize((prev) => ({ ...prev, fps: 24 }));
    }
    setSelectedNodes([]);

    if (anim) anim.onAddKeyframe = onAddKeyframe;

    return () => {
      if (anim) anim.onAddKeyframe = undefined;
    };
  }, [anim]);

  function onAddKeyframe(keyframe: AnimNode) {
    setSelectedNodes([keyframe]);
  }

  function onObjectSelect(objId: number) {
    const obj = world.scene.getObjectById(objId);

    setAnimController(obj?.entity?.animController);
    setAnim(obj?.entity?.animController.anim);
  }

  function onTrackSelect(track: Track) {
    setSelectedNodes([track]);
  }

  const onKeyframeSelect = useCallback(
    (trackUuids: string[], frameIndexMin: number, frameIndexMax: number) => {
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
    },
    [anim]
  );

  function onAddTrack() {
    if (anim) {
      anim.addTrack();
      setTracks([...anim.tracks]);
    }
  }

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.code === "Delete") {
        if (anim === undefined) return;

        if (selectedNodes.length === 0) return;

        if (selectedNodes[0] instanceof Track) {
          anim.removeTrack(selectedNodes[0].uuid);
          setTracks([...anim.tracks]);
        } else if (selectedNodes[0] instanceof Keyframe) {
          const keyframeUuids = selectedNodes
            .filter((node) => node instanceof Keyframe)
            .map((node) => node.uuid);

          if (keyframeUuids.length > 0) {
            anim.removeKeyframe(keyframeUuids);
            setSelectedNodes([]);
          }
        }
      }
    },
    [anim, selectedNodes]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  function onTimelineGroupScroll(scrollLeft: number) {
    // if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft;
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

  return (
    <ScrollSync>
      <div
        id="my-app"
        style={{ gridTemplateRows: `28px ${timeBarHeight - 1}px auto` }}
      >
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
          selectedNodes={selectedNodes}
          tracks={tracks}
          onTrackSelect={onTrackSelect}
        />

        <Timebar
          frameSize={frameSize}
          height={timeBarHeight}
          animController={animController}
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
          world={world}
          anim={anim}
          selectedNodes={selectedNodes}
          key={selectedNodes.length > 0 ? selectedNodes[0].uuid : "empty"}
        />
        <Tooltip id="tooltip" />
      </div>
    </ScrollSync>
  );
}
