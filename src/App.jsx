import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import EmployeeLayout from './components/EmployeeLayout'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import HRLogin from './pages/HRLogin'
import EmployeeLogin from './pages/EmployeeLogin'
import SignInPublic from './pages/jobs-user/SignInPublic'
import SignUpPublic from './pages/jobs-user/SignUpPublic'
import ForgotPasswordPublic from './pages/jobs-user/ForgotPasswordPublic'
import Home from './pages/hr/Home'
import Jobspost from './pages/jobs-user/Jobspost'
import JoinNetwork from './pages/jobs-user/JoinNetwork'
import CareersHome from './pages/CareersHome'
import Dashboard from './pages/hr/Dashboard'
import HRClock from './pages/hr/HrClock'
import Attendance from './pages/hr/Attendance'
import Jobs from './pages/hr/Jobs'
import CandidateProfile from './pages/CandidateProfile'
import Interviews from './pages/hr/Interviews'
import Documents from './pages/hr/Documents'
import TalentNetworkSubmissions from './pages/hr/TalentNetworkSubmissions'
import Offers from './pages/Offers'
import TeamReports from './pages/hr/TeamReports'
import AddEmployee from './pages/hr/AddEmployee'
import { isAuthenticated, getUser } from './services/auth'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminAttendance from './pages/admin/Attendance'
import AdminJobs from './pages/admin/Jobs'
import AdminInterviews from './pages/admin/Interviews'
import AdminDocuments from './pages/admin/Documents'
import AdminReports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'

// Employee pages
import EmpDashboard from './pages/employee/Dashboard'
import EmpClock from './pages/employee/ClockEmp'
import EmpAttendance from './pages/employee/Attendance'
import EmpDocuments from './pages/employee/Documents'
import EmpJobs from './pages/employee/Jobs'
import EmpLeave from './pages/employee/Leave'

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function HRRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  const user = getUser()
  const allowed = ['hr', 'team_lead', 'admin']
  if (!allowed.includes(user?.role)) {
    return <Navigate to="/employee/dashboard" replace />
  }
  return children
}

function AdminRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  const user = getUser()
  if (user?.role !== 'admin') {
    return <Navigate to="/employee/dashboard" replace />
  }
  return children
}

function EmployeeRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login-admin" element={<AdminLogin />} />
      <Route path="/login-hr" element={<HRLogin />} />
      <Route path="/login-employee" element={<EmployeeLogin />} />
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
          <HRRoute>
            <Layout />
          </HRRoute>
        }
      >
        <Route index element={<Navigate to="/app/clock" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clock" element={<HRClock />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="candidates/:id" element={<CandidateProfile />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="documents" element={<Documents />} />
        <Route path="talent-network" element={<TalentNetworkSubmissions />} />
        <Route path="offers" element={<Offers />} />
        <Route path="team-reports" element={<TeamReports />} />
        <Route path="add-employee" element={<AddEmployee />} />
      </Route>

      {/* Protected Admin under /admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="interviews" element={<AdminInterviews />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Protected Employee under /employee */}
      <Route
        path="/employee"
        element={
          <EmployeeRoute>
            <EmployeeLayout />
          </EmployeeRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmpDashboard />} />
        <Route path="clock" element={<EmpClock />} />
        <Route path="attendance" element={<EmpAttendance />} />
        <Route path="documents" element={<EmpDocuments />} />
        <Route path="jobs" element={<EmpJobs />} />
        <Route path="leave" element={<EmpLeave />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

