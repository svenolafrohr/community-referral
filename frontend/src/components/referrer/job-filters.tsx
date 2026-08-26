"use client"

import { ListFilter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { departments, remoteLabels, type RemoteType } from "@/lib/jobs"

export type JobFiltersState = {
  search: string
  departments: string[]
  remote: RemoteType[]
}

const remoteOptions = Object.entries(remoteLabels) as [RemoteType, string][]

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-col">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted"
          >
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={() => onToggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}

export function JobFilters({
  filters,
  onChange,
}: {
  filters: JobFiltersState
  onChange: (filters: JobFiltersState) => void
}) {
  const activeFilterCount = filters.departments.length + filters.remote.length

  function toggleDepartment(value: string) {
    const next = filters.departments.includes(value)
      ? filters.departments.filter((department) => department !== value)
      : [...filters.departments, value]
    onChange({ ...filters, departments: next })
  }

  function toggleRemote(value: string) {
    const remoteValue = value as RemoteType
    const next = filters.remote.includes(remoteValue)
      ? filters.remote.filter((remote) => remote !== remoteValue)
      : [...filters.remote, remoteValue]
    onChange({ ...filters, remote: next })
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="shrink-0 rounded-full border-border bg-background px-4 font-medium"
          />
        }
      >
        <ListFilter className="size-4 text-muted-foreground" />
        Filter
        {activeFilterCount > 0 && (
          <Badge className="ml-0.5 h-5 min-w-5 justify-center rounded-full bg-foreground px-1 text-[11px] text-background">
            {activeFilterCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <p className="text-sm font-semibold text-foreground">Filter</p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, departments: [], remote: [] })}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Zurücksetzen
            </button>
          )}
        </div>
        <Separator className="my-1" />
        <FilterGroup
          label="Abteilung"
          options={departments.map((department) => ({
            value: department,
            label: department,
          }))}
          selected={filters.departments}
          onToggle={toggleDepartment}
        />
        <Separator className="my-1" />
        <FilterGroup
          label="Standort"
          options={remoteOptions.map(([value, label]) => ({ value, label }))}
          selected={filters.remote}
          onToggle={toggleRemote}
        />
      </PopoverContent>
    </Popover>
  )
}
