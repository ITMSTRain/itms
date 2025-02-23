import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowPathRoundedSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ScrollArea } from "../components/ui/scroll-area";

interface SidebarProps {
  cameraNames: string[];
  onDeleteCamera: (index: number) => void;
  onReloadCamera: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ cameraNames, onDeleteCamera, onReloadCamera }) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setHighlightedIndex(index);
  };

  return (
    <div className="bg-white text-black p-4 w-64 relative">
      {/* Changed bg to white and text to black */}
      <h2 className="text-xl font-semibold mb-4">Cameras</h2>
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onReloadCamera(0)} // Modify index as needed
        >
          <ArrowPathRoundedSquareIcon className="h-5 w-5 text-gray-500" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDeleteCamera(0)} // Modify index as needed
        >
          <TrashIcon className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)] space-y-1 pr-2 mt-8">
        {cameraNames.length > 0 ? (
          cameraNames.map((name, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 rounded ${highlightedIndex === index ? "text-red-500" : ""}`}
              onClick={() => handleClick(index)}
            >
              {name}
            </li>
          ))
        ) : (
          <li>No cameras added yet.</li>
        )}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
