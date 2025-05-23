"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MiniClassChartProps {
  cameraName: string;
  isActive?: boolean;
  data?: { type: string; count: number }[];
}

const apiMap: Record<string, string> = {
  bsu_road_sample: `${process.env.NEXT_PUBLIC_BACKEND_URL}/BSU_vehicle_classifications`,
  pb_road_sample: `${process.env.NEXT_PUBLIC_BACKEND_URL}/PB_vehicle_classifications`,
};

const vehicleTypes = [
  "Bus",
  "Car",
  "Jeep",
  "Motorcycle",
  "Person",
  "Tricycle",
  "Truck",
  "Van",
];
const dummyData = vehicleTypes.map((type) => ({
  type,
  count: Math.floor(Math.random() * 3),
}));

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-2))", // Use a different color for class chart
  },
} satisfies ChartConfig;

const MiniClassChart: React.FC<MiniClassChartProps> = ({
  cameraName,
  isActive,
  data: propData,
}) => {
  const [dataMap, setDataMap] = useState<{
    [key: string]: { type: string; count: number }[];
  }>({});

  // Use propData if provided, otherwise fallback to local state
  const data = propData || dataMap[cameraName] || dummyData;

  useEffect(() => {
    // If data is provided as prop, skip fetching
    if (propData) return;
    if (!isActive) {
      // Don't overwrite data, just display last known data
      return;
    }
    const fetchData = async () => {
      if (!apiMap[cameraName]) {
        setDataMap((prev) => ({ ...prev, [cameraName]: dummyData }));
        return;
      }
      try {
        const res = await fetch(apiMap[cameraName]);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (json.vehicle_classifications) {
          const formatted = vehicleTypes.map((type) => ({
            type,
            count: json.vehicle_classifications[type] || 0,
          }));
          setDataMap((prev) => ({ ...prev, [cameraName]: formatted }));
        }
      } catch {
        setDataMap((prev) => ({ ...prev, [cameraName]: dummyData }));
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [cameraName, isActive, propData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Class Count</CardTitle>
        <CardDescription>Recent vehicle class analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 20, left: 12, right: 12 }}
            barCategoryGap={"20%"}
            barGap={2}
            height={120}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="type"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) =>
                value.length > 6 ? value.slice(0, 6) + "." : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={6}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MiniClassChart;
