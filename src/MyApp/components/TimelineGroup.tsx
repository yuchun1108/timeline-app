import { ReactNode, useEffect, useRef, useState } from "react";
import { AnimInfo,AnimNode, Channel, Keyframe } from "../../global/AnimInfo";
import Timeline from "./Timeline";
import MarqueeRect from "./MarqueeRect";

interface TimelineGroupProps {
  width: number;
  timelineHeight:number;
  selectedNodes:AnimNode[] | null;
  channels: Channel[];
  onAddKeyFrame: (channelId: string, index: number) => void;
  onMoveKeyFrame: (selectedNodes:AnimNode[], offset: number) => void;
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
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const beginDragIndex = useRef(0);
  const currDragIndex = useRef(0);

  const [isSelecting, setIsSelecting] = useState(false);
  const [beginMarqueePos, setBeginMarqueePos] = useState<MarqueePos>({
    channelIndex: 0,
    frameIndex: 0,
  });
  const [endMarqueePos, setEndMarqueePos] = useState<MarqueePos>({
    channelIndex: 0,
    frameIndex: 0,
  });

  const frameCount = 20;
  const frameWidth = props.width / frameCount;

  function getMarqueeChannelIndexMin() {
    return isSelecting
      ? Math.min(beginMarqueePos.channelIndex, endMarqueePos.channelIndex)
      : 0;
  }

  function getMarqueeChannelIndexMax() {
    return isSelecting
      ? Math.max(beginMarqueePos.channelIndex, endMarqueePos.channelIndex)
      : 0;
  }

  function getMarqueeFrameIndexMin() {
    return isSelecting
      ? Math.min(beginMarqueePos.frameIndex, endMarqueePos.frameIndex)
      : 0;
  }

  function getMarqueeFrameIndexMax() {
    return isSelecting
      ? Math.max(beginMarqueePos.frameIndex, endMarqueePos.frameIndex)
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
        setIsSelecting(true);
        setBeginMarqueePos({
          channelIndex: channelIndex,
          frameIndex: frameIndex,
        });
        setEndMarqueePos({
          channelIndex: channelIndex,
          frameIndex: frameIndex,
        });
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
    } else if (isSelecting) {
      if (e.target.nodeName === "CANVAS") {
        const channelIndex = e.target.dataset["index"];

        if (
          endMarqueePos.channelIndex !== channelIndex ||
          endMarqueePos.frameIndex !== frameIndex
        ) {
          setEndMarqueePos({
            channelIndex: channelIndex,
            frameIndex: frameIndex,
          });
        }
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
      props.onMoveKeyFrame(props.selectedNodes, dragOffset);
      }
      setDragOffset(0);
      //   props.onDragIndexEnd();
    } else if (isSelecting) {
      setIsSelecting(false);
    }
  }

  function onDoubleClick(e: any) {
    if (e.target.nodeName === "CANVAS") {
      const channelId = e.target.dataset["channelid"];
      const posX = e.nativeEvent.offsetX;
      const index = getFrameIndex(posX);
      props.onAddKeyFrame(channelId, index);
    }
  }

  function onMouseLeave(e: any) {
    if (isDragging.current) {
      isDragging.current = false;
      setDragOffset(0);
    } else if (isSelecting) {
      setIsSelecting(false);
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
        channel={channel}
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
      {isSelecting ? (
        <MarqueeRect
          frameWidth={frameWidth}
          timelineHeight={props.timelineHeight}
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
