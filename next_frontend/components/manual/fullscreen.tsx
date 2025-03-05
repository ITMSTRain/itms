"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function FullScreen({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Full Screen Mode</h2>

        <p className="mb-4">
          The <strong>Full Screen</strong> button allows users to expand all
          video windows to full screen simultaneously. Regardless of the
          selected frame layout (e.g., <strong>4x4</strong> with 16 video
          windows), all video feeds will be displayed in full screen at once.
        </p>

        <p className="mb-4">
          In addition to this, users can also enter full-screen mode for a
          single video window by double-clicking on any video feed.
        </p>

        <p className="mb-4 font-semibold">To exit full-screen mode:</p>

        <ul className="list-disc pl-5 mb-4">
          <li>
            Press the <strong>Esc</strong> key.
          </li>
          <li>
            Hover over the top of the screen to reveal the <strong>X</strong>{" "}
            button.
          </li>
        </ul>

        <p>
          This feature provides a flexible way to focus on multiple or
          individual video feeds as needed.
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
