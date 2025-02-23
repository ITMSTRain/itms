"use client";
import React, { useState, useRef, useCallback } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import VideoGrid from "@/components/videogrid";

const CameraSurveillanceDashboard: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(1);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [clickState, setClickState] = useState<{
    count: number;
    lastClickTime: number;
  }>({
    count: 0,
    lastClickTime: 0,
  });

  // ✅ Now holds objects with name and api
  const [cameraNames, setCameraNames] = useState<{ name: string; api: string }[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // ✅ Strongly typed grid options
  type GridOption = "1x1" | "2x2" | "3x3" | "4x4";

  const handleGridChange = (value: string) => {
    const sizes: Record<GridOption, number> = { "1x1": 1, "2x2": 4, "3x3": 9, "4x4": 16 };

    // ✅ Use a type guard to validate the key
    if (["1x1", "2x2", "3x3", "4x4"].includes(value)) {
      setGridSize(sizes[value as GridOption]);
    } else {
      setGridSize(1); // Fallback in case of unexpected value
    }
  };

  const handleSaveCameraName = (name: string, api: string) => {
    setCameraNames((prevNames) => [...prevNames, { name, api }]);
  };

  const handleDeleteCamera = (index: number) => {
    setCameraNames((prevNames) => prevNames.filter((_, i) => i !== index));
  };

  const handleReloadCamera = (index: number) => {
    console.log(`Reloading camera at index: ${index}`);
  };

  const handleGridFullScreen = () => {
    const gridContainer = document.getElementById("video-grid");
    if (gridContainer) {
      gridContainer.requestFullscreen().catch((err) => console.error("Fullscreen error:", err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        onGridChange={handleGridChange}
        onFullScreenClick={handleGridFullScreen}
        onSave={handleSaveCameraName}
      />

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        <Sidebar
          cameraNames={cameraNames}
          onDeleteCamera={handleDeleteCamera}
          onReloadCamera={handleReloadCamera}
        />

        <div className="flex-1 bg-gray-900 p-4 md:p-6 pb-12">
          <VideoGrid
            gridSize={gridSize}
            selectedVideo={selectedVideo}
            onVideoClick={() => {}}
            onVideoDoubleClick={() => {}}
            videoRefs={videoRefs}
          />
        </div>
      </div>
    </div>
  );
};

export default CameraSurveillanceDashboard;
