"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function AddCamera({
  onNext,
  onPrev, // Changed from onPrevious to match ManualInstruction.tsx
  isFirst,
  isLast,
}: {
  onNext: () => void;
  onPrev: () => void; // Updated to match ManualInstruction.tsx
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Add Camera</h2>

        <p className="mb-4">Adding a New Camera</p>
        <p className="mb-4">
          To add a new camera to the system, follow these steps:
        </p>

        <ul className="list-disc pl-5 mb-4">
          <li>Click the "Add Camera" button in the navigation bar.</li>
          <li>Enter the camera name and API link in the provided fields.</li>
          <li>Click "Save" to store the new camera in the list.</li>
          <li>Once added, the camera will be available in the Camera List.</li>
        </ul>

        <p className="mb-4">Assigning the Camera to a Video Window</p>
        <p className="mb-4">
          After adding a camera, go to the Camera List and select it to display
          in a video window.
        </p>

        <p className="text-red-600 font-semibold">
          Avoid adding duplicate cameras to prevent conflicts in the system.
        </p>

        {/* Navigation Buttons */}
        <div className="absolute bottom-4 left-4 flex gap-4">
          {!isFirst && ( // Hide "Previous" on the first section
            <Button
              onClick={onPrev}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
            >
              <ArrowLeft size={18} /> Previous
            </Button>
          )}
        </div>

        {!isLast && ( // Hide "Next" on the last section
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
