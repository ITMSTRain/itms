import React from "react";

interface VideoGridProps {
  gridSize: number;
  selectedVideo: number | null;
  onVideoClick: (index: number) => void;
  onVideoDoubleClick: (index: number) => void;
  videoRefs: React.RefObject<(HTMLVideoElement | null)[]>; // Ensure this is correctly typed
}

const VideoGrid: React.FC<VideoGridProps> = ({
  gridSize,
  selectedVideo,
  onVideoClick,
  onVideoDoubleClick,
  videoRefs,
}) => {
  return (
    <div
      id="video-grid"
      className={`h-full grid gap-2 md:gap-2`}
      style={{
        gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(gridSize))}, 1fr)`,
        gridTemplateRows: `repeat(${Math.ceil(
          gridSize / Math.ceil(Math.sqrt(gridSize))
        )}, 1fr)`,
      }}
    >
      {Array.from({ length: gridSize }).map((_, index) => (
        <div
          key={index}
          className={`relative aspect-w-16 aspect-h-9 bg-gray-700 ${
            selectedVideo === index ? "border-4 border-white" : ""
          }`}
          onClick={() => onVideoClick(index)}
          onDoubleClick={() => onVideoDoubleClick(index)}
        >
          <video
            ref={(el) => {
              if (el) {
                videoRefs.current[index] = el;
              }
            }}
            src="http://localhost:8000/PB_video_feed"
            className={`w-full h-full object-cover ${
              selectedVideo === index ? "border-4 border-white" : ""
            }`}
            autoPlay
            muted
            loop
            controls
          />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            Video {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
