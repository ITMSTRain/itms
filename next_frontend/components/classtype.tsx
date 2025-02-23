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
  { value: "Cars", label: "Cars" },
  { value: "Jeepney", label: "Jeepney" },
  { value: "Motorcycle", label: "Motorcycle" },
  { value: "Pedestrian", label: "Pedestrian" },
  { value: "Tricycle", label: "Tricycle" },
];

export function ClassType() {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const handleSelect = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const maxDisplayed = 3; // Limit the number of displayed selected items in the button

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select classification"
          className="w-[200px] justify-between truncate" // Added truncate class for text overflow
        >
          {selectedValues.length > 0
            ? selectedValues
                .slice(0, maxDisplayed) // Show only first `maxDisplayed` options
                .map((value) => classifications.find((item) => item.value === value)?.label)
                .join(", ") +
              (selectedValues.length > maxDisplayed ? "..." : "") // Add ellipses if there are more items
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
  );
}
