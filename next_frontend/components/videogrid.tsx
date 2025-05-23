"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MiniSpeedChart from "@/components/mini-speed-chart";
import MiniClassChart from "@/components/mini-class-chart";

interface VideoGridProps {
  gridSize: number;
  selectedVideo: number | null;
  onVideoClick: (index: number) => void;
  onVideoDoubleClick: (index: number) => void;
  videoRefs: React.RefObject<(HTMLImageElement | null)[]>;
  cameraNames: string[];
  videoActive: boolean[];
}

const VideoGrid: React.FC<VideoGridProps> = ({
  gridSize,
  selectedVideo,
  onVideoClick,
  onVideoDoubleClick,
  videoRefs,
  cameraNames,
  videoActive,
}) => {
  const [activeVideoStats, setActiveVideoStats] = useState<number | null>(null);

  // --- NEW: Store speed data for each camera ---
  const [speedHistory, setSpeedHistory] = useState<{
    [camera: string]: { time: string; speed: number }[];
  }>({});
  const speedIntervals = useRef<{ [camera: string]: NodeJS.Timeout }>({});

  // --- NEW: Fetch and accumulate raw speed data for each active camera ---
  useEffect(() => {
    cameraNames.forEach((cameraName, idx) => {
      if (!cameraName) return;
      if (!videoActive[idx]) {
        // If video is not active, clear interval and reset history
        if (speedIntervals.current[cameraName]) {
          clearInterval(speedIntervals.current[cameraName]);
          delete speedIntervals.current[cameraName];
        }
        setSpeedHistory((prev) => {
          const copy = { ...prev };
          delete copy[cameraName];
          return copy;
        });
        return;
      }
      // If already polling, skip
      if (speedIntervals.current[cameraName]) return;
      // Determine API endpoint for this camera
      let apiUrl = "";
      if (cameraName.toLowerCase().includes("bsu")) {
        apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsu_latest_speed`;
      } else if (cameraName.toLowerCase().includes("pb")) {
        apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/PB_latest_speed`;
      } else {
        // fallback or skip
        return;
      }
      // Poll every 5s and accumulate raw speed values
      const interval = setInterval(async () => {
        try {
          const res = await fetch(apiUrl);
          if (!res.ok) return;
          const json = await res.json();
          if (json.latest_speed && Object.keys(json.latest_speed).length > 0) {
            // For each vehicle, add a point (flatten all vehicle speeds for this interval)
            const now = new Date().toLocaleTimeString().slice(0, 5);
            const newPoints = Object.values(json.latest_speed).map((v) => ({
              time: now,
              speed: Number(v),
            }));
            setSpeedHistory((prev) => {
              const prevArr = prev[cameraName] || [];
              // Append all new points, keep last 30
              const updated = [...prevArr, ...newPoints].slice(-30);
              return { ...prev, [cameraName]: updated };
            });
          }
        } catch {}
      }, 5000);
      speedIntervals.current[cameraName] = interval;
    });
    // Cleanup on unmount
    return () => {
      Object.values(speedIntervals.current).forEach(clearInterval);
      speedIntervals.current = {};
    };
  }, [cameraNames, videoActive]);

  const handleStatsClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the video click event
    setActiveVideoStats(index);
  };

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
      {Array.from({ length: gridSize }).map((_, index) => {
        const isActive = !!videoActive[index];
        const cameraName = cameraNames[index] || "";
        return (
          <div
            key={index}
            className={`relative aspect-w-16 aspect-h-9 bg-gray-700 overflow-hidden ${
              selectedVideo === index ? "border-4 border-white" : ""
            }`}
            onClick={() => onVideoClick(index)}
            onDoubleClick={() => onVideoDoubleClick(index)}
          >
            {/* Stats Button and Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 border-none"
                  onClick={(e) => handleStatsClick(index, e)}
                >
                  <BarChart className="h-4 w-4 text-white" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Video Feed {index + 1} Analytics</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4">
                    <div className="h-[300px]">
                      <MiniSpeedChart
                        cameraName={cameraName}
                        isActive={isActive}
                        data={speedHistory[cameraName]}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="h-[300px]">
                      <MiniClassChart
                        cameraName={cameraName}
                        isActive={isActive}
                      />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Video Feed */}
            <img
              ref={(el) => {
                if (el) {
                  videoRefs.current[index] = el;
                }
              }}
              className="w-full h-full object-contain"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none"></div>
          </div>
        );
      })}
    </div>
  );
};

export default VideoGrid;
