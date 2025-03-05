"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function UserLogs({
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
        <h2 className="text-2xl font-bold mb-4">User Logs</h2>

        <p className="mb-4">
          The <strong>User Logs</strong> section monitors and records user login
          activity and history. This feature ensures security by keeping track
          of users accessing the system.
        </p>

        <p className="mb-4">The following details are recorded:</p>

        <ul className="list-disc pl-5 mb-4">
          <li>
            <strong>Username</strong> – Identifies the end user who logged in.
          </li>
          <li>
            <strong>Login & Logout Time</strong> – Tracks when users enter and
            exit the system.
          </li>
          <li>
            <strong>MAC Address</strong> – Captures device information to
            monitor unauthorized logins.
          </li>
        </ul>

        <p>
          This tracking system helps identify unauthorized users and ensures
          secure access to the platform.
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
