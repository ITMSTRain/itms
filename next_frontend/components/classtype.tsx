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
  { value: "Bus", label: "Bus" },
  { value: "Car", label: "Car" },
  { value: "Jeep", label: "Jeepney" },
  { value: "Motorcycle", label: "Motorcycle" },
  { value: "Person", label: "Pedestrian" },
  { value: "Tricycle", label: "Tricycle" },
  { value: "Truck", label: "Truck" },
  { value: "Van", label: "Van" },
];

export function ClassType() {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  // Function to send the POST request
  const sendPostRequest = async (updatedValues: string[]) => {


    try {
      const response = await fetch("http://127.0.0.1:8000/update_classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicle_classes: updatedValues }),
      });

      const data = await response.json();
    } catch (error) {
    } finally {
    }
  };

  // Handle selection and trigger the API request
  const handleSelect = (value: string) => {
    setSelectedValues((prev) => {
      const newValues = prev.includes(value)
        ? prev.filter((item) => item !== value) // Remove if already selected
        : [...prev, value]; // Add if not selected

      sendPostRequest(newValues); // Send updated selection immediately
      return newValues;
    });
  };

  const maxDisplayed = 3; // Limit displayed selected items

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
                  .map((value) => classifications.find((item) => item.value === value)?.label)
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
                  <CommandItem key={item.value} onSelect={() => handleSelect(item.value)}>
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedValues.includes(item.value) ? "opacity-100" : "opacity-0"
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
