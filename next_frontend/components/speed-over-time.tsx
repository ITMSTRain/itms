"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

// API URL for HTTP polling
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/PB_latest_speed`;
const API_URL2 = `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsu_latest_speed`;

const chartConfig = {
  speed: {
    label: "Vehicle Speed (km/h)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Define TypeScript interface for API response
interface SpeedDataResponse {
  latest_speed: Record<string, number>; // Object with vehicle IDs as keys and speeds as values
  vehicle_count: number;
}

// Define chart data type
interface ChartData {
  time: string;
  speed: number;
}

export default function SpeedOverTime() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);

  React.useEffect(() => {
    const fetchSpeedData = async () => {
      try {
        console.log("🔄 Fetching speed data...");
        const response = await fetch(API_URL);

        if (!response.ok) throw new Error("❌ Failed to fetch speed data");

        const data: SpeedDataResponse = await response.json();

        console.log("✅ Received data:", data);
        if (data.latest_speed && Object.keys(data.latest_speed).length > 0) {
          const speedValues: number[] = Object.values(data.latest_speed).map(
            (speed) => Number(speed)
          );

          // Instead of averaging, let's show the max speed (most representative of current traffic)
          // and also track individual speeds for better variation
          const maxSpeed =
            speedValues.length > 0 ? Math.max(...speedValues) : 0;
          const minSpeed =
            speedValues.length > 0 ? Math.min(...speedValues) : 0;
          const avgSpeed =
            speedValues.length > 0
              ? speedValues.reduce((a: number, b: number) => a + b, 0) /
                speedValues.length
              : 0;

          // Use max speed as primary indicator for better variation visibility
          const displaySpeed = maxSpeed;

          console.log("📈 Speed values:", {
            speedValues,
            maxSpeed,
            minSpeed,
            avgSpeed,
            displaySpeed,
          });

          setChartData((prevData) => {
            const newData = [
              ...prevData.slice(-9), // Keep only last 10 entries for more responsive chart
              {
                time: new Date().toLocaleTimeString().slice(0, 5),
                speed: Math.round(displaySpeed * 100) / 100,
              },
            ];
            console.log("📉 Updated Chart Data:", newData);
            return newData;
          });
        }
      } catch (error) {
        console.error("❌ Error fetching speed data:", error);
      }
    }; // Polling: Fetch data every 5 seconds for more responsive updates
    const interval = setInterval(fetchSpeedData, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // ✅ Runs only once

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Speed Over Time</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Speed Over Time</DrawerTitle>
          <DrawerDescription>Live vehicle speed updates</DrawerDescription>
        </DrawerHeader>

        <Card className="border border-gray-400">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            {" "}
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Speed Over Time - Live Data</CardTitle>
              <CardDescription>
                Showing maximum speeds for better variation visibility
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickMargin={8} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="speed" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <DrawerFooter>
          <DrawerClose className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80">
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
