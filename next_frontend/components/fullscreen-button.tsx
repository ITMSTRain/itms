import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react"; // Icon for fullscreen

// Add a prop for onClick function
interface FullScreenButtonProps {
  onClick: () => void;
}

export const FullScreenButton: React.FC<FullScreenButtonProps> = ({ onClick }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Listen for fullscreen change events to update the state
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false); // Reset state when exiting fullscreen
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    const videoGrid = document.getElementById("video-grid"); // Target the video grid container
    if (videoGrid) {
      if (!isFullScreen) {
        videoGrid.requestFullscreen(); // Request fullscreen for the grid container
      }
      setIsFullScreen(true);
    }

    // Call the onClick prop
    onClick(); 
  };

  return (
    <Button variant="outline" onClick={toggleFullScreen}>
      <Maximize2 className="w-4 h-4 mr-2" />
      {isFullScreen ? "Full Screen" : "Enter Full Screen"}
    </Button>
  );
};
