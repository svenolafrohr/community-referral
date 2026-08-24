import { Select } from '../../../components/ui/Select'
import { formatRemotePolicy, remotePolicyOptions } from '../format'
import { ALL_VALUE, type JobFilterOptions, type JobFilterState } from '../filters'

export interface JobFiltersProps {
  state: JobFilterState
  options: JobFilterOptions
  onChange: (next: JobFilterState) => void
}

export function JobFilters({ state, options, onChange }: JobFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        label="Function"
        value={state.functionArea}
        onChange={(event) => onChange({ ...state, functionArea: event.target.value })}
      >
        <option value={ALL_VALUE}>All functions</option>
        {options.functionAreas.map((functionArea) => (
          <option key={functionArea} value={functionArea}>
            {functionArea}
          </option>
        ))}
      </Select>

      <Select
        label="Remote policy"
        value={state.remotePolicy}
        onChange={(event) =>
          onChange({ ...state, remotePolicy: event.target.value as JobFilterState['remotePolicy'] })
        }
      >
        <option value={ALL_VALUE}>All locations</option>
        {remotePolicyOptions.map((policy) => (
          <option key={policy} value={policy}>
            {formatRemotePolicy(policy)}
          </option>
        ))}
      </Select>

      <Select
        label="Community"
        value={state.community}
        onChange={(event) => onChange({ ...state, community: event.target.value })}
      >
        <option value={ALL_VALUE}>All communities</option>
        {options.communities.map((community) => (
          <option key={community} value={community}>
            {community}
          </option>
        ))}
      </Select>

      <Select
        label="Sort by"
        value={state.sort}
        onChange={(event) => onChange({ ...state, sort: event.target.value as JobFilterState['sort'] })}
      >
        <option value="recent">Most recent</option>
        <option value="bonus">Highest bonus</option>
      </Select>
    </div>
  )
}
