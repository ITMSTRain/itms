"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { FiHome, FiSearch, FiFilter } from "react-icons/fi";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import Dialog from "@/components/dialog"; // Custom Dialog component
import DialogContent from "@/components/dialogcontent"; // Custom DialogContent component
import DialogHeader from "@/components/dialogheader"; // Custom DialogHeader component
import DialogFooter from "@/components/dialogfooter"; // Custom DialogFooter component
import { Table, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"; // ShadCN Table components

const AttendanceLogs = () => {
  const router = useRouter(); // Initialize useRouter
  const [logs, setLogs] = useState([
    {
      id: 1,
      username: "john.doe",
      timeIn: "09:00 AM",
      timeOut: "05:00 PM",
      date: "2024-01-20",
    },
    {
      id: 2,
      username: "jane.smith",
      timeIn: "08:30 AM",
      timeOut: "04:30 PM",
      date: "2024-01-20",
    },
    {
      id: 3,
      username: "mike.wilson",
      timeIn: "09:15 AM",
      timeOut: "05:15 PM",
      date: "2024-01-20",
    },
  ]);

  const [isTimeIn, setIsTimeIn] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  const handleLogTime = () => {
    setShowConfirmDialog(true);
  };

  const confirmLogTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const dateString = now.toISOString().split("T")[0];

    const newLog = {
      id: logs.length + 1,
      username: "current.user", // Replace with actual username logic
      timeIn: isTimeIn ? timeString : "", // Default value for timeIn or timeOut
      timeOut: !isTimeIn ? timeString : "", // Default value for timeIn or timeOut
      date: dateString,
    };

    if (isTimeIn) {
      setLogs([...logs, newLog]);
    } else {
      const updatedLogs = logs.map((log) =>
        log.id === logs.length ? { ...log, timeOut: timeString } : log
      );
      setLogs(updatedLogs);
    }

    setIsTimeIn(!isTimeIn);
    setShowConfirmDialog(false);
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!dateFilter || log.date === dateFilter)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 pb-16"> {/* Added padding-bottom to avoid overlap */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left-aligned Back to Home button */}
          <div className="flex sm:justify-start w-full sm:w-auto">
            <Button
              onClick={() => router.push("/home")} // Redirect to /home
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <FiHome className="mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Right-aligned inputs and button */}
          <div className="flex items-center gap-4 sm:justify-end w-full sm:w-auto">
            {/* Log Time Button */}
            <Button
              onClick={handleLogTime}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isTimeIn ? "Log Time In" : "Log Time Out"}
            </Button>

            {/* Search username input */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Date input */}
            <div className="relative">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell>Time Out</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.username}</TableCell>
                  <TableCell>{log.timeIn}</TableCell>
                  <TableCell>{log.timeOut || "-"}</TableCell>
                  <TableCell>{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {showConfirmDialog && (
          <Dialog isOpen={true} onClose={() => setShowConfirmDialog(false)}>
            <DialogContent>
              <DialogHeader>
                <h2 className="text-xl font-semibold">Log Time</h2>
                <h3 className="text-lg font-medium mb-4">
                  Are you sure you want to log your time?
                </h3>
              </DialogHeader>
              <DialogFooter
                onCancel={() => setShowConfirmDialog(false)}
                onConfirm={confirmLogTime}
                cancelText="Cancel"
                confirmText="Confirm"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-center text-gray-600 py-4">
        <p>All Rights Reserved @Batangas State University</p>
      </footer>
    </div>
  );
};

export default AttendanceLogs;
