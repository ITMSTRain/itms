import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import { ComboboxDemo } from "@/components/videotype";
import { ClassType } from "@/components/classtype";
import AddCamera from "@/components/add-camera";
import { FullScreenButton } from "@/components/fullscreen-button";
import SpeedOverTime from "@/components/speed-over-time";
import LogsOverTime from "@/components/logs-over-time";
import { createBrowserClient } from "@supabase/ssr";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HeaderProps {
  onGridChange: (value: string) => void;
  onFullScreenClick: () => void;
  onSave: (cameraName: string, cameraAPI: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onGridChange, onFullScreenClick, onSave }) => {
  const router = useRouter(); // ✅ useRouter is now correctly defined
  const [userImage, setUserImage] = useState("/img/default-avatar.png"); // Default image
  const [userEmail, setUserEmail] = useState("Loading...");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (!error && user?.user) {
        setUserEmail(user.user.email || "Unknown User");
        setUserImage(user.user.user_metadata?.avatar_url || "/img/default-avatar.png"); // Set user's profile picture
      }
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
    <header className="bg-[#EFF6FF] shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/img/logo.png"
            alt="Road Guard Logo"
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            ROAD GUARD
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <ComboboxDemo onChange={onGridChange} />
          <ClassType />
          <AddCamera onSave={onSave} />
          <FullScreenButton onClick={onFullScreenClick} />
          <SpeedOverTime />
          <LogsOverTime />

          {/* ✅ User image is now a clickable button that opens the sidebar with full functionality */}
          <Sheet>
            <SheetTrigger asChild>
              <img
                src={userImage}
                alt="User Avatar"
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
              />
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
        </div>
      </div>
    </header>
  );
};

export default Header;
