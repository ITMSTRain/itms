"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import VideoGrid from "@/components/videogrid";
import { useVideoActions } from "../client-actions";

const CameraSurveillanceDashboard: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(4);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [clickState, setClickState] = useState<{
    count: number;
    lastClickTime: number;
  }>({
    count: 0,
    lastClickTime: 0,
  });

  const [cameraNames, setCameraNames] = useState<
    { name: string; api: string }[]
  >([]);
  const videoRefs = useRef<(HTMLImageElement | null)[]>([]);
  const { fetchVideoNames } = useVideoActions();
  const [isClient, setIsClient] = useState(false);

  // Only run client-side code after mount
  useEffect(() => {
    setIsClient(true);
    handleReloadCamera();
  }, []);

  // ✅ Strongly typed grid options
  type GridOption = "1x1" | "2x2" | "3x3" | "4x4";

  const handleGridChange = (value: string) => {
    const sizes: Record<GridOption, number> = {
      "1x1": 1,
      "2x2": 4,
      "3x3": 9,
      "4x4": 16,
    };

    if (["1x1", "2x2", "3x3", "4x4"].includes(value)) {
      setGridSize(sizes[value as GridOption]);
    } else {
      setGridSize(1);
    }
  };

  const handleCameraClick = (cameraName: string) => {
    if (!isClient) return; // Don't run WebSocket code during static generation

    if (selectedVideo !== null) {
      console.log(
        `🔥 Streaming Camera ${cameraName} into Video ${selectedVideo}`
      );
      startStream(cameraName, selectedVideo);
    } else {
      console.warn(`🚨 No video slot selected! Choose a video first.`);
    }
  };

  const handleVideoClick = useCallback(
    (index: number) => {
      if (!isClient) return;

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
    [clickState, isClient]
  );

  const handleVideoDoubleClick = (index: number) => {
    if (!isClient) return;

    const videoElement = videoRefs.current[index];
    if (videoElement) {
      videoElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    }
  };

  const handleVideoExitFullscreen = () => {
    if (!isClient) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit fullscreen:", err);
      });
    }
  };

  const handleGridFullScreen = () => {
    if (!isClient) return;

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

  const handleSaveCameraName = (name: string) => {
    setCameraNames((prevNames) => [...prevNames]);
  };

  const handleDeleteCamera = (index: number) => {
    setCameraNames((prevNames) => prevNames.filter((_, i) => i !== index));
  };

  const handleReloadCamera = async () => {
    if (!isClient) return;

    try {
      const data = await fetchVideoNames();
      const newCameras = data.map((item: { video_name: string }) => ({
        name: item.video_name,
        api: "",
      }));
      setCameraNames(newCameras);
    } catch (error) {
      console.error("Error fetching video names:", error);
    }
  };

  const activeStreams: Record<string, WebSocket> = {};

  const startStream = (cameraName: string, videoIndex: number) => {
    if (!isClient) return;

    if (activeStreams[cameraName]) {
      console.warn(`🚨 Already streaming ${cameraName}`);
      return;
    }

    function reconnect() {
      console.log(`🔄 Reconnecting ${cameraName}...`);
      delete activeStreams[cameraName];
      setTimeout(() => startStream(cameraName, videoIndex), 3000);
    }

    let ws = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/videos/${cameraName}`
    );
    activeStreams[cameraName] = ws;

    ws.binaryType = "blob";
    ws.onmessage = async (event) => {
      let blob = event.data;
      let bitmap = await createImageBitmap(blob);
      let imgElement = videoRefs.current[videoIndex];

      if (imgElement) {
        let imgUrl = URL.createObjectURL(blob);
        imgElement.src = imgUrl;
        imgElement.onload = () => URL.revokeObjectURL(imgUrl);
      }
    };

    ws.onclose = () => {
      console.warn(`🚨 WebSocket for ${cameraName} closed!`);
      reconnect();
    };
  };

  // Don't render the component during static generation
  if (!isClient) {
    return null;
  }

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
          onCameraClick={handleCameraClick}
          videoRefs={videoRefs}
        />

        <div className="flex-1 bg-gray-900 p-4 md:p-6 pb-50 overflow-auto">
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
