"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComboboxDemo } from "@/components/videotype";
import { ClassType } from "@/components/classtype";
import AddCamera from "@/components/add-camera";
import { FullScreenButton } from "@/components/fullscreen-button";
import SpeedOverTime from "@/components/speed-over-time";
import LogsOverTime from "@/components/logs-over-time";
import { createBrowserClient } from "@supabase/ssr";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FaUserCircle } from "react-icons/fa";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HeaderProps {
  onGridChange: (value: string) => void;
  onFullScreenClick: () => void;
  onSave: (cameraName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onGridChange, onFullScreenClick, onSave }) => {
  const router = useRouter();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("Loading...");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (!error && user?.user) {
        setUserEmail(user.user.email || "Unknown User");
        setUserImage(user.user.user_metadata?.avatar_url || null);
      }
    };
    fetchUser();
  }, []);

  const navigateTo = (path: string) => router.push(path);

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

      if (updateError) console.error("Error updating logout time:", updateError);

      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-[#EFF6FF] shadow-md p-4">
      <div className="flex items-center justify-between">
        <img src="/img/Vision-Drive.png" alt="Vision Drive Logo" className="h-16 object-contain" />

        <div className="flex items-center space-x-4">
          <ComboboxDemo onChange={onGridChange} />
          <ClassType />
          <AddCamera onSave={onSave} />
          <FullScreenButton onClick={onFullScreenClick} />
          <SpeedOverTime />
          <LogsOverTime />

          <Sheet>
            <SheetTrigger asChild>
              {userImage ? (
                <img
                  src={userImage}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <FaUserCircle className="h-10 w-10 text-[#800000] cursor-pointer" />
              )}
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">{userEmail}</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-4">
                <Button variant="outline" className="w-full" onClick={() => navigateTo("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigateTo("/userlogs")}>
                  User Logs
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigateTo("/user-guide")}>
                  User Guide
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigateTo("/about")}>
                  About
                </Button>
                <Button variant="destructive" className="w-full" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
