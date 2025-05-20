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
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL!}/PB_vehicle_classifications`; // ✅ Fetch vehicle classifications

const vehicleChartConfig = {
  Bus: { label: "Bus", color: "hsl(var(--chart-1))" },
  Car: { label: "Car", color: "hsl(var(--chart-2))" },
  Jeep: { label: "Jeep", color: "hsl(var(--chart-3))" },
  Motorcycle: { label: "Motorcycle", color: "hsl(var(--chart-4))" },
  Person: { label: "Person", color: "hsl(var(--chart-5))" },
  Tricycle: { label: "Tricycle", color: "hsl(var(--chart-6))" },
  Truck: { label: "Truck", color: "hsl(var(--chart-7))" },
  Van: { label: "Van", color: "hsl(var(--chart-8))" },
} satisfies ChartConfig;

interface VehicleData {
  vehicle_classifications: Record<string, number>;
}

export default function LogsOverTime() {
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        console.log("🔄 Fetching vehicle classification data...");
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("❌ Failed to fetch vehicle data");

        const data: VehicleData = await response.json();
        console.log("✅ Received data:", data);

        if (data.vehicle_classifications) {
          const formattedData = Object.keys(data.vehicle_classifications).map(
            (key) => ({
              type: key,
              count: data.vehicle_classifications[key],
            })
          );

          console.log("📊 Formatted Chart Data:", formattedData);
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("❌ Error fetching vehicle classification data:", error);
      }
    };

    // Polling every 5 seconds
    const interval = setInterval(fetchVehicleData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Logs Over Time</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Logs Over Time</DrawerTitle>
          <DrawerDescription>
            Live vehicle classification updates
          </DrawerDescription>
        </DrawerHeader>

        <Card className="border border-gray-400">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Vehicle Classifications</CardTitle>
              <CardDescription>Showing real-time vehicle logs</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={vehicleChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tickMargin={8} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
          ``
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
