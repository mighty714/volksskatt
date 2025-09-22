import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout, getUser } from '../services/auth'

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${
        isActive
          ? 'bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-900 shadow'
          : 'text-slate-600 hover:bg-slate-100'
      }`
    }
  >
    <span className="text-lg">
      {icon}
    </span>
    {label}
  </NavLink>
)

export default function Layout() {
  const navigate = useNavigate()
  const user = getUser()

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-[260px,1fr]">
      {/* Sidebar */}
      <aside className="bg-white border-r p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-emerald-400 grid place-items-center text-white font-bold">O</div>
          <div className="font-semibold">OrangeHRM-like</div>
        </div>
        <nav className="space-y-1">
          <NavItem to="/dashboard" label="Dashboard" icon="🏠" />
          <NavItem to="/clock" label="Clock" icon="⏱️" />
          <NavItem to="/attendance" label="Attendance" icon="📋" />
          <NavItem to="/jobs" label="Jobs" icon="💼" />
          <NavItem to="/interviews" label="Interviews" icon="🗓️" />
          <NavItem to="/documents" label="Documents" icon="📄" />
          <NavItem to="/offers" label="Offers" icon="🎯" />
        </nav>
        <div className="mt-auto pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} Demo
        </div>
      </aside>

      {/* Main area */}
      <div className="grid grid-rows-[auto,1fr]">
        {/* Topbar */}
        <header className="bg-gradient-to-r from-sky-600 via-emerald-500 to-lime-400 text-white">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="text-sm">Admin / User Management</div>
            <div className="flex items-center gap-4">
              <button className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur hover:bg-white/30">Upgrade</button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/80 grid place-items-center text-slate-700">👤</div>
                <span className="text-sm">{user?.fullName || 'User'}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded bg-black/20 text-white text-sm hover:bg-black/30"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

