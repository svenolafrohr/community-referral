"use client"

import { useMemo, useState } from "react"

import { SiteHeader } from "@/components/referrer/site-header"
import { SearchBar } from "@/components/referrer/search-bar"
import { JobFilters, type JobFiltersState } from "@/components/referrer/job-filters"
import { ViewToggle, type ViewMode } from "@/components/referrer/view-toggle"
import { JobList } from "@/components/referrer/job-list"
import { JobCardGrid } from "@/components/referrer/job-card-grid"
import { JobStack } from "@/components/referrer/job-stack"
import { JobDetailModal } from "@/components/referrer/job-detail-modal"
import { jobs, type Job } from "@/lib/jobs"

export default function ReferrerJobsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("stack")
  const [filters, setFilters] = useState<JobFiltersState>({
    search: "",
    departments: [],
    remote: [],
  })
  // Shared links (?job=<id>) open straight into that position's details.
  const [selectedJob, setSelectedJob] = useState<Job | null>(() => {
    if (typeof window === "undefined") return null
    const sharedId = new URLSearchParams(window.location.search).get("job")
    return jobs.find((job) => job.id === sharedId) ?? null
  })

  const filteredJobs = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search)
      const matchesDepartment =
        filters.departments.length === 0 ||
        filters.departments.includes(job.department)
      const matchesRemote =
        filters.remote.length === 0 || filters.remote.includes(job.remote)
      return matchesSearch && matchesDepartment && matchesRemote
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Offene Positionen
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Empfiehl jemanden aus deinem Netzwerk und sichere dir eine Prämie.
          </p>
        </div>

        <SearchBar
          value={filters.search}
          onChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        />

        <div className="mt-6 mb-8 flex items-center justify-between">
          <JobFilters filters={filters} onChange={setFilters} />
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>

        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              Keine Positionen gefunden
            </p>
            <p className="text-sm text-muted-foreground">
              Versuch es mit anderen Filtern oder einem anderen Suchbegriff.
            </p>
          </div>
        ) : viewMode === "list" ? (
          <JobList jobs={filteredJobs} onSelect={setSelectedJob} />
        ) : viewMode === "grid" ? (
          <JobCardGrid jobs={filteredJobs} onSelect={setSelectedJob} />
        ) : (
          <JobStack jobs={filteredJobs} />
        )}
      </main>

      <JobDetailModal
        job={selectedJob}
        initialMode="details"
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null)
        }}
      />
    </div>
  )
}
