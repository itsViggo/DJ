import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react";
import TrackView from "./TrackView";
import Track from "./Track";

export default function TrackPresenter({
  toggleKey,
  sliderPosition,
}: {
  toggleKey: string;
  sliderPosition: "left" | "right";
}) {
  const [analysing, setAnalysing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [trackTitle, setTrackTitle] = useState("");
  const track = useRef(new Track({onTrackEnded: () => setIsPlaying(false)}));

  useEffect(() => { isPlaying ? track.current.play() : track.current.pause() }, [isPlaying])

  useEffect(() => {
    track.current.volume = volume;
  }, [volume]);

  const setFile = async (newTrack: File) => {
    setAnalysing(true);
    if (isPlaying) {
        setIsPlaying(false)
    }
    setTrackTitle(newTrack.name);
    await track.current.setFile(newTrack);
    setAnalysing(false);
  };

  const handleDocumentKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === toggleKey) {
        if (isPlaying) {
          setIsPlaying(false);
        } else if (!analysing && trackTitle) {
          setIsPlaying(true);
        }
      }
    },
    [isPlaying, analysing, trackTitle]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [handleDocumentKeyDown]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await setFile(file);
    }
  };

  const onVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <TrackView
      volume={volume}
      isPlaying={isPlaying}
      analysing={analysing}
      trackTitle={trackTitle}
      sliderPosition={sliderPosition}
      onUpload={onUpload}
      onVolumeChange={onVolumeChange}
    ></TrackView>
  );
}
