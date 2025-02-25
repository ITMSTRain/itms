import React from "react";

interface VideoGridProps {
  gridSize: number;
  selectedVideo: number | null;
  onVideoClick: (index: number) => void;
  onVideoDoubleClick: (index: number) => void;
  videoRefs: React.RefObject<(HTMLImageElement | null)[]>;
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
      className="h-full grid gap-4 md:gap-2 p-4"
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
          className={`relative aspect-w-16 aspect-h-9 bg-gray-700 overflow-hidden ${
            selectedVideo === index ? "border-4 border-white" : ""
          }`}
          onClick={() => onVideoClick(index)}
          onDoubleClick={() => onVideoDoubleClick(index)}
        >
          {/* ✅ No Clipping: Uses object-contain */}
          <img
            ref={(el) => {
              if (el) {
                videoRefs.current[index] = el;
              }
            }}
            className="w-full h-full object-contain"
          />

          {/* Overlay Text */}
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none">
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
