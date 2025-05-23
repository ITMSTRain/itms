"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function SpeedOverTime({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Speed Over Time</h2>{" "}
        <p className="mb-4">
          The <strong>Speed Over Time</strong> button opens a drawer container
          displaying a chart that represents the maximum speed of detected
          vehicles in the surveillance feed.
        </p>
        <p className="mb-4">
          This data is collected every <strong>5 seconds</strong> to track
          changes in speed over time. We show <strong>maximum speeds</strong>{" "}
          instead of averages to better capture speed variations and provide
          more meaningful visualizations.
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>
            The <strong>Y-axis</strong> represents the maximum speed detected at
            each time interval.
          </li>
          <li>
            The <strong>X-axis</strong> represents the time intervals at which
            the speed was measured.
          </li>
        </ul>
        <p>
          This feature helps in monitoring the flow of traffic, detecting speed
          trends, and assessing driving behavior based on historical data.
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
