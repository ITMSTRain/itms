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
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AvatarSidebar = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState("Loading...");

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user || !user.user) {
        console.error("Error fetching user:", error);
        return;
      }
      setUserEmail(user.user.email || "Unknown User");
    };
    fetchUser();
  }, []);

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  const navigateToUserLogs = () => {
    router.push("/userlogs");
  };

  const signOut = async () => {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError || !user || !user.user) {
        console.error("Error fetching user:", userError);
        return;
      }

      const userEmail = user.user.email;

      const { error: updateError } = await supabase
        .from("userlogs")
        .update({ TimeOut: new Date().toISOString() })
        .eq("Email", userEmail)
        .is("TimeOut", null);

      if (updateError) {
        console.error("Error updating logout time:", updateError);
      } else {
        console.log("Logout time recorded successfully!");
      }

      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
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
          <SheetTitle className="text-lg font-bold">{userEmail}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Button variant="outline" className="w-full" onClick={navigateToDashboard}>
            Go to Dashboard
          </Button>
          <Button variant="outline" className="w-full" onClick={navigateToUserLogs}>
            User Logs
          </Button>
          <Button variant="destructive" className="w-full" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        <Separator className="my-4" />

        <SheetFooter className="mt-[500px]">
          <Button variant="outline" className="w-full" onClick={navigateToAbout}>
            About
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AvatarSidebar;
