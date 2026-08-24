import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './components/AppShell'
import { AdminReviewPage } from './routes/AdminReviewPage'
import { JobDetailPage } from './routes/JobDetailPage'
import { JobsPage } from './routes/JobsPage'
import { SubmitJobPage } from './routes/SubmitJobPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate replace to="/jobs" />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:slug" element={<JobDetailPage />} />
        <Route path="submit" element={<SubmitJobPage />} />
        <Route path="admin/review" element={<AdminReviewPage />} />
        <Route path="*" element={<Navigate replace to="/jobs" />} />
      </Route>
    </Routes>
  )
}
