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
  const [cameraNames, setCameraNames] = useState<string[]>([]); // Store multiple camera names
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleGridChange = (value: string) => {
    switch (value) {
      case "1x1":
        setGridSize(1);
        break;
      case "2x2":
        setGridSize(4);
        break;
      case "3x3":
        setGridSize(9);
        break;
      case "4x4":
        setGridSize(16);
        break;
      default:
        setGridSize(1);
    }
  };

  const handleVideoClick = useCallback(
    (index: number) => {
      const currentTime = Date.now();
      const timeDifference = currentTime - clickState.lastClickTime;

      if (timeDifference < 300) {
        const newCount = clickState.count + 1;
        if (newCount === 2) {
          handleVideoDoubleClick(index);
        } else if (newCount === 3) {
          handleVideoExitFullscreen();
        }
        setClickState({ count: newCount, lastClickTime: currentTime });
      } else {
        setSelectedVideo((prevSelected) =>
          prevSelected === index ? null : index
        );
        setClickState({ count: 1, lastClickTime: currentTime });
      }
    },
    [clickState]
  );

  const handleVideoDoubleClick = (index: number) => {
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      videoElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    }
  };

  const handleVideoExitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit fullscreen:", err);
      });
    }
  };

  const handleGridFullScreen = () => {
    const gridContainer = document.getElementById("video-grid");

    if (!gridContainer) {
      console.error("Grid container not found");
      return;
    }

    if (document.fullscreenElement) {
      console.log("Already in fullscreen mode");
      return;
    }

    try {
      gridContainer.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    } catch (error) {
      console.error("Fullscreen request failed:", error);
    }
  };

  // Handle saving camera name
  const handleSaveCameraName = (name: string) => {
    setCameraNames((prevNames) => [...prevNames, name]); // Add new camera name to the list
  };

  // Handle deleting a camera by index
  const handleDeleteCamera = (index: number) => {
    setCameraNames((prevNames) => prevNames.filter((_, i) => i !== index)); // Remove camera at index
  };

  // Handle reloading a camera (dummy function for now)
  const handleReloadCamera = (index: number) => {
    console.log(`Reloading camera at index: ${index}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        onGridChange={handleGridChange}
        onFullScreenClick={handleGridFullScreen}
        onSave={handleSaveCameraName} // Pass handleSaveCameraName to Header
      />

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        <Sidebar
          cameraNames={cameraNames} // Pass the list of camera names to Sidebar
          onDeleteCamera={handleDeleteCamera} // Pass delete handler to Sidebar
          onReloadCamera={handleReloadCamera} // Pass reload handler to Sidebar
        />

        <div className="flex-1 bg-gray-900 p-4 md:p-6 pb-12">
          <VideoGrid
            gridSize={gridSize}
            selectedVideo={selectedVideo}
            onVideoClick={handleVideoClick}
            onVideoDoubleClick={handleVideoDoubleClick}
            videoRefs={videoRefs}
          />
        </div>
      </div>
    </div>
  );
};

export default CameraSurveillanceDashboard;
