import { ReactNode, useEffect, useRef, useState } from "react";
import { AnimInfo, Channel, Keyframe } from "../../global/AnimInfo";
import Timeline from "./Timeline";

interface TimelineGroupProps {
  width: number;
  selectedKeys: string[];
  channels: Channel[];
  onAddKeyFrame: (channelId: string, index: number) => void;
  onMoveKeyFrame: (keyIds: string[], offset: number) => void;
  onKeyframeSelect: (
    channelIds: string[],
    beginIndex: number,
    endIndex: number
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

  const height = 20;
  const frameCount = 20;
  const frameWidth = props.width / frameCount;

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
      const channelId = e.target.parentNode.dataset["channelid"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);
      currDragIndex.current = beginDragIndex.current = frameIndex;
      isDragging.current = true;
      props.onKeyframeSelect([channelId], frameIndex, frameIndex);
    }
  }

  function onMouseMove(e: any) {
    if (e.target.nodeName === "CANVAS") {
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);

      if (isDragging.current) {
        if (frameIndex >= 0 && frameIndex !== currDragIndex.current) {
          currDragIndex.current = frameIndex;
          setDragOffset(currDragIndex.current - beginDragIndex.current);
        }
      } else if (isSelecting) {
        const channelIndex = e.target.dataset["index"];

        if (endMarqueePos.frameIndex !== frameIndex) {
          setEndMarqueePos({
            channelIndex: channelIndex,
            frameIndex: frameIndex,
          });

          console.log(beginMarqueePos, endMarqueePos);
        }
      }
    }
  }

  function onMouseUp(e: any) {
    if (isDragging.current) {
      isDragging.current = false;
      props.onMoveKeyFrame(props.selectedKeys, dragOffset);
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
        height={height}
        frameCount={frameCount}
        frameWidth={frameWidth}
        channel={channel}
        index={i}
        key={channel.id}
        dragOffset={dragOffset}
        selectedKeys={props.selectedKeys}
      />
    );
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}
      onMouseLeave={onMouseLeave}
    >
      {timelines}
    </div>
  );
}
