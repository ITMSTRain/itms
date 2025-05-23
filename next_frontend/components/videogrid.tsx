"use client";

import type React from "react";
import { useState } from "react";
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
                        cameraName={cameraNames[index] || ""}
                        isActive={isActive}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="h-[300px]">
                      <MiniClassChart
                        cameraName={cameraNames[index] || ""}
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
