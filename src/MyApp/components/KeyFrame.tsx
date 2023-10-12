interface KeyFrameProps {
  frameWidth: number;
  index: number;
  isSelected: boolean;
  uuid:string;
  onClick: (uuid:string) => void;
}

export default function KeyFrame(props: KeyFrameProps) {
  function onClick(e: any) {
    props.onClick(props.uuid);
  }

  return (
    <div
      className={props.isSelected ? "keyframe selected" : "keyframe"}
      style={{
        left: props.frameWidth * (props.index + 0.5) - 5,
      }}
      onClick={onClick}
    ></div>
  );
}
