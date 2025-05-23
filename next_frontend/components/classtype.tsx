"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const classifications = [
  { value: "all", label: "All" },
  { value: "Bus", label: "Bus" },
  { value: "Car", label: "Car" },
  { value: "Van", label: "Van" },
  { value: "Truck", label: "Truck" },
  { value: "Jeep", label: "Jeepney" },
  { value: "Tricycle", label: "Tricycle" },
  { value: "Motorcycle", label: "Motorcycle" },
  { value: "Person", label: "Pedestrian" },
];

export function ClassType() {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const sendPostRequest = async (updatedValues: string[]) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/update_classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vehicle_classes: updatedValues }),
        }
      );
      const data = await response.json();
      console.log("[ClassType] POST /update_classes response:", data);
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  const handleSelect = (value: string) => {
    setSelectedValues((prev) => {
      let newValues;

      if (value === "all") {
        newValues = classifications
          .filter((item) => item.value !== "all")
          .map((item) => item.value);
      } else {
        newValues = prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value];

        if (newValues.length === classifications.length - 1) {
          newValues = ["all"];
        }
      }

      sendPostRequest(newValues);
      return newValues;
    });
  };

  const maxDisplayed = 3;

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between truncate"
          >
            {selectedValues.length > 0
              ? selectedValues
                  .slice(0, maxDisplayed)
                  .map(
                    (value) =>
                      classifications.find((item) => item.value === value)
                        ?.label
                  )
                  .join(", ") +
                (selectedValues.length > maxDisplayed ? "..." : "")
              : "Select class type..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No class found.</CommandEmpty>
              <CommandGroup>
                {classifications.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => handleSelect(item.value)}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedValues.includes(item.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
