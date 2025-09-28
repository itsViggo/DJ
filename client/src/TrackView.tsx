import styled from "styled-components";
import type { ChangeEvent } from "react";

const TrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 16px);
  align-items: center;
  justify-content: center;
`;

const Cd = styled.svg<{ playing?: boolean }>`
  animation: rotate 2s infinite linear;
  animation-play-state: ${(props) => (props.playing ? "running" : "paused")};
  height: 35vw;
  z-index: -1;
`;

const FileInput = styled.label`
  background: #111111;
  color: #fefefe;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #020202;
  }
`;

const StyledRangeInput = styled.input`
  writing-mode: sideways-lr;
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  background: linear-gradient(red, yellow 25%, green 50%);
  outline: none; /* Remove outline */
  width: 15px;
  height: 25vw;
  margin-left: 1vw;
  margin-right: 1vw;
  border-radius: 8px;
  border: 1px solid #111111;
  z-index: 1;

  &::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    width: 25px; /* Set a specific slider handle width */
    height: 15px; /* Slider handle height */
    background: #111111; /* Green background */
    border-radius: 5px;
    cursor: pointer; /* Cursor on hover */
  }

  &::-moz-range-thumb {
    width: 25px; /* Set a specific slider handle width */
    height: 25px; /* Slider handle height */
    background: #04AA6D; /* Green background */
    cursor: pointer; /* Cursor on hover */
  }
}
`;

export default function TrackView({
  volume,
  isPlaying,
  analysing,
  trackTitle,
  onUpload,
  onVolumeChange,
  sliderPosition,
}: {
  volume: number,
  isPlaying: boolean,
  analysing: boolean,
  trackTitle: string,
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void,
  onVolumeChange: (event: ChangeEvent<HTMLInputElement>) => void,
  sliderPosition: 'left' | 'right',
}) {

  const VolumeSlider = (
    <StyledRangeInput
      type="range"
      onInput={onVolumeChange}
      min="0"
      max="2"
      value={volume}
      step="0.01"
    />
  );

  return (
    <>
      {sliderPosition === "left" && VolumeSlider}
      <TrackContainer>
        <Cd viewBox="0 0 32 32" playing={isPlaying} fill="#111111">
          <g>
            <circle cx="16" cy="16" r="1" />
            <path d="M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M6,17c-0.6,0-1-0.4-1-1C5,9.9,9.9,5,16,5c0.6,0,1,0.4,1,1   s-0.4,1-1,1c-5,0-9,4-9,9C7,16.6,6.6,17,6,17z M9,17c-0.6,0-1-0.4-1-1c0-4.4,3.6-8,8-8c0.6,0,1,0.4,1,1s-0.4,1-1,1   c-3.3,0-6,2.7-6,6C10,16.6,9.6,17,9,17z M16,21c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S18.8,21,16,21z" />
          </g>
        </Cd>
        <div style={{ marginBottom: "16px" }}>
          {analysing
            ? "Analysing..."
            : trackTitle
            ? trackTitle
            : "Upload a track to begin"}
        </div>
        <FileInput>
          Upload
          <input type="file" onChange={onUpload} style={{ display: "none" }} />
        </FileInput>
      </TrackContainer>
      {sliderPosition === "right" && VolumeSlider}
    </>
  );
}
