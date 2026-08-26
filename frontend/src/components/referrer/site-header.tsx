import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          HiddenChamp
        </span>
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">MF</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
