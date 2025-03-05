"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function UserButton({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">User Button</h2>

        <p className="mb-4">
          The <strong>User Button</strong> indicates the currently logged-in
          user and provides quick access to user-related settings.
        </p>

        <p className="mb-4">
          When clicked, a sidebar menu appears, displaying the following
          options:
        </p>

        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>Dashboard</strong> - Navigate back to the main dashboard.
          </li>
          <li>
            <strong>User Logs</strong> - View the user's activity history.
          </li>
          <li>
            <strong>Sign Out</strong> - Log out of the current session.
          </li>
          <li>
            <strong>User Guide</strong> - Access the user manual and
            instructions.
          </li>
          <li>
            <strong>About</strong> - Learn more about the application.
          </li>
        </ul>

        <p>
          This feature helps manage user sessions and provides easy access to
          essential functions.
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
