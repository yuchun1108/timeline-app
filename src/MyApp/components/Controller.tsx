interface InspectorProps {
  onAddTrack: () => void;
}

export default function Controller(props: InspectorProps) {
  return (
    <div id="controller">
      <button>play</button>
      <button onClick={props.onAddTrack}>+</button>
    </div>
  );
}
