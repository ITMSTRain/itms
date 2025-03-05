"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiSearch, FiFilter } from "react-icons/fi";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AttendanceLogs = () => {
  const router = useRouter();
  const [logs, setLogs] = useState<
    { Email: string; TimeIn: string; TimeOut: string; mac_address: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // 🔹 Fetch logs using Supabase function
  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("userlogs") // ✅ Fetch from table
        .select("Email, TimeIn, TimeOut, mac_address") // 🔥 Now includes `mac_address`
        .order("TimeIn", { ascending: false });

      if (error) {
        console.error("Error fetching logs:", error.message);
      } else {
        console.log("Fetched logs:", data); // Debugging
        setLogs(data);
      }
    };

    fetchLogs();
  }, []);

  // 🔹 Filter logs based on search and date
  const filteredLogs = logs.filter(
    (log) =>
      log["Email"].toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!dateFilter || log["TimeIn"].startsWith(dateFilter))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button onClick={() => router.push("/home")} className="bg-gray-600 text-white">
            <FiHome className="mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell>Time Out</TableCell>
                <TableCell>MAC Address</TableCell> {/* 🔥 New Column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log["Email"]}</TableCell>
                    <TableCell>{log["TimeIn"] ? new Date(log["TimeIn"]).toLocaleString() : "-"}</TableCell>
                    <TableCell>{log["TimeOut"] ? new Date(log["TimeOut"]).toLocaleString() : "-"}</TableCell>
                    <TableCell>{log["mac_address"] || "Unknown"}</TableCell> {/* 🔥 Display MAC */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-center text-gray-600 py-4">
        <p>All Rights Reserved @Batangas State University</p>
      </footer>
    </div>
  );
};

export default AttendanceLogs;
