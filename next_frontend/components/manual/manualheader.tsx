"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface ManualHeaderProps {
  onSearch: (query: string) => void;
}

export default function ManualHeader({ onSearch }: ManualHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex items-center justify-between p-4 border-b shadow-sm bg-white">
      {/* Logo Banner */}
      <div className="flex-shrink-0">
        <Image
          src="/img/Vision-Drive.png"
          alt="Vision Drive"
          width={200} // Adjust width as needed
          height={50} // Adjust height as needed
          priority
        />
      </div>

      {/* Search Bar and Go Back Button */}
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value);
          }}
          className="w-64"
        />

        <Button variant="outline" onClick={() => router.push("/home")}>
          Go Back
        </Button>
      </div>
    </header>
  );
}
