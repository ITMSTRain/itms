"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import VideoGrid from "@/components/videogrid";
import { useVideoActions } from "../client-actions";
import MiniSpeedChart from "@/components/mini-speed-chart";
import MiniClassChart from "@/components/mini-class-chart";
import { createClient } from "../../utils/supabase/client";

const CLASS_ENDPOINTS = {
  bsu: `${process.env.NEXT_PUBLIC_BACKEND_URL}/BSU_vehicle_classifications`,
  pb: `${process.env.NEXT_PUBLIC_BACKEND_URL}/PB_vehicle_classifications`,
};

const VEHICLE_TYPES = [
  "Bus",
  "Car",
  "Jeep",
  "Motorcycle",
  "Person",
  "Tricycle",
  "Truck",
  "Van",
];

const dummySpeedData = [
  { time: "12:00", speed: 0 },
  { time: "12:01", speed: 0 },
  { time: "12:02", speed: 0 },
  { time: "12:03", speed: 0 },
  { time: "12:04", speed: 0 },
];
const dummyClassData = VEHICLE_TYPES.map((type) => ({ type, count: 0 }));

const supabase = createClient();

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
  const [videoActive, setVideoActive] = useState<boolean[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    bsu: { class: dummyClassData },
    pb: { class: dummyClassData },
  });
  const [miniSpeedData, setMiniSpeedData] = useState<{
    [camera: string]: { time: string; speed: number }[];
  }>({});

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
      setVideoActive((prev) => {
        const arr = [...prev];
        arr[videoIndex] = false;
        return arr;
      });
      setTimeout(() => startStream(cameraName, videoIndex), 3000);
    }

    let ws = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/videos/${cameraName}` //change ws to wss if using https
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
        setVideoActive((prev) => {
          const arr = [...prev];
          arr[videoIndex] = true;
          return arr;
        });
      }
    };

    ws.onclose = () => {
      console.warn(`🚨 WebSocket for ${cameraName} closed!`);
      setVideoActive((prev) => {
        const arr = [...prev];
        arr[videoIndex] = false;
        return arr;
      });
      reconnect();
    };
  };

  // Add a function to fetch speed data for a given cameraName
  async function fetchSpeedDataForCamera(cameraName: string) {
    // Get camera_id from video_data where video_name matches cameraName
    const { data: videoRows, error: videoError } = await supabase
      .from("video_data")
      .select("id")
      .eq("video_name", cameraName)
      .limit(1);
    if (videoError || !videoRows || videoRows.length === 0) return [];
    const camera_id = videoRows[0].id;
    // Get latest 15 speed_data for this camera_id
    const { data: speedRows, error: speedError } = await supabase
      .from("speed_data")
      .select("speed,created_at")
      .eq("camera_id", camera_id)
      .order("created_at", { ascending: false })
      .limit(15);
    if (speedError || !speedRows) return [];
    // Reverse to get oldest first for chart
    return speedRows.reverse().map((row: any) => ({
      time: new Date(row.created_at).toLocaleTimeString(),
      speed: Math.round(row.speed * 100) / 100,
    }));
  }

  const fetchAnalyticsData = useCallback(async () => {
    try {
      // Class
      const [bsuClassRes, pbClassRes] = await Promise.all([
        fetch(CLASS_ENDPOINTS.bsu),
        fetch(CLASS_ENDPOINTS.pb),
      ]);
      const [bsuClassJson, pbClassJson] = await Promise.all([
        bsuClassRes.json(),
        pbClassRes.json(),
      ]); // Format speed
      const getSpeedArr = (json: any, prevArr: any[]) => {
        const speedValues = Object.values(json.latest_speed || {}).map(Number);

        // Use max speed instead of average for better variation visibility
        const maxSpeed = speedValues.length > 0 ? Math.max(...speedValues) : 0;
        const avgSpeed =
          speedValues.length > 0
            ? speedValues.reduce((a, b) => a + b, 0) / speedValues.length
            : 0;

        // Use max speed as primary indicator
        const displaySpeed = maxSpeed;

        return [
          ...(prevArr || []).slice(-4), // Keep only last 5 entries for more responsive chart
          {
            time: new Date().toLocaleTimeString().slice(0, 5),
            speed: Math.round(displaySpeed * 100) / 100,
          },
        ];
      };
      // Format class
      const getClassArr = (json: any) =>
        VEHICLE_TYPES.map((type) => ({
          type,
          count: json.vehicle_classifications?.[type] || 0,
        }));
      setAnalyticsData((prev) => ({
        bsu: {
          class: getClassArr(bsuClassJson),
        },
        pb: {
          class: getClassArr(pbClassJson),
        },
      }));
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 3000);
    return () => clearInterval(interval);
  }, [fetchAnalyticsData]);

  // In the main component, fetch and pass speed data to MiniSpeedChart
  // Fetch speed data for all cameras in cameraNames
  useEffect(() => {
    async function fetchAllMiniSpeedData() {
      const results: { [camera: string]: { time: string; speed: number }[] } =
        {};
      for (const cam of cameraNames.map((c) => c.name)) {
        if (!cam) continue;
        results[cam] = await fetchSpeedDataForCamera(cam);
      }
      setMiniSpeedData(results);
    }
    fetchAllMiniSpeedData();
    const interval = setInterval(fetchAllMiniSpeedData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [cameraNames]);

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
            cameraNames={cameraNames.map((c) => c.name)}
            videoActive={videoActive}
            miniSpeedData={miniSpeedData}
          />
          {/* Mini Analytics Charts Example */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <MiniSpeedChart cameraName="bsu_road_sample" isActive={true} />
            <MiniClassChart
              cameraName="bsu_road_sample"
              isActive={true}
              data={analyticsData.bsu.class}
            />
            <MiniSpeedChart cameraName="pb_road_sample" isActive={true} />
            <MiniClassChart
              cameraName="pb_road_sample"
              isActive={true}
              data={analyticsData.pb.class}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraSurveillanceDashboard;
