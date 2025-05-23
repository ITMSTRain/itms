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
import { createClient } from "../utils/supabase/client";

// Supabase client
const supabase = createClient();

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
      // Query the latest 15 speed_data entries, sorted by created_at descending
      const { data: speedRows, error } = await supabase
        .from("speed_data")
        .select("speed,created_at")
        .order("created_at", { ascending: false })
        .limit(15);
      if (error) {
        setChartData([]);
        return;
      }
      if (speedRows && speedRows.length > 0) {
        // Reverse to get oldest first for chart
        const chartData = speedRows.reverse().map((row: any) => ({
          time: new Date(row.created_at).toLocaleTimeString(),
          speed: Math.round(row.speed * 100) / 100,
        }));
        setChartData(chartData);
      }
    };
    fetchSpeedData();
    const interval = setInterval(fetchSpeedData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
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
