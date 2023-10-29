/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ScrollSyncPane } from "react-scroll-sync";
import FrameSize from "../global/FrameSize";
import AnimSelector from "../three/AnimSelector";
import { Anim, Track } from "../three/anim/Anim";
import Marquee from "./components/Marquee";
import MarqueeRect from "./components/MarqueeRect";
import Timeline from "./components/Timeline";

interface TimelineGroupProps {
  frameSize: FrameSize;
  selector: AnimSelector;
  anim: Anim | undefined;
  tracks: Track[] | undefined;
}

interface MarqueePos {
  trackIndex: number;
  frameIndex: number;
}

const css_timeline_group = css`
  grid-area: timeline;
  position: relative;
  background-color: #2c393c;
  overflow: auto;
`;

const marquee: Marquee = new Marquee();

export default function TimelineGroup(props: TimelineGroupProps) {
  const { tracks, selector } = props;

  const [moveOffset, setMoveOffset] = useState(0);

  const clickedKeyframeId = useRef<string>("");

  const isMoving = useRef(false);
  const beginMoveIndex = useRef(0);
  const currMoveIndex = useRef(0);

  function getFrameIndex(posX: number) {
    const frameWidth = props.frameSize.width;
    return Math.round((posX - frameWidth * 0.5) / frameWidth);
  }

  function onMouseDown(e: any) {
    if (e.target.nodeName === "CANVAS") {
      const trackUuid = e.target.dataset["trackuuid"];
      const trackIndex = e.target.dataset["index"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
      const frameIndex = getFrameIndex(posX);
      currMoveIndex.current = beginMoveIndex.current = frameIndex;

      const track = tracks?.find((track) => track.uuid === trackUuid);
      if (track) {
        marquee.setBeginPos(trackIndex, frameIndex);
        selector.clear();
      }
    } else if (
      e.target.nodeName === "DIV" &&
      e.target.classList.contains("keyframe")
    ) {
      const keyframeUuid = e.target.dataset["keyframeuuid"];
      const posX = e.target.offsetLeft + e.nativeEvent.offsetX;

      const frameIndex = getFrameIndex(posX);
      currMoveIndex.current = beginMoveIndex.current = frameIndex;
      isMoving.current = true;

      //如果開始拖曳時，按下的是未選取的keyframe，怎改為選取該keyframe
      if (!selector.isSelected(keyframeUuid)) {
        selector.selectByUuids([keyframeUuid]);
      }

      clickedKeyframeId.current = keyframeUuid;
    }
  }

  function onMouseMove(e: any) {
    const posX = e.target.offsetLeft + e.nativeEvent.offsetX;
    const frameIndex = getFrameIndex(posX);

    if (isMoving.current) {
      if (frameIndex >= 0 && frameIndex !== currMoveIndex.current) {
        currMoveIndex.current = frameIndex;
        setMoveOffset(currMoveIndex.current - beginMoveIndex.current);

        clickedKeyframeId.current = "";
      }
    } else if (marquee.isMaking) {
      if (e.target.nodeName === "CANVAS") {
        const trackIndex = e.target.dataset["index"];

        marquee.setEndPos(trackIndex, frameIndex);
      }
    }
  }

  const onRectChange = useCallback(() => {
    marquee.onRectChange.add(() => {
      if (!tracks) return;

      const _tracks: Track[] = [];
      for (let i = 0; i < tracks.length; i++) {
        if (
          i >= marquee.getTrackIndexMin() &&
          i <= marquee.getTrackIndexMax()
        ) {
          const _track = tracks[i];
          _tracks.push(_track);
        }
      }

      selector.selectByRange(
        _tracks,
        marquee.getFrameIndexMin(),
        marquee.getFrameIndexMax()
      );
    });
  }, [tracks]);

  useEffect(() => {
    marquee.onRectChange.add(onRectChange);
    return () => {
      marquee.onRectChange.remove(onRectChange);
    };
  }, [onRectChange]);

  function onMouseUp(e: any) {
    const keyframeUuid = e.target.dataset["keyframeuuid"];
    if (keyframeUuid === clickedKeyframeId.current) {
      selector.selectByUuids([keyframeUuid]);
    }

    if (isMoving.current) {
      isMoving.current = false;
      if (selector.nodes.length > 0) {
        props.anim?.moveKeyFrame(selector.nodes, moveOffset);
      }
      setMoveOffset(0);
    }
    marquee.clear();
  }

  function onDoubleClick(e: any) {
    if (e.target.nodeName === "CANVAS") {
      const trackUuid = e.target.dataset["trackuuid"];
      const posX = e.nativeEvent.offsetX;
      const index = getFrameIndex(posX);

      props.anim?.addKeyframeByIndex(trackUuid, index);
    }
  }

  function onMouseLeave(e: any) {
    if (isMoving.current) {
      isMoving.current = false;
      setMoveOffset(0);
    }
    marquee.clear();
  }

  const timelines: ReactNode[] = [];

  if (tracks) {
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      timelines.push(
        <Timeline
          frameSize={props.frameSize}
          track={track}
          index={i}
          key={track.uuid}
          moveOffset={moveOffset}
          selector={props.selector}
        />
      );
    }
  }

  return (
    <ScrollSyncPane>
      <div
        id="timeline-group"
        css={css_timeline_group}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
        onMouseLeave={onMouseLeave}
      >
        <MarqueeRect frameSize={props.frameSize} marquee={marquee} />
        {timelines}
      </div>
    </ScrollSyncPane>
  );
}
