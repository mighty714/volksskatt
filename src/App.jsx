import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import SignInPublic from './pages/jobs-user/SignInPublic'
import SignUpPublic from './pages/jobs-user/SignUpPublic'
import ForgotPasswordPublic from './pages/jobs-user/ForgotPasswordPublic'
import Home from './pages/hr/Home'
import Jobspost from './pages/jobs-user/Jobspost'
import JoinNetwork from './pages/jobs-user/JoinNetwork'
import CareersHome from './pages/CareersHome'
import Dashboard from './pages/hr/Dashboard'
import Clock from './pages/Clock'
import Attendance from './pages/hr/Attendance'
import Jobs from './pages/hr/Jobs'
import CandidateProfile from './pages/CandidateProfile'
import Interviews from './pages/hr/Interviews'
import Documents from './pages/hr/Documents'
import TalentNetworkSubmissions from './pages/hr/TalentNetworkSubmissions'
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
      <Route path="/signin" element={<SignInPublic />} />
      <Route path="/signup" element={<SignUpPublic />} />
      <Route path="/forgot-password" element={<ForgotPasswordPublic />} />
      <Route path="/join-network" element={<JoinNetwork />} />

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
        <Route path="talent-network" element={<TalentNetworkSubmissions />} />
        <Route path="offers" element={<Offers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

