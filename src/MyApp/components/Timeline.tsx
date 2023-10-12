import {
  useState,
  useRef,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from "react";
import TimelineBG from "./TimelineBG";
import KeyFrame from "./KeyFrame";
import { AnimInfo, KeyFrameInfo } from "../../global/AnimInfo";

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
  animInfo: AnimInfo;
  selectedKeys: string[];
  dragIndexOffset: number;
  onAddKeyFrame: (index: number) => void;
  onKeyFrameSelect:(index:number)=>void;
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
      console.log(e,e.target.dataset);
      //props.onKeyFrameClick();
      isDragging.current = true;

      props.onKeyFrameSelect(currDragIndex.current);
    }
  }

  function onMouseMove(e: any) {
    if (isDragging.current) {
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const index = getFrameIndex(posX);

      if (index >= 0 && index !== currDragIndex.current) {
        currDragIndex.current = index;
        props.onDragIndexMove(currDragIndex.current - beginDragIndex.current);
        // console.log("onMouseMove", currDragIndex.current);
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
      console.log("double click", index);
      props.onAddKeyFrame(index);
    }
  }

  const keyFrames: ReactElement[] = [];
  for (let i = 0; i < props.animInfo.keyFrames.length; i++) {
    const keyFrameInfo = props.animInfo.keyFrames[i];
    const isSelected = props.selectedKeys.includes(keyFrameInfo.uuid);
    keyFrames.push(
      <KeyFrame
        frameWidth={frameWidth}
        index={isSelected?keyFrameInfo.index + props.dragIndexOffset:keyFrameInfo.index}
        isSelected={isSelected}
        key={keyFrameInfo.uuid}
        uuid={keyFrameInfo.uuid}
      />
    );
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
      {keyFrames}
    </div>
  );
}
