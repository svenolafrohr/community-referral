import { NavLink, Outlet } from 'react-router-dom'

import { cn } from '../lib/utils'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return cn(
    'text-sm font-medium transition-colors',
    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
  )
}

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <NavLink to="/jobs" className="text-sm font-semibold tracking-tight text-foreground">
            Community Referral
          </NavLink>
          <nav aria-label="Primary navigation" className="flex items-center gap-5">
            <NavLink to="/jobs" className={navLinkClassName}>
              Jobs
            </NavLink>
            <NavLink to="/submit" className={navLinkClassName}>
              Submit a job
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
