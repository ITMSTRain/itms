"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function FrameSelect({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Frame Select</h2>
        <p className="mb-4">
          The <strong>Frame Select</strong> button allows users to choose how
          many video windows to display on the screen. There are four available
          layout options:
        </p>

        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>1x1</strong> - A single video window.
          </li>
          <li>
            <strong>2x2</strong> - Four video windows.
          </li>
          <li>
            <strong>3x3</strong> - Nine video windows.
          </li>
          <li>
            <strong>4x4</strong> - Sixteen video windows.
          </li>
        </ul>

        <p>
          Users can select the preferred layout based on their monitoring needs.
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
