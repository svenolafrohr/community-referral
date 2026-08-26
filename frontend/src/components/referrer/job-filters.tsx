"use client"

import { ListFilter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatRemotePolicy, remotePolicyOptions } from "@/lib/format"
import type { RemotePolicy } from "@/lib/jobs"

export type JobFiltersState = {
  search: string
  functionAreas: string[]
  remotePolicies: RemotePolicy[]
  communities: string[]
}

export type JobFilterOptions = {
  functionAreas: string[]
  communities: string[]
}

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
  if (options.length === 0) return null
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
  options,
}: {
  filters: JobFiltersState
  onChange: (filters: JobFiltersState) => void
  options: JobFilterOptions
}) {
  const activeFilterCount =
    filters.functionAreas.length + filters.remotePolicies.length + filters.communities.length

  function toggleFunctionArea(value: string) {
    const next = filters.functionAreas.includes(value)
      ? filters.functionAreas.filter((area) => area !== value)
      : [...filters.functionAreas, value]
    onChange({ ...filters, functionAreas: next })
  }

  function toggleRemotePolicy(value: string) {
    const remoteValue = value as RemotePolicy
    const next = filters.remotePolicies.includes(remoteValue)
      ? filters.remotePolicies.filter((policy) => policy !== remoteValue)
      : [...filters.remotePolicies, remoteValue]
    onChange({ ...filters, remotePolicies: next })
  }

  function toggleCommunity(value: string) {
    const next = filters.communities.includes(value)
      ? filters.communities.filter((community) => community !== value)
      : [...filters.communities, value]
    onChange({ ...filters, communities: next })
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
              onClick={() =>
                onChange({ ...filters, functionAreas: [], remotePolicies: [], communities: [] })
              }
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Zurücksetzen
            </button>
          )}
        </div>
        <Separator className="my-1" />
        <FilterGroup
          label="Abteilung"
          options={options.functionAreas.map((area) => ({ value: area, label: area }))}
          selected={filters.functionAreas}
          onToggle={toggleFunctionArea}
        />
        <Separator className="my-1" />
        <FilterGroup
          label="Standort"
          options={remotePolicyOptions.map((policy) => ({
            value: policy,
            label: formatRemotePolicy(policy),
          }))}
          selected={filters.remotePolicies}
          onToggle={toggleRemotePolicy}
        />
        <Separator className="my-1" />
        <FilterGroup
          label="Community"
          options={options.communities.map((community) => ({
            value: community,
            label: community,
          }))}
          selected={filters.communities}
          onToggle={toggleCommunity}
        />
      </PopoverContent>
    </Popover>
  )
}
