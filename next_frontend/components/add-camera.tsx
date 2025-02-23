import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from '@/utils/supabase/client'; // ✅ Import createClient

interface AddCameraProps {
  onSave: (cameraName: string, cameraAPI: string) => void;
}

export default function AddCamera({ onSave }: AddCameraProps) {
  const supabase = createClient(); // ✅ Initialize Supabase

  const [cameraName, setCameraName] = useState<string>("");
  const [cameraAPI, setCameraAPI] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleSave = async () => {
    if (cameraName && cameraAPI) {
      try {
        const { data, error } = await supabase
          .from('video_data')
          .insert([
            { video_name: cameraName, video_source: cameraAPI },
          ])
          .select();

        if (error) {
          console.error("Error adding camera to database:", error);
        } else {
          console.log("Camera added:", data);
          onSave(cameraName, cameraAPI);
          setOpen(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    } else {
      alert("Please fill in both Camera Name and API.");
    }
  };

  const handleCancel = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Add Camera
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Camera</DialogTitle>
          <DialogDescription>
            Get the API and set your camera name.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="camera-name" className="text-right">
              Camera Name
            </Label>
            <Input
              id="camera-name"
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)}
              placeholder="Enter camera name"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="camera-api" className="text-right">
              Camera API
            </Label>
            <Input
              id="camera-api"
              value={cameraAPI}
              onChange={(e) => setCameraAPI(e.target.value)}
              placeholder="Enter camera API"
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
