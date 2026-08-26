import { ListFilter } from 'lucide-react'

import { Badge } from '../../../components/ui/Badge'
import { Checkbox } from '../../../components/ui/Checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/Popover'
import { cn } from '../../../lib/utils'
import { formatRemotePolicy, remotePolicyOptions } from '../format'
import type { JobFilterOptions, JobFilterState } from '../filters'
import type { RemotePolicy } from '../model'

export interface JobFiltersProps {
  state: JobFilterState
  options: JobFilterOptions
  onChange: (next: JobFilterState) => void
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
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-muted"
          >
            <Checkbox checked={selected.includes(option.value)} onCheckedChange={() => onToggle(option.value)} />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}

export function JobFilters({ state, options, onChange }: JobFiltersProps) {
  const activeCount = state.functionAreas.length + state.remotePolicies.length + state.communities.length

  function toggleFunctionArea(value: string) {
    const next = state.functionAreas.includes(value)
      ? state.functionAreas.filter((area) => area !== value)
      : [...state.functionAreas, value]
    onChange({ ...state, functionAreas: next })
  }

  function toggleRemotePolicy(value: string) {
    const policy = value as RemotePolicy
    const next = state.remotePolicies.includes(policy)
      ? state.remotePolicies.filter((existing) => existing !== policy)
      : [...state.remotePolicies, policy]
    onChange({ ...state, remotePolicies: next })
  }

  function toggleCommunity(value: string) {
    const next = state.communities.includes(value)
      ? state.communities.filter((community) => community !== value)
      : [...state.communities, value]
    onChange({ ...state, communities: next })
  }

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'flex h-10 shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted',
        )}
      >
        <ListFilter className="size-4 text-muted-foreground" aria-hidden="true" />
        Filter
        {activeCount > 0 && (
          <Badge variant="solid" className="h-5 min-w-5 justify-center px-1 text-[11px]">
            {activeCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <div className="flex items-center justify-between px-2 py-1">
          <p className="text-sm font-semibold text-foreground">Filter</p>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() =>
                onChange({ ...state, functionAreas: [], remotePolicies: [], communities: [] })
              }
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
        <hr className="my-1 border-border" />
        <FilterGroup
          label="Function"
          options={options.functionAreas.map((area) => ({ value: area, label: area }))}
          selected={state.functionAreas}
          onToggle={toggleFunctionArea}
        />
        <hr className="my-1 border-border" />
        <FilterGroup
          label="Remote policy"
          options={remotePolicyOptions.map((policy) => ({ value: policy, label: formatRemotePolicy(policy) }))}
          selected={state.remotePolicies}
          onToggle={toggleRemotePolicy}
        />
        <hr className="my-1 border-border" />
        <FilterGroup
          label="Community"
          options={options.communities.map((community) => ({ value: community, label: community }))}
          selected={state.communities}
          onToggle={toggleCommunity}
        />
      </PopoverContent>
    </Popover>
  )
}
