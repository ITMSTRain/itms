import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowPathRoundedSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { ScrollArea } from "../components/ui/scroll-area";

interface SidebarProps {
  cameraNames: { name: string; api: string }[];
  onDeleteCamera: (index: number) => void;
  onReloadCamera: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ cameraNames, onDeleteCamera, onReloadCamera }) => {
  return (
    <div className="bg-white text-black p-4 w-64 relative">
      {/* Header with Reload Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Cameras</h2>
        <Button variant="outline" size="icon" onClick={() => onReloadCamera(-1)}>
          <ArrowPathRoundedSquareIcon className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)] space-y-1 pr-2 mt-8">
        {cameraNames.length > 0 ? (
          cameraNames.map((camera, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-200">
              <div>
                <p className="font-medium">{camera.name}</p>
                <p className="text-xs text-gray-500">{camera.api}</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => onDeleteCamera(index)}>
                <TrashIcon className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          ))
        ) : (
          <p>No cameras added yet.</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
