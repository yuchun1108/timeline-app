
import "./index.css";
import Timeline from "./components/Timeline";
import { useEffect, useState } from "react";
import {AnimInfo, KeyFrameInfo} from '.././global/AnimInfo';

interface MyAppProps {
  animInfo:AnimInfo;
  onAddKeyFrame:(index:number)=>void;
  onMoveKeyFrameIndex:(uuids:string[], offset:number)=>void;
}

export default function MyApp(props: MyAppProps) {

  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [dragIndexOffset, setDragIndexOffset] = useState(0);

  useEffect(()=>{
    function onWindowResize(){
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener('resize', onWindowResize);
  },[]);

  function onKeyFrameSelect(index:number)
  {
    props.animInfo.keyFrames.forEach(keyFrame=>{
      if(keyFrame.index === index)
      {
        setSelectedKeys([keyFrame.uuid]);
      }
    });
  }

  function onDragIndexMove(offset:number){
    setDragIndexOffset(offset);
  }

  function onDragIndexEnd(){
    props.onMoveKeyFrameIndex(selectedKeys,dragIndexOffset);
    setDragIndexOffset(0);
  }

  return (
    <div id="my-app" style={{width:innerWidth}}>
      <Timeline width={innerWidth} animInfo={props.animInfo} 
      selectedKeys = {selectedKeys}
      dragIndexOffset={dragIndexOffset}
      onAddKeyFrame={props.onAddKeyFrame}
      onKeyFrameSelect={onKeyFrameSelect}
      onDragIndexMove = {onDragIndexMove}
      onDragIndexEnd = {onDragIndexEnd}
      />
    </div>
  );
}
