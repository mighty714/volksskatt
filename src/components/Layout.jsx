import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout, getUser } from '../services/auth'

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition border ${
        isActive
          ? 'bg-white text-slate-900 border-white/60 shadow'
          : 'text-white/85 hover:bg-white/10 border-white/10'
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
    <div className="min-h-screen relative grid grid-cols-[260px,1fr] text-white">
      {/* Dashboard background: decent colors (no image) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-800" />
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-10 -right-16 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
      </div>
      {/* Sidebar */}
      <aside className="bg-white/10 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col text-white">
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" alt="volksskatt logo" className="w-8 h-8 object-contain" />
          <div className="font-semibold">volksskatt</div>
        </div>
        <nav className="space-y-1">
          <NavItem to="/app/dashboard" label="Dashboard" icon="🏠" />
          <NavItem to="/app/clock" label="Clock" icon="⏱️" />
          <NavItem to="/app/attendance" label="Attendance" icon="📋" />
          <NavItem to="/app/jobs" label="Jobs" icon="💼" />
          <NavItem to="/app/interviews" label="Interviews" icon="🗓️" />
          <NavItem to="/app/documents" label="Documents" icon="📄" />
          <NavItem to="/app/offers" label="Offers" icon="🎯" />
          {/* Plain anchor ensures navigation out of /app to the public home contact section */}
          <a
            href="/#contact"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition border text-white/85 hover:bg-white/10 border-white/10"
          >
            <span className="text-lg">📞</span>
            Contact Us
          </a>
        </nav>
        <div className="mt-auto pt-6 text-xs text-white/70">
          &copy; {new Date().getFullYear()} Demo
        </div>
      </aside>

      {/* Main area */}
      <div className="grid grid-rows-[auto,1fr]">
        {/* Topbar */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/10 text-white">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="text-sm flex items-center gap-2">
              <img src="/logo.png" alt="volksskatt logo" className="w-6 h-6 object-contain" />
              <span>Admin / User Management</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur border border-white/10 hover:bg-white/25">Upgrade</button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/80 grid place-items-center text-slate-700">👤</div>
                <span className="text-sm">{user?.fullName || 'User'}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded bg-white/15 text-white text-sm border border-white/10 hover:bg-white/25"
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

