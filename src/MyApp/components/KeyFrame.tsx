interface KeyFrameProps {
  frameWidth: number;
  index: number;
  isSelected: boolean;
  uuid:string;
}

export default function KeyFrame(props: KeyFrameProps) {

  return (
    <div
      className={props.isSelected ? "keyframe selected" : "keyframe"}
      style={{
        left: props.frameWidth * (props.index + 0.5) - 5,
      }}
    ></div>
  );
}
