"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function ClassType({
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
        <h2 className="text-2xl font-bold mb-4">Class Type</h2>

        <p className="mb-4">
          The <strong>Class Type</strong> button allows users to filter the
          types of vehicles or pedestrians they want to detect within the
          surveillance camera.
        </p>

        <p className="mb-4">
          By default, the system is set to detect{" "}
          <span className="text-blue-600 font-semibold">
            all classifications
          </span>
          . Users can deselect specific options, but at least{" "}
          <span className="text-red-600 font-semibold">
            one class must remain selected
          </span>{" "}
          at all times. This ensures that the detection system continues to
          function properly.
        </p>

        <p className="mb-4 font-semibold">
          The available classifications include:
        </p>

        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>Cars</strong>
          </li>
          <li>
            <strong>Jeepneys</strong>
          </li>
          <li>
            <strong>Motorcycles</strong>
          </li>
          <li>
            <strong>Pedestrians</strong>
          </li>
          <li>
            <strong>Tricycles</strong>
          </li>
        </ul>

        <p>
          These classifications help in{" "}
          <span className="text-green-600 font-semibold">
            analyzing traffic flow
          </span>{" "}
          and monitoring specific types of vehicles or pedestrian activity based
          on user preferences.
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
