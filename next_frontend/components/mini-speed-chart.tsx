"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
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

interface MiniSpeedChartProps {
  cameraName: string;
  isActive?: boolean;
  data?: { time: string; speed: number }[];
}

const apiMap: Record<string, string> = {
  bsu_road_sample: `${process.env.NEXT_PUBLIC_BACKEND_URL}/bsu_latest_speed`,
  pb_road_sample: `${process.env.NEXT_PUBLIC_BACKEND_URL}/PB_latest_speed`,
};

const dummyData = [
  { time: "12:00", speed: 0 },
  { time: "12:01", speed: 0 },
  { time: "12:02", speed: 0 },
  { time: "12:03", speed: 0 },
  { time: "12:04", speed: 0 },
];

const chartConfig = {
  speed: {
    label: "Speed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const MiniSpeedChart: React.FC<MiniSpeedChartProps> = ({
  cameraName,
  isActive,
  data: propData,
}) => {
  const [dataMap, setDataMap] = useState<{
    [key: string]: { time: string; speed: number }[];
  }>({});

  // Use propData if provided, otherwise fallback to local state
  const data = propData || dataMap[cameraName] || dummyData;

  useEffect(() => {
    // If data is provided as prop, skip fetching
    if (propData) return;
    if (!isActive) {
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
        if (json.latest_speed && Object.keys(json.latest_speed).length > 0) {
          const speedValues = Object.values(json.latest_speed).map(Number);
          const avgSpeed =
            speedValues.length > 0
              ? speedValues.reduce((a, b) => a + b, 0) / speedValues.length
              : 0;
          setDataMap((prev) => {
            const prevArr = prev[cameraName] || [];
            const newArr = [
              ...prevArr.slice(-9),
              {
                time: new Date().toLocaleTimeString().slice(0, 5),
                speed: Math.round(avgSpeed * 100) / 100, // round to 2 decimal places
              },
            ];
            return { ...prev, [cameraName]: newArr };
          });
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
        <CardTitle>Speed Over Time</CardTitle>
        <CardDescription>Recent speed analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="speed"
              type="natural"
              stroke="var(--color-speed)"
              strokeWidth={2}
              dot={{ fill: "var(--color-speed)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MiniSpeedChart;
