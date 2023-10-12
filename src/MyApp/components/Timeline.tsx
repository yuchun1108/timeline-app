import {
  useState,
  useRef,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from "react";
import TimelineBG from "./TimelineBG";
import KeyframeDot from "./KeyFrame";
import { AnimInfo,Channel, Keyframe } from "../../global/AnimInfo";

interface FrameList {
  frameDatas: FrameData[];
}

interface FrameData {
  isSelected: boolean;
  index: number;
  value: number;
}

interface TimelineProps {
  width: number;
  channel: Channel;
  selectedKeys: string[];
  dragIndexOffset: number;
  onAddKeyFrame: (channelId:string, index: number) => void;
  onKeyFrameSelect:(channelId:string, index:number)=>void;
  onDragIndexMove:(offset:number)=>void;
  onDragIndexEnd:()=>void;
}

export default function Timeline(props: TimelineProps) {
  const isDragging = useRef(false);
  const beginDragIndex = useRef(0);
  const currDragIndex = useRef(0);

  function getFrameIndex(posX: number) {
    return Math.round((posX - frameWidth * 0.5) / frameWidth);
  }

  function onMouseDown(e: any) {
    // console.log(e);
    if (
      e.target.nodeName === "CANVAS"
      // || (e.target.nodeName === "DIV" && e.target.classList.contains("keyframe"))
    ) {
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      currDragIndex.current = beginDragIndex.current = getFrameIndex(posX);
      // console.log(props.channel.id);
      //props.onKeyFrameClick();
      isDragging.current = true;

      props.onKeyFrameSelect(props.channel.id, currDragIndex.current);
    }
  }

  function onMouseMove(e: any) {
    if (isDragging.current) {
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const index = getFrameIndex(posX);

      if (index >= 0 && index !== currDragIndex.current) {
        currDragIndex.current = index;
        props.onDragIndexMove(currDragIndex.current - beginDragIndex.current);
      }
    }
  }

  function onMouseUp(e: any) {
    if (isDragging.current) {
      isDragging.current = false;
      props.onDragIndexEnd();
    }
  }

  const height = 20;
  const frameCount = 20;
  const frameWidth = props.width / frameCount;

  function onDoubleClick(e: any) {
    if (e.target.nodeName === "CANVAS") {
      const posX = e.nativeEvent.offsetX;
      const index = Math.round((posX - frameWidth * 0.5) / frameWidth);
      props.onAddKeyFrame(props.channel.id, index);
    }
  }

  const keyFrameDots: ReactElement[] = [];

  for (let i = 0; i < props.channel.keyframes.length; i++) {
    const keyframe = props.channel.keyframes[i];
    const isSelected = props.selectedKeys.includes(keyframe.id);
    if(!isSelected)
    {
    keyFrameDots.push(
      <KeyframeDot
        frameWidth={frameWidth}
        index={isSelected?keyframe.index + props.dragIndexOffset:keyframe.index}
        isSelected={isSelected}
        key={keyframe.id}
        uuid={keyframe.id}
      />
    );
    }
  }

  for (let i = 0; i < props.channel.keyframes.length; i++) {
    const keyframe = props.channel.keyframes[i];
    const isSelected = props.selectedKeys.includes(keyframe.id);
    if(isSelected)
    {
    keyFrameDots.push(
      <KeyframeDot
        frameWidth={frameWidth}
        index={isSelected?keyframe.index + props.dragIndexOffset:keyframe.index}
        isSelected={isSelected}
        key={keyframe.id}
        uuid={keyframe.id}
      />
    );
    }
  }

  return (
    <div
      className="timeline"
      style={{ width: props.width, height: height }}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <TimelineBG
        frameCount={frameCount}
        frameWidth={frameWidth}
        width={props.width}
        height={height}
      />
      {keyFrameDots}
    </div>
  );
}
