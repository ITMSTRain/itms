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

export function AddCamera({ onSave }: { onSave: (cameraName: string) => void }) {
  const [cameraName, setCameraName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false); // Manage dialog open state

  const handleSave = () => {
    if (cameraName) {
      onSave(cameraName); // Pass the camera name to the parent component
      setOpen(false); // Close the dialog after saving
    }
  };

  const handleCancel = () => {
    setOpen(false); // Close the dialog when Cancel is clicked
  };

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

        {/* Input Fields */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="camera-name" className="text-right">
              Camera Name
            </Label>
            <Input
              id="camera-name"
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)} // Update camera name state
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
              placeholder="Enter camera API"
              className="col-span-3"
            />
          </div>
        </div>

        {/* Footer Buttons */}
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
