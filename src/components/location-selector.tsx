"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import type { Location } from "@/lib/types";

interface LocationSelectorProps {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export function LocationSelector({
  locations,
  selectedId,
  onSelect,
  isLoading,
}: LocationSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <Select
        value={selectedId ?? ""}
        onValueChange={onSelect}
        disabled={isLoading}
      >
        <SelectTrigger
          className="w-full min-w-[200px] rounded-full sm:w-[220px]"
          aria-label="Select a location"
        >
          <SelectValue
            placeholder={isLoading ? "Loading..." : "Pick a location"}
          />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4}>
          {locations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id}>
              <span className="font-medium">{loc.name}</span>
              {loc.address?.locality && (
                <span className="ml-1 text-muted-foreground text-sm">
                  — {loc.address.locality}
                  {loc.address.administrativeDistrictLevel1
                    ? `, ${loc.address.administrativeDistrictLevel1}`
                    : ""}
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
