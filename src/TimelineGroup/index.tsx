import { ReactNode, useEffect, useReducer, useRef, useState } from "react";
import { AnimInfo, AnimNode, Channel } from "../global/AnimInfo";
import FrameSize from "../global/FrameSize";
import MarqueeRect from "./components/MarqueeRect";
import Timeline from "./components/Timeline";

interface TimelineGroupProps {
  frameSize: FrameSize;
  selectedNodes: AnimNode[];
  animInfo: AnimInfo;
  channels: Channel[];
  onKeyframeSelect: (
    channelIds: string[],
    frameIndexMin: number,
    frameIndexMax: number
  ) => void;
}

interface MarqueePos {
  channelIndex: number;
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
    channelIndex: 0,
    frameIndex: 0,
  });
  const [endMarqueePos, setEndMarqueePos] = useState<MarqueePos>({
    channelIndex: 0,
    frameIndex: 0,
  });

  console.log("refresh timeline group");

  function getMarqueeChannelIndexMin() {
    return isMarqueeMaking.current
      ? Math.min(
          beginMarqueePos.current.channelIndex,
          endMarqueePos.channelIndex
        )
      : 0;
  }

  function getMarqueeChannelIndexMax() {
    return isMarqueeMaking.current
      ? Math.max(
          beginMarqueePos.current.channelIndex,
          endMarqueePos.channelIndex
        )
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
      const channelId = e.target.dataset["channelid"];
      const channelIndex = e.target.dataset["index"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);
      currMoveIndex.current = beginMoveIndex.current = frameIndex;

      const channel = props.channels.find(
        (channel) => channel.id === channelId
      );
      if (channel) {
        isMarqueeMaking.current = true;
        beginMarqueePos.current = {
          channelIndex: channelIndex,
          frameIndex: frameIndex,
        };
        props.onKeyframeSelect([channelId], frameIndex, frameIndex);
      }
    } else if (
      e.target.nodeName === "DIV" &&
      e.target.classList.contains("keyframe")
    ) {
      const keyframeId = e.target.dataset["keyframeid"];
      const channelId = e.target.parentNode.dataset["channelid"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;

      const frameIndex = getFrameIndex(posX);
      currMoveIndex.current = beginMoveIndex.current = frameIndex;
      isMoving.current = true;

      if (!props.selectedNodes.find((obj) => obj.id === keyframeId)) {
        props.onKeyframeSelect([channelId], frameIndex, frameIndex);
      }

      clickedKeyframeId.current = keyframeId;
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
        const channelIndex = e.target.dataset["index"];

        const _isMarqueeShow =
          channelIndex !== beginMarqueePos.current.channelIndex ||
          frameIndex !== beginMarqueePos.current.frameIndex;

        if (
          _isMarqueeShow &&
          (endMarqueePos.channelIndex !== channelIndex ||
            endMarqueePos.frameIndex !== frameIndex)
        ) {
          setEndMarqueePos({
            channelIndex: channelIndex,
            frameIndex: frameIndex,
          });
        }

        setMarqueeShow(_isMarqueeShow);
      }
    }
  }

  useEffect(() => {
    const _channelIds: string[] = [];
    for (let i = 0; i < props.channels.length; i++) {
      if (
        i >= getMarqueeChannelIndexMin() &&
        i <= getMarqueeChannelIndexMax()
      ) {
        const _channel = props.channels[i];
        _channelIds.push(_channel.id);
      }
    }

    props.onKeyframeSelect(
      _channelIds,
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
    const keyframeId = e.target.dataset["keyframeid"];
    if (keyframeId === clickedKeyframeId.current) {
      const channelId = e.target.parentNode.dataset["channelid"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);
      props.onKeyframeSelect([channelId], frameIndex, frameIndex);
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
    if (e.target.nodeName === "CANVAS") {
      const channelId = e.target.dataset["channelid"];
      const posX = e.nativeEvent.offsetX;
      const index = getFrameIndex(posX);

      props.animInfo.addKeyframe(channelId, index);
      // props.onAddKeyFrame(channelId, index);
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

  for (let i = 0; i < props.channels.length; i++) {
    const channel = props.channels[i];
    timelines.push(
      <Timeline
        frameSize={props.frameSize}
        channelId={channel.id}
        keyframes={channel.keyframes}
        index={i}
        key={channel.id}
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
          channelIndexMin={getMarqueeChannelIndexMin()}
          channelIndexMax={getMarqueeChannelIndexMax()}
          frameIndexMin={getMarqueeFrameIndexMin()}
          frameIndexMax={getMarqueeFrameIndexMax()}
        />
      ) : undefined}
      {timelines}
    </div>
  );
}
