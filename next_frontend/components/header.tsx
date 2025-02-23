import React from 'react';
import { ComboboxDemo } from "@/components/videotype";
import { ClassType } from "@/components/classtype";
import { AddCamera } from "@/components/add-camera";
import { FullScreenButton } from "@/components/fullscreen-button";
import SpeedOverTime from "@/components/speed-over-time";
import LogsOverTime from "@/components/logs-over-time";
import AvatarHeader from "@/components/avatar-sidebar";

interface HeaderProps {
  onGridChange: (value: string) => void;
  onFullScreenClick: () => void;
  onSave: (cameraName: string) => void; // Accept onSave prop
}

const Header: React.FC<HeaderProps> = ({ onGridChange, onFullScreenClick, onSave }) => {
  return (
    <header className="bg-[#EFF6FF] shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/img/logo.png"
            alt="Road Guard Logo"
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            ROAD GUARD
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <ComboboxDemo onChange={onGridChange} />
          <ClassType />
          <AddCamera onSave={onSave} /> {/* Pass onSave to AddCamera */}
          <FullScreenButton onClick={onFullScreenClick} />
          <SpeedOverTime />
          <LogsOverTime />
          <AvatarHeader />
        </div>
      </div>
    </header>
  );
};

export default Header;
