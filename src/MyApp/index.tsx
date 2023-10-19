import { useState } from "react";
import Inspector from "../Inspector";
import Timebar from "../Timebar";
import TimelineGroup from "../TimelineGroup";
import { Anim, AnimInfo, Track } from "../global/Anim";
import { isArrayEqual } from "../global/Common";
import FrameSize from "../global/FrameSize";
import Controller from "./components/Controller";
import NameLabelGroup from "./components/NameLabelGroup";

interface MyAppProps {
  animInfo: AnimInfo;
}

export default function MyApp(props: MyAppProps) {
  const [tracks, setTracks] = useState<Track[]>(props.animInfo.tracks);

  const [selectedNodes, setSelectedNodes] = useState<Anim[]>([]);

  const timeBarHeight = 30;
  const [frameSize, setFrameSize] = useState<FrameSize>({
    width: 20,
    count: 20,
    totalWidth: 20 * 20,
    height: 20,
    fps: 24,
  });

  function onTrackSelect(track: Track) {
    setSelectedNodes([track]);
  }

  function onKeyframeSelect(
    trackUuids: string[],
    frameIndexMin: number,
    frameIndexMax: number
  ) {
    const _selectedNodes: Anim[] = [];

    for (let i = 0; i < props.animInfo.tracks.length; i++) {
      const track = props.animInfo.tracks[i];
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
        console.log("is same");
        return prev;
      }
      console.log("is not same");
      return _selectedNodes;
    });
  }

  // for(let i=0;i<objs.length;i++)
  // {
  //   const obj = objs[i];
  //   console.log(obj instanceof Track);
  // }

  function onAddTrack() {
    props.animInfo.addTrack();
    setTracks(props.animInfo.tracks);
  }

  const timelineHeight = 20;

  return (
    <div id="my-app" style={{ gridTemplateRows: `${timeBarHeight}px auto` }}>
      <Controller onAddTrack={onAddTrack} />
      <NameLabelGroup
        height={timelineHeight}
        selectedNodes={selectedNodes}
        tracks={tracks}
        onTrackSelect={onTrackSelect}
      />

      <Timebar frameSize={frameSize} height={timeBarHeight} />
      <TimelineGroup
        frameSize={frameSize}
        selectedNodes={selectedNodes}
        animInfo={props.animInfo}
        tracks={tracks}
        onKeyframeSelect={onKeyframeSelect}
      />

      <Inspector
        animInfo={props.animInfo}
        selectedNodes={selectedNodes}
        key={selectedNodes.length > 0 ? selectedNodes[0].uuid : "empty"}
      />
    </div>
  );
}
