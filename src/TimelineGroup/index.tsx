import { ReactNode, useEffect, useReducer, useRef, useState } from "react";
import { Anim, AnimInfo, Track } from "../global/Anim";
import FrameSize from "../global/FrameSize";
import MarqueeRect from "./components/MarqueeRect";
import Timeline from "./components/Timeline";

interface TimelineGroupProps {
  frameSize: FrameSize;
  selectedNodes: Anim[];
  animInfo: AnimInfo;
  tracks: Track[];
  onKeyframeSelect: (
    trackUuids: string[],
    frameIndexMin: number,
    frameIndexMax: number
  ) => void;
}

interface MarqueePos {
  trackIndex: number;
  frameIndex: number;
}

export default function TimelineGroup(props: TimelineGroupProps) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [moveOffset, setMoveOffset] = useState(0);

  const clickedKeyframeId = useRef<string>("");

  const isMoving = useRef(false);
  const beginMoveIndex = useRef(0);
  const currMoveIndex = useRef(0);

  const isMarqueeMaking = useRef(false);
  const [isMarqueeShow, setMarqueeShow] = useState(false);
  const beginMarqueePos = useRef({
    trackIndex: 0,
    frameIndex: 0,
  });
  const [endMarqueePos, setEndMarqueePos] = useState<MarqueePos>({
    trackIndex: 0,
    frameIndex: 0,
  });

  console.log("refresh timeline group");

  function getMarqueeTrackIndexMin() {
    return isMarqueeMaking.current
      ? Math.min(beginMarqueePos.current.trackIndex, endMarqueePos.trackIndex)
      : 0;
  }

  function getMarqueeTrackIndexMax() {
    return isMarqueeMaking.current
      ? Math.max(beginMarqueePos.current.trackIndex, endMarqueePos.trackIndex)
      : 0;
  }

  function getMarqueeFrameIndexMin() {
    return isMarqueeMaking.current
      ? Math.min(beginMarqueePos.current.frameIndex, endMarqueePos.frameIndex)
      : 0;
  }

  function getMarqueeFrameIndexMax() {
    return isMarqueeMaking.current
      ? Math.max(beginMarqueePos.current.frameIndex, endMarqueePos.frameIndex)
      : 0;
  }

  function getFrameIndex(posX: number) {
    const frameWidth = props.frameSize.width;
    return Math.round((posX - frameWidth * 0.5) / frameWidth);
  }

  function onMouseDown(e: any) {
    if (e.target.nodeName === "CANVAS") {
      const trackUuid = e.target.dataset["trackuuid"];
      const trackIndex = e.target.dataset["index"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);
      currMoveIndex.current = beginMoveIndex.current = frameIndex;

      const track = props.tracks.find((track) => track.uuid === trackUuid);
      if (track) {
        isMarqueeMaking.current = true;
        beginMarqueePos.current = {
          trackIndex: trackIndex,
          frameIndex: frameIndex,
        };
        props.onKeyframeSelect([trackUuid], frameIndex, frameIndex);
      }
    } else if (
      e.target.nodeName === "DIV" &&
      e.target.classList.contains("keyframe")
    ) {
      const keyframeUuid = e.target.dataset["keyframeuuid"];
      const trackUuid = e.target.parentNode.dataset["trackuuid"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;

      const frameIndex = getFrameIndex(posX);
      currMoveIndex.current = beginMoveIndex.current = frameIndex;
      isMoving.current = true;

      if (!props.selectedNodes.find((obj) => obj.uuid === keyframeUuid)) {
        props.onKeyframeSelect([trackUuid], frameIndex, frameIndex);
      }

      clickedKeyframeId.current = keyframeUuid;
    }
  }

  function onMouseMove(e: any) {
    const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
    const frameIndex = getFrameIndex(posX);

    if (isMoving.current) {
      if (frameIndex >= 0 && frameIndex !== currMoveIndex.current) {
        currMoveIndex.current = frameIndex;
        setMoveOffset(currMoveIndex.current - beginMoveIndex.current);

        clickedKeyframeId.current = "";
      }
    } else if (isMarqueeMaking.current) {
      if (e.target.nodeName === "CANVAS") {
        const trackIndex = e.target.dataset["index"];

        const _isMarqueeShow =
          trackIndex !== beginMarqueePos.current.trackIndex ||
          frameIndex !== beginMarqueePos.current.frameIndex;

        if (
          _isMarqueeShow &&
          (endMarqueePos.trackIndex !== trackIndex ||
            endMarqueePos.frameIndex !== frameIndex)
        ) {
          setEndMarqueePos({
            trackIndex: trackIndex,
            frameIndex: frameIndex,
          });
        }

        setMarqueeShow(_isMarqueeShow);
      }
    }
  }

  useEffect(() => {
    const _trackUuids: string[] = [];
    for (let i = 0; i < props.tracks.length; i++) {
      if (i >= getMarqueeTrackIndexMin() && i <= getMarqueeTrackIndexMax()) {
        const _track = props.tracks[i];
        _trackUuids.push(_track.uuid);
      }
    }

    props.onKeyframeSelect(
      _trackUuids,
      getMarqueeFrameIndexMin(),
      getMarqueeFrameIndexMax()
    );
  }, [endMarqueePos]);

  function onMouseUp(e: any) {
    // if (
    //   e.target.nodeName === "DIV" &&
    //   e.target.classList.contains("keyframe") &&
    //   clickedKeyframeId.current !== ""
    // ){
    const keyframeUuid = e.target.dataset["keyframeuuid"];
    if (keyframeUuid === clickedKeyframeId.current) {
      const trackUuid = e.target.parentNode.dataset["trackuuid"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);
      props.onKeyframeSelect([trackUuid], frameIndex, frameIndex);
    }

    if (isMoving.current) {
      isMoving.current = false;
      if (props.selectedNodes.length > 0) {
        const hasChange = props.animInfo.moveKeyFrame(
          props.selectedNodes,
          moveOffset
        );
        if (hasChange) forceUpdate();
      }
      setMoveOffset(0);
      //   props.onDragIndexEnd();
    } else if (isMarqueeMaking.current) {
      isMarqueeMaking.current = false;
      setMarqueeShow(false);
    }
  }

  function onDoubleClick(e: any) {
    console.log(e);
    if (e.target.nodeName === "CANVAS") {
      const trackUuid = e.target.dataset["trackuuid"];
      const posX = e.nativeEvent.offsetX;
      const index = getFrameIndex(posX);

      props.animInfo.addKeyframe(trackUuid, index);
      forceUpdate();
    }
  }

  function onMouseLeave(e: any) {
    if (isMoving.current) {
      isMoving.current = false;
      setMoveOffset(0);
    } else if (isMarqueeMaking.current) {
      isMarqueeMaking.current = false;
      setMarqueeShow(false);
    }
  }

  const timelines: ReactNode[] = [];

  for (let i = 0; i < props.tracks.length; i++) {
    const track = props.tracks[i];
    timelines.push(
      <Timeline
        frameSize={props.frameSize}
        trackUuid={track.uuid}
        keyframes={track.keyframes}
        index={i}
        key={track.uuid}
        moveOffset={moveOffset}
        selectedNodes={props.selectedNodes}
      />
    );
  }

  return (
    <div
      id="timeline-group"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}
      onMouseLeave={onMouseLeave}
    >
      {isMarqueeShow ? (
        <MarqueeRect
          frameSize={props.frameSize}
          trackIndexMin={getMarqueeTrackIndexMin()}
          trackIndexMax={getMarqueeTrackIndexMax()}
          frameIndexMin={getMarqueeFrameIndexMin()}
          frameIndexMax={getMarqueeFrameIndexMax()}
        />
      ) : undefined}
      {timelines}
    </div>
  );
}
