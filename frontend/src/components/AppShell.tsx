import { NavLink, Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/jobs">Community Referral</NavLink>
        <nav aria-label="Primary navigation">
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/submit">Submit a job</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  )
}
