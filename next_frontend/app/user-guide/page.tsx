"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import ManualHeader from "@/components/manual/manualheader";

// Lazy load components
const Introduction = dynamic(() => import("@/components/manual/intro"));
const AddCamera = dynamic(() => import("@/components/manual/addcamera"));
const CameraList = dynamic(() => import("@/components/manual/cameralist"));
const ClassType = dynamic(() => import("@/components/manual/classtype"));
const FrameSelect = dynamic(() => import("@/components/manual/frameselect"));
const FullScreen = dynamic(() => import("@/components/manual/fullscreen"));
const LogsOverTime = dynamic(() => import("@/components/manual/logsovertime"));
const SpeedOverTime = dynamic(
  () => import("@/components/manual/speedovertime")
);
const UserButton = dynamic(() => import("@/components/manual/userbutton"));
const Dashboard = dynamic(() => import("@/components/manual/dashboard"));
const UserLogs = dynamic(() => import("@/components/manual/userlogs"));
const About = dynamic(() => import("@/components/manual/about"));

// Define topics with their corresponding components
const topics = [
  { id: "intro", title: "Introduction", component: Introduction },
  { id: "addcamera", title: "Add Camera", component: AddCamera },
  { id: "cameralist", title: "Camera List", component: CameraList },
  { id: "classtype", title: "Class Type", component: ClassType },
  { id: "frameselect", title: "Frame Select", component: FrameSelect },
  { id: "fullscreen", title: "Full Screen", component: FullScreen },
  { id: "logsovertime", title: "Logs Over Time", component: LogsOverTime },
  { id: "speedovertime", title: "Speed Over Time", component: SpeedOverTime },
  { id: "userbutton", title: "User Button", component: UserButton },
  { id: "dashboard", title: "Dashboard", component: Dashboard },
  { id: "userlogs", title: "User Logs", component: UserLogs },
  { id: "about", title: "About", component: About },
];

export default function ManualInstruction() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter topics based on search
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ensure currentIndex remains valid after filtering
  const displayedTopic = filteredTopics[currentIndex] || topics[0];

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === filteredTopics.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with search functionality */}
      <ManualHeader onSearch={setSearchQuery} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <ScrollArea className="w-64 border-r border-gray-200 p-4">
          <ul className="text-xl font-medium">
            {filteredTopics.map((topic, index) => (
              <li
                key={topic.id}
                className={`p-3 cursor-pointer rounded-md ${
                  topic.id === displayedTopic.id
                    ? "bg-gray-200 text-2xl font-bold"
                    : ""
                }`}
                onClick={() =>
                  setCurrentIndex(topics.findIndex((t) => t.id === topic.id))
                }
              >
                {topic.title}
              </li>
            ))}
          </ul>
        </ScrollArea>

        {/* Content Area */}
        <div className="flex-1 p-6 text-lg overflow-y-auto">
          {displayedTopic.component && (
            <displayedTopic.component
              onNext={handleNext}
              onPrev={handlePrev}
              isFirst={isFirst}
              isLast={isLast}
            />
          )}
        </div>
      </div>
    </div>
  );
}
