"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function Dashboard({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p>
          The <strong>Dashboard</strong> provides an overview of the statistics
          and data gathered over time. You can view two main charts:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            <strong>Speed Over Time:</strong> Displays the recorded speeds of
            detected vehicles.
          </li>
          <li>
            <strong>Logs Over Time:</strong> Shows the classification types and
            counts over time.
          </li>
        </ul>
        <p className="mt-4">
          You can also <strong>export</strong> the gathered data to a file and{" "}
          <strong>take screenshots</strong> for documentation. To return to the
          main dashboard, simply click the <strong>Go Back</strong> button.
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
