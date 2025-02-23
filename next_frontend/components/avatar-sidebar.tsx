"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const AvatarSidebar = () => {
  const router = useRouter(); // Use useRouter from next/navigation

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  const navigateToUserLogs = () => {
    router.push("/userlogs");
  };

  const signOut = () => {
    // Handle sign out logic here (e.g., clear cookies, reset state)
    router.push("/login");
  };

  const navigateToAbout = () => {
    router.push("/about");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="h-10 w-10 cursor-pointer" />
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">John Doe</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={navigateToDashboard}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={navigateToUserLogs}
          >
            User Logs
          </Button>
          <Button variant="destructive" className="w-full" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        <Separator className="my-4" />

        <SheetFooter className="mt-[575px]">
          <Button
            variant="outline" // Match "Go to Dashboard" layout
            className="w-full"
            onClick={navigateToAbout}
          >
            About
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AvatarSidebar;
