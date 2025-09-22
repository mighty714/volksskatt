import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Clock from './pages/Clock'
import Attendance from './pages/Attendance'
import Jobs from './pages/Jobs'
import CandidateProfile from './pages/CandidateProfile'
import Interviews from './pages/Interviews'
import Documents from './pages/Documents'
import Offers from './pages/Offers'
import { isAuthenticated } from './services/auth'
import Dashboard from './pages/Dashboard'

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

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
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

