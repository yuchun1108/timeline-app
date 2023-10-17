import { ReactNode, useContext, useEffect, useReducer, useRef, useState } from "react";
import { AnimInfo, AnimNode, Channel, Keyframe, addKeyframe, moveKeyFrame } from "../global/AnimInfo";
import Timeline from "./components/Timeline";
import MarqueeRect from "./components/MarqueeRect";

interface TimelineGroupProps {
  width: number;
  timelineHeight:number;
  selectedNodes:AnimNode[];
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
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const beginDragIndex = useRef(0);
  const currDragIndex = useRef(0);

  const isSelecting = useRef(false);
  const [isMarqueeShow, setMarqueeShow] = useState(false);
  const beginMarqueePos = useRef({
    channelIndex: 0,
    frameIndex: 0,
  });
  const [endMarqueePos, setEndMarqueePos] = useState<MarqueePos>({
    channelIndex: 0,
    frameIndex: 0,
  });

  console.log('refresh timeline group');

  const frameCount = 20;
  const frameWidth = props.width / frameCount;

  function getMarqueeChannelIndexMin() {
    return isSelecting.current
      ? Math.min(beginMarqueePos.current.channelIndex, endMarqueePos.channelIndex)
      : 0;
  }

  function getMarqueeChannelIndexMax() {
    return isSelecting.current
      ? Math.max(beginMarqueePos.current.channelIndex, endMarqueePos.channelIndex)
      : 0;
  }

  function getMarqueeFrameIndexMin() {
    return isSelecting.current
      ? Math.min(beginMarqueePos.current.frameIndex, endMarqueePos.frameIndex)
      : 0;
  }

  function getMarqueeFrameIndexMax() {
    return isSelecting.current
      ? Math.max(beginMarqueePos.current.frameIndex, endMarqueePos.frameIndex)
      : 0;
  }

  function getFrameIndex(posX: number) {
    return Math.round((posX - frameWidth * 0.5) / frameWidth);
  }

  function onMouseDown(e: any) {
    if (e.target.nodeName === "CANVAS") {
      const channelId = e.target.dataset["channelid"];
      const channelIndex = e.target.dataset["index"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);
      currDragIndex.current = beginDragIndex.current = frameIndex;

      const channel = props.channels.find(
        (channel) => channel.id === channelId
      );
      if (channel) {
        isSelecting.current = true;
        beginMarqueePos.current = {
          channelIndex: channelIndex,
          frameIndex: frameIndex,
        };
        // setEndMarqueePos({
        //   channelIndex: channelIndex,
        //   frameIndex: frameIndex,
        // });
      }

    } else if (
      e.target.nodeName === "DIV" &&
      e.target.classList.contains("keyframe")
    ) {
      const keyframeId = e.target.dataset['keyframeid'];
      const channelId = e.target.parentNode.dataset["channelid"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);
      currDragIndex.current = beginDragIndex.current = frameIndex;
      isDragging.current = true;

      if(props.selectedNodes !== null)
      {
        if(props.selectedNodes.find(obj => obj.id === keyframeId) === undefined)
        {
          props.onKeyframeSelect([channelId], frameIndex, frameIndex);
        }
      }
    }
  }

  function onMouseMove(e: any) {
    const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
    const frameIndex = getFrameIndex(posX);

    if (isDragging.current) {
      if (frameIndex >= 0 && frameIndex !== currDragIndex.current) {
        currDragIndex.current = frameIndex;
        setDragOffset(currDragIndex.current - beginDragIndex.current);
      }
    } else if (isSelecting.current) {
      if (e.target.nodeName === "CANVAS") {
        const channelIndex = e.target.dataset["index"];

        const _isMarqueeShow = channelIndex !== beginMarqueePos.current.channelIndex &&
        frameIndex !== beginMarqueePos.current.frameIndex;

        if (_isMarqueeShow &&
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

  useEffect(()=>{
    const _channelIds: string[] = [];
    for(let i=0; i<props.channels.length; i++)
    {
      if(i >= getMarqueeChannelIndexMin() && i <= getMarqueeChannelIndexMax())
      {
        const _channel = props.channels[i];
        _channelIds.push(_channel.id);
      }
    }

    props.onKeyframeSelect(_channelIds, getMarqueeFrameIndexMin(), getMarqueeFrameIndexMax());
  },[endMarqueePos])

  function onMouseUp(e: any) {
    if (isDragging.current) {
      isDragging.current = false;
      if(props.selectedNodes !== null)
      {
        moveKeyFrame(props.selectedNodes, dragOffset);
        forceUpdate();
      }
      setDragOffset(0);
      //   props.onDragIndexEnd();
    } else if (isSelecting.current) {
      isSelecting.current = false;
      setMarqueeShow(false);
    }
  }

  function onDoubleClick(e: any) {
    if (e.target.nodeName === "CANVAS") {
      const channelId = e.target.dataset["channelid"];
      const posX = e.nativeEvent.offsetX;
      const index = getFrameIndex(posX);

      addKeyframe(channelId,index);
      // props.onAddKeyFrame(channelId, index);
      forceUpdate();
    }
  }

  function onMouseLeave(e: any) {
    if (isDragging.current) {
      isDragging.current = false;
      setDragOffset(0);
    } else if (isSelecting.current) {
      isSelecting.current = false;
      setMarqueeShow(false);
    }
  }

  const timelines: ReactNode[] = [];

  for (let i = 0; i < props.channels.length; i++) {
    const channel = props.channels[i];
    timelines.push(
      <Timeline
        width={props.width}
        height={props.timelineHeight}
        frameCount={frameCount}
        frameWidth={frameWidth}
        channelId={channel.id}
        keyframes={channel.keyframes}
        index={i}
        key={channel.id}
        dragOffset={dragOffset}
        selectedNodes={props.selectedNodes}
      />
    );
  }

  return (
    <div id="timeline-group"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}
      onMouseLeave={onMouseLeave}
    >
      {
        isMarqueeShow?
        <MarqueeRect
          frameWidth={frameWidth}
          timelineHeight={props.timelineHeight}
          channelIndexMin={getMarqueeChannelIndexMin()}
          channelIndexMax={getMarqueeChannelIndexMax()}
          frameIndexMin={getMarqueeFrameIndexMin()}
          frameIndexMax={getMarqueeFrameIndexMax()}
        />:undefined
      }
      {timelines}
    </div>
  );
}
