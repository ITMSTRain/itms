"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FiRefreshCw, FiDownload, FiCamera } from "react-icons/fi";

// ShadCN components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const performanceData = [
  { time: "00:00", speed: 45, logs: 20, errorLogs: 5, warningLogs: 8 },
  { time: "04:00", speed: 62, logs: 15, errorLogs: 3, warningLogs: 5 },
  { time: "08:00", speed: 78, logs: 30, errorLogs: 8, warningLogs: 12 },
  { time: "12:00", speed: 56, logs: 25, errorLogs: 6, warningLogs: 10 },
  { time: "16:00", speed: 89, logs: 40, errorLogs: 10, warningLogs: 15 },
  { time: "20:00", speed: 68, logs: 22, errorLogs: 4, warningLogs: 9 },
];

const PerformanceDashboard = () => {
  const router = useRouter();
  const [selectedChart, setSelectedChart] = useState("speed");
  const [timeRange, setTimeRange] = useState("1d");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError("Failed to refresh data. Please try again later.");
    }, 1000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(performanceData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;
    const exportFileDefaultName = "performance_data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleScreenshot = () => {
    console.log("Taking screenshot");
  };

  const handleBackToHome = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 shadow-2xl shadow-black/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Performance Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Left buttons for chart selection */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setSelectedChart("speed")}
                  className={`px-4 py-2 ${
                    selectedChart === "speed"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Speed Chart
                </Button>
                <Button
                  onClick={() => setSelectedChart("logs")}
                  className={`px-4 py-2 ${
                    selectedChart === "logs"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Logs Chart
                </Button>
              </div>

              {/* Time Range Dropdown */}
              <Select
                value={timeRange}
                onValueChange={(value) => setTimeRange(value)}
              >
                <SelectTrigger className="bg-white border border-gray-300 rounded-md px-4 py-2 w-auto max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 Hours</SelectItem>
                  <SelectItem value="1w">Last Week</SelectItem>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {/* Right buttons for actions */}
              <div className="flex gap-4 ml-auto">
                <Button
                  onClick={handleScreenshot}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
                >
                  <FiCamera className="inline" />
                  <span className="ml-2">Screenshot</span>
                </Button>

                <Button
                  onClick={handleRefresh}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  <FiRefreshCw
                    className={`inline ${loading ? "animate-spin" : ""}`}
                  />
                  <span className="ml-2">Refresh</span>
                </Button>

                <Button
                  onClick={handleExport}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  <FiDownload className="inline" />
                  <span className="ml-2">Export</span>
                </Button>

                <Button
                  onClick={handleBackToHome}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl shadow-black/50">
          <CardContent>
            {selectedChart === "speed" ? (
              <h2 className="h-[20px] mt-6 text-xl font-semibold mb-4">
                Speed Over Time
              </h2>
            ) : (
              <h2 className="h-[20px] mt-6 text-xl font-semibold mb-4">
                Logs Over Time
              </h2>
            )}
            <div className="h-[700px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === "speed" ? (
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="speed"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6" }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="errorLogs" stackId="logs" fill="#EF4444" />
                    <Bar dataKey="warningLogs" stackId="logs" fill="#F59E0B" />
                    <Bar dataKey="logs" stackId="logs" fill="#10B981" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;
