import Action from "../../global/Actions";

interface MarqueePos {
  trackIndex: number;
  frameIndex: number;
}

export default class Marquee {
  isMaking: boolean = false;
  isShow: boolean = false;
  beginPos: MarqueePos = { trackIndex: 0, frameIndex: 0 };
  endPos: MarqueePos = { trackIndex: 0, frameIndex: 0 };

  onIsShowChange = new Action<(isShow: boolean) => void>();
  onRectChange = new Action<() => void>();

  clear() {
    this.isMaking = false;
    if (this.isShow) {
      this.isShow = false;
      this.onIsShowChange.forEach((func) => func(this.isShow));
    }
  }

  setBeginPos(trackIndex: number, frameIndex: number) {
    this.isMaking = true;
    this.beginPos = { trackIndex, frameIndex };
    this.endPos = { trackIndex, frameIndex };
  }

  setEndPos(trackIndex: number, frameIndex: number) {
    if (
      this.endPos.trackIndex === trackIndex &&
      this.endPos.frameIndex === frameIndex
    )
      return;

    this.endPos = { trackIndex, frameIndex };
    this.onRectChange.forEach((func) => func());

    const isShow =
      this.beginPos.trackIndex !== this.endPos.trackIndex ||
      this.beginPos.frameIndex !== this.endPos.frameIndex;
    if (this.isShow !== isShow) {
      this.isShow = isShow;
      this.onIsShowChange.forEach((func) => func(this.isShow));
    }
  }

  getTrackIndexMin() {
    return this.isMaking
      ? Math.min(this.beginPos.trackIndex, this.endPos.trackIndex)
      : 0;
  }

  getTrackIndexMax() {
    return this.isMaking
      ? Math.max(this.beginPos.trackIndex, this.endPos.trackIndex)
      : 0;
  }

  getFrameIndexMin() {
    return this.isMaking
      ? Math.min(this.beginPos.frameIndex, this.endPos.frameIndex)
      : 0;
  }

  getFrameIndexMax() {
    return this.isMaking
      ? Math.max(this.beginPos.frameIndex, this.endPos.frameIndex)
      : 0;
  }
}
