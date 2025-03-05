"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function LogsOverTime({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Logs Over Time</h2>

        <p className="mb-4">
          The <strong>Logs Over Time</strong> button opens a drawer container
          that displays the historical data gathered during the active
          surveillance session.
        </p>

        <p className="mb-4">
          This log presents a graphical representation of detected
          classifications over time:
        </p>

        <ul className="list-disc pl-5 mb-4">
          <li>
            The <strong>X-axis</strong> represents the classification types
            (e.g., Cars, Motorcycles, Pedestrians).
          </li>
          <li>
            The <strong>Y-axis</strong> represents the number of detections
            recorded over time.
          </li>
        </ul>

        <p>
          This feature allows users to analyze trends and patterns in traffic
          monitoring, making it easier to review past detections and assess
          vehicle flow.
        </p>

        {/* Navigation Buttons */}
        <div className="absolute bottom-4 left-4 flex gap-4">
          <Button
            onClick={onPrev}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
          >
            <ArrowLeft size={18} /> Previous
          </Button>
        </div>

        <Button
          onClick={onNext}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next <ArrowRight size={18} />
        </Button>
      </CardContent>
    </Card>
  );
}
