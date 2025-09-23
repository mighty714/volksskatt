import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Jobspost from './pages/Jobspost'
import CareersHome from './pages/CareersHome'
import Dashboard from './pages/Dashboard'
import Clock from './pages/Clock'
import Attendance from './pages/Attendance'
import Jobs from './pages/Jobs'
import CandidateProfile from './pages/CandidateProfile'
import Interviews from './pages/Interviews'
import Documents from './pages/Documents'
import Offers from './pages/Offers'
import { isAuthenticated } from './services/auth'

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Public Home */}
      <Route path="/" element={<Home />} />
      <Route path="/jobspost" element={<Jobspost />} />
      <Route path="/careers" element={<CareersHome />} />

      {/* Protected App under /app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/clock" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clock" element={<Clock />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="candidates/:id" element={<CandidateProfile />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="documents" element={<Documents />} />
        <Route path="offers" element={<Offers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

