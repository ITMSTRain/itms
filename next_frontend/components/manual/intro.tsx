"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Introduction({ onNext }: { onNext: () => void }) {
  return (
    <Card className="relative">
      <CardContent className="pt-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Introduction</h2>

        <div className="mb-4">
          <Image
            src="/Vision-Drive.png"
            alt="Vision Drive"
            width={600}
            height={400}
            className="rounded-lg mx-auto block"
          />
        </div>

        <p className="mb-4">
          <strong>Welcome to Vision Drive!</strong>
        </p>

        <p className="mb-4">
          This manual is designed to guide you through the features and
          functionalities of the Vision Drive platform.
        </p>

        <p className="mb-4">
          <strong>What is Vision Drive?</strong>
        </p>

        <p className="mb-4">
          <em>Vision Drive</em> is an AI-driven system designed to enhance
          traffic management in Batangas City.
        </p>

        <ul className="list-disc list-inside mb-4">
          <li>Real-time traffic monitoring and data analysis.</li>
          <li>Vehicle classification based on type and speed.</li>
          <li>Pedestrian tracking to improve road safety.</li>
          <li>Recording and analyzing road accidents.</li>
          <li>Providing visual analytics for traffic trends and patterns.</li>
        </ul>

        <p>
          Dive into the following sections to learn how to make the most out of
          Vision Drive and contribute to smarter, safer roads in Batangas City!
        </p>

        {/* Next Button */}
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
