"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function About({ onPrev }: { onPrev: () => void }) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p>
          The <strong>About</strong> section shares the story behind{" "}
          <strong>Vision Drive</strong>, its mission, and its main goals.
        </p>

        <h3 className="text-xl font-semibold mt-4">Our Vision & Mission</h3>
        <p className="mt-2">
          Vision Drive aims to revolutionize real-time traffic monitoring using
          AI-powered surveillance. Our mission is to enhance road safety,
          optimize traffic management, and provide insightful analytics for
          authorities.
        </p>

        <h3 className="text-xl font-semibold mt-4">Contact Information</h3>
        <p className="mt-2">
          For inquiries, support, or collaboration, reach out to{" "}
          <strong>BatStateU</strong> and its authorities:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Email: contact@batstateu.edu.ph</li>
          <li>Phone: +63 43 123 4567</li>
          <li>
            Address: Batangas State University, Batangas City, Philippines
          </li>
        </ul>

        {/* Only Previous Button */}
        <div className="absolute bottom-4 left-4 flex gap-4">
          <Button
            onClick={onPrev}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
          >
            <ArrowLeft size={18} /> Previous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
