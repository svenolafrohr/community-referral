"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { JobDetails } from "@/components/referrer/job-details"
import type { Job } from "@/lib/jobs"

export function JobDetailModal({
  job,
  onOpenChange,
}: {
  job: Job | null
  onOpenChange: (open: boolean) => void
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  if (!job) return null

  if (isDesktop) {
    return (
      <Dialog open={!!job} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] w-full max-w-lg overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">{job.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Details zur offenen Position bei {job.company.name}
            </DialogDescription>
          </DialogHeader>
          <JobDetails job={job} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={!!job} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="sr-only">{job.title}</SheetTitle>
          <SheetDescription className="sr-only">
            Details zur offenen Position bei {job.company.name}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <JobDetails job={job} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
