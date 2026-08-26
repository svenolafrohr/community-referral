"use client"

import { Layers, LayoutGrid, List } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type ViewMode = "list" | "grid" | "stack"

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (value: ViewMode) => void
}) {
  return (
    <ToggleGroup
      variant="outline"
      value={[value]}
      onValueChange={(next) => {
        const nextValue = next[0]
        if (nextValue === "list" || nextValue === "grid" || nextValue === "stack") {
          onChange(nextValue)
        }
      }}
      aria-label="Ansicht wechseln"
    >
      <ToggleGroupItem value="stack" aria-label="Als Cards anzeigen">
        <Layers />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Als Kacheln anzeigen">
        <LayoutGrid />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Als Liste anzeigen">
        <List />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
