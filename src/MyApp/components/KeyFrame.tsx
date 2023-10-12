interface KeyframeProps {
  frameWidth: number;
  index: number;
  isSelected: boolean;
  uuid:string;
}

export default function KeyframeDot(props: KeyframeProps) {

  function onDragStart(e:any){
    e.preventDefault();
    return false;
  }

  return (
    <div
      className={props.isSelected ? "keyframe selected" : "keyframe"}
      style={{
        left: props.frameWidth * (props.index + 0.5) - 5,
      }}
      onDragStart = {onDragStart}
    ></div>
  );
}
