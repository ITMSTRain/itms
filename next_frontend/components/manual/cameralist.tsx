"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function CameraList({
  onNext,
  onPrev,
  isFirst,
  isLast,
}: {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Camera List</h2>

        <p className="mb-4">
          The <strong>"Camera List"</strong> displays all registered cameras in
          the system. This section allows you to manage and access your cameras
          easily.
        </p>

        <ul className="list-disc pl-5 mb-4">
          <li>View all added cameras along with their names.</li>
          <li>Select a camera to play its live feed in the video window.</li>
          <li>Remove or update camera details as needed.</li>
        </ul>

        <p>
          To ensure smooth operation, always verify that the camera is properly
          configured before selecting it from the list.
        </p>

        {/* Navigation Buttons */}
        <div className="absolute bottom-4 left-4 flex gap-4">
          {!isFirst && (
            <Button
              onClick={onPrev}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
            >
              <ArrowLeft size={18} /> Previous
            </Button>
          )}
        </div>

        {!isLast && (
          <Button
            onClick={onNext}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next <ArrowRight size={18} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
