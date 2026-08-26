"use client"

import { useState } from "react"
import { CheckCircle2, MapPin } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { BonusBadge } from "@/components/referrer/bonus-badge"
import { remoteLabels, type Job } from "@/lib/jobs"

type Mode = "details" | "form" | "success"

function JobSummary({ job }: { job: Job }) {
  return (
    <div className="flex items-start gap-3">
      <Avatar size="lg">
        <AvatarFallback>{job.companyInitials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-base font-medium text-foreground">{job.title}</p>
        <p className="text-sm text-muted-foreground">{job.company}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline">{job.department}</Badge>
          <Badge variant="secondary">{remoteLabels[job.remote]}</Badge>
          <Badge variant="outline" className="gap-1">
            <MapPin className="size-3" />
            {job.location}
          </Badge>
        </div>
      </div>
    </div>
  )
}

function JobDetails({
  job,
  onRefer,
}: {
  job: Job
  onRefer: () => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <JobSummary job={job} />

      <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">
          Deine Empfehlungsprämie
        </span>
        <BonusBadge amount={job.bonus} size="lg" />
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-foreground">Über die Rolle</h3>
        <p className="text-sm text-muted-foreground">{job.about}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-foreground">Anforderungen</h3>
        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          {job.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-foreground">Benefits</h3>
        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          {job.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>

      <Button onClick={onRefer} className="mt-1 w-full sm:w-auto">
        Person empfehlen
      </Button>
    </div>
  )
}

function ReferForm({
  job,
  onBack,
  onSubmit,
}: {
  job: Job
  onBack: () => void
  onSubmit: () => void
}) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <JobSummary job={job} />
      <Separator />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="referral-name">Name</Label>
        <Input id="referral-name" placeholder="Vor- und Nachname" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="referral-email">E-Mail</Label>
        <Input
          id="referral-email"
          type="email"
          placeholder="name@beispiel.de"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="referral-linkedin">
          LinkedIn-Profil{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input id="referral-linkedin" placeholder="linkedin.com/in/..." />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="referral-message">
          Nachricht <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="referral-message"
          placeholder="Warum passt diese Person gut zur Rolle?"
          rows={3}
        />
      </div>

      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button type="submit">Empfehlung senden</Button>
      </div>
    </form>
  )
}

function ReferSuccess({ job }: { job: Job }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <CheckCircle2 className="size-10 text-foreground" />
      <p className="text-base font-medium text-foreground">
        Empfehlung gesendet
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        {job.company} wird sich bei einem Match zeitnah zurückmelden. Du
        erhältst {new Intl.NumberFormat("de-DE").format(job.bonus)} € sobald
        die Einstellung erfolgt ist.
      </p>
    </div>
  )
}

export function JobDetailModal({
  job,
  initialMode = "details",
  onOpenChange,
  onReferred,
}: {
  job: Job | null
  initialMode?: "details" | "form"
  onOpenChange: (open: boolean) => void
  onReferred?: (job: Job) => void
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [mode, setMode] = useState<Mode>(initialMode)
  const [openJobId, setOpenJobId] = useState<string | null>(null)

  if (job && job.id !== openJobId) {
    setOpenJobId(job.id)
    setMode(initialMode)
  }

  if (!job) {
    if (openJobId !== null) setOpenJobId(null)
    return null
  }

  const body =
    mode === "details" ? (
      <JobDetails job={job} onRefer={() => setMode("form")} />
    ) : mode === "form" ? (
      <ReferForm
        job={job}
        onBack={() => setMode("details")}
        onSubmit={() => {
          setMode("success")
          onReferred?.(job)
        }}
      />
    ) : (
      <ReferSuccess job={job} />
    )

  const titleText =
    mode === "form"
      ? `${job.title} empfehlen`
      : mode === "success"
        ? "Empfehlung gesendet"
        : job.title

  if (isDesktop) {
    return (
      <Dialog open={!!job} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] w-full max-w-lg overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">{titleText}</DialogTitle>
            <DialogDescription className="sr-only">
              Details zur offenen Position bei {job.company}
            </DialogDescription>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={!!job} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">{titleText}</SheetTitle>
          <SheetDescription className="sr-only">
            Details zur offenen Position bei {job.company}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">{body}</div>
      </SheetContent>
    </Sheet>
  )
}
