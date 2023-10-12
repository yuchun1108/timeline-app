
import "./index.css";
import Timeline from "./components/Timeline";
import { useEffect, useState } from "react";
import {AnimInfo, KeyFrameInfo} from '.././global/AnimInfo';

interface MyAppProps {
  animInfo:AnimInfo;
  onAddKeyFrame:(index:number)=>void;
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
    // props.animInfo.keyFrames.forEach(keyFrame=>{
    //   if(keyFrame.index === index)
    //   {
    //     setSelectedKeys([keyFrame.uuid]);
    //   }
    // });
  }

  function onKeyFrameClick(uuid:string)
  {
    setSelectedKeys([uuid]);
  }

  function onDragIndexMove(offset:number){
    setDragIndexOffset(offset);
  }

  return (
    <div id="my-app" style={{width:innerWidth}}>
      <Timeline width={innerWidth} animInfo={props.animInfo} 
      selectedKeys = {selectedKeys}
      dragIndexOffset={dragIndexOffset}
      onAddKeyFrame={props.onAddKeyFrame}
      onKeyFrameClick={onKeyFrameClick}
      onKeyFrameSelect={onKeyFrameSelect}
      onDragIndexMove = {onDragIndexMove}
      />
    </div>
  );
}
