import React, { useEffect, useRef } from "react";

interface VideoGridProps {
  gridSize: number;
  selectedVideo: number | null;
  onVideoClick: (index: number) => void;
  onVideoDoubleClick: (index: number) => void;
}

const activeStreams: { [key: string]: WebSocket } = {}; // Track active WebSockets

const VideoGrid: React.FC<VideoGridProps> = ({
  gridSize,
  selectedVideo,
  onVideoClick,
  onVideoDoubleClick,
}) => {
  const videoRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    updateVideoGrid(gridSize);
  }, [gridSize]);

  function updateVideoGrid(size: number) {
    videoRefs.current = new Array(size).fill(null);
  }

  function startStream(cameraId: string, index: number) {
    if (activeStreams[cameraId]) {
      console.warn(`🚨 Already streaming ${cameraId}`);
      return;
    }

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/videos/${cameraId}`);
    activeStreams[cameraId] = ws;
    ws.binaryType = "blob";

    ws.onmessage = (event) => {
      if (videoRefs.current[index]) {
        const blob = event.data;
        const url = URL.createObjectURL(blob);
        videoRefs.current[index]!.src = url;
      }
    };

    ws.onclose = () => {
      console.warn(`🚨 WebSocket for ${cameraId} closed! Reconnecting...`);
      delete activeStreams[cameraId];
      setTimeout(() => startStream(cameraId, index), 3000);
    };
  }

  return (
    <div
      id="video-grid"
      className="h-full grid gap-2 md:gap-2"
      style={{
        gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(gridSize))}, 1fr)`,
        gridTemplateRows: `repeat(${Math.ceil(gridSize / Math.ceil(Math.sqrt(gridSize)))}, 1fr)`,
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
          <img
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            id={`video-feed-${index}`}
            className="w-full h-full object-cover"
            src="/assets/errorvideo.jpg" // Default placeholder
            alt={`Stream ${index}`}
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
