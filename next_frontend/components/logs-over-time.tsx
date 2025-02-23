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

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150, views: 372 },
  { date: "2024-04-02", desktop: 97, mobile: 180, views: 277 },
  { date: "2024-04-03", desktop: 167, mobile: 120, views: 287 },
  { date: "2024-04-04", desktop: 242, mobile: 260, views: 502 },
  { date: "2024-04-05", desktop: 373, mobile: 290, views: 663 },
  { date: "2024-04-06", desktop: 301, mobile: 340, views: 641 },
  { date: "2024-04-07", desktop: 245, mobile: 180, views: 425 },
  { date: "2024-04-08", desktop: 409, mobile: 320, views: 729 },
  { date: "2024-04-09", desktop: 59, mobile: 110, views: 169 },
  { date: "2024-04-10", desktop: 261, mobile: 190, views: 451 },
];

const chartConfig = {
  views: {
    label: "Total Views",
    color: "hsl(var(--chart-3))",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function LogsOverTime() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("views");

  const total = React.useMemo(() => ({
    views: chartData.reduce((acc, curr) => acc + curr.views, 0),
    desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
    mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
  }), []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Logs Over Time</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Logs Over Time</DrawerTitle>
          <DrawerDescription>Analyze logs across different platforms.</DrawerDescription>
        </DrawerHeader>

        <Card className="border border-gray-400">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Log Data Overview</CardTitle>
              <CardDescription>Showing total logs for the past 10 days</CardDescription>
            </div>
            <div className="flex">
              {["views", "desktop", "mobile"].map((key) => {
                const chart = key as keyof typeof chartConfig;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {total[chart].toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="px-2 sm:p-6">
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey={activeChart}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                    />
                  }
                />
                <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
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
