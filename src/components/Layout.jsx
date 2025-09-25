import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout, getUser } from '../services/auth'
import { useState } from 'react'

const NavItem = ({ to, label, icon, collapsed }) => (
  <div className="relative group">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-2 rounded-xl text-sm font-medium transition border ${
          isActive
            ? 'bg-black text-white border-white/60 shadow'
            : 'text-white/85 hover:bg-white/10 border-white/10'
        }`
      }
    >
      <span className="text-lg transition-transform duration-200 ease-out group-hover:scale-150">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
    {collapsed && (
      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div className="px-3 py-1 rounded-lg bg-white text-slate-900 text-xs shadow-lg border border-slate-200 whitespace-nowrap">
          {label}
        </div>
      </div>
    )}
  </div>
)

export default function Layout() {
  const navigate = useNavigate()
  const user = getUser()
  // pinned: user explicitly expands/collapses; no hover-driven expand
  const [pinned, setPinned] = useState(false)
  const expanded = pinned

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div
      data-sidebar={expanded ? 'expanded' : 'collapsed'}
      className={`min-h-screen relative grid ${expanded ? 'grid-cols-[260px,1fr]' : 'grid-cols-[80px,1fr]'} text-white`}
    >
      {/* App-wide background */}
      <div className="absolute inset-0 -z-10 screensaver" />
      {/* Sidebar */}
      <aside
        className="relative z-20 overflow-visible bg-white/10 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col text-white"
      >
        <div className={`flex items-center ${expanded ? 'gap-2 justify-start' : 'justify-center'} mb-6`}>
          <img src="/logo.png" alt="volksskatt logo" className="w-8 h-8 object-contain" />
          {expanded && <div className="font-semibold">volksskatt</div>}
        </div>
        <nav className="space-y-3">
          <NavItem to="/app/dashboard" label="Dashboard" icon="🏠" collapsed={!expanded} />
          <NavItem to="/app/clock" label="Clock" icon="⏱️" collapsed={!expanded} />
          <NavItem to="/app/attendance" label="Attendance" icon="📋" collapsed={!expanded} />
          <NavItem to="/app/jobs" label="Jobs" icon="💼" collapsed={!expanded} />
          <NavItem to="/app/interviews" label="Interviews" icon="🗓️" collapsed={!expanded} />
          <NavItem to="/app/documents" label="Documents" icon="📄" collapsed={!expanded} />
          <NavItem to="/app/talent-network" label="Talent Network" icon="🧑‍💻" collapsed={!expanded} />
          {/*<NavItem to="/app/offers" label="Offers" icon="🎯" collapsed={!expanded} />*/}
          {/* Plain anchor ensures navigation out of /app to the public home contact section */}
         {/* <div className="relative group">
            <a
              href="/#contact"
              className={`flex items-center ${expanded ? 'gap-3' : 'justify-center'} px-4 py-2 rounded-xl text-sm font-medium transition border text-white/85 hover:bg-white/10 border-white/10`}
            >
              <span className="text-lg transition-transform duration-200 ease-out group-hover:scale-150">📞</span>
              {expanded && <span>Contact Us</span>}
            </a>
            {!expanded && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-3 py-1 rounded-lg bg-white text-slate-900 text-xs shadow-lg border border-slate-200 whitespace-nowrap">
                  Contact Us
                </div>
              </div>
            )}
          </div>*/}
        </nav>
        <div className={`mt-auto pt-6 text-xs text-white/70 ${expanded ? '' : 'text-center'}`}>
          
        </div>
        <div className={`${expanded ? '' : 'text-center'} pt-3`}>
          <button
            onClick={() => setPinned((v) => !v)}
            className="mx-auto rounded-full bg-white/10 border border-white/10 w-8 h-8 grid place-items-center text-sm hover:bg-white/20 transition"
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <span className="select-none">{expanded ? '◀' : '▶'}</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="grid grid-rows-[auto,1fr]">
        {/* Topbar */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/10 text-white">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="text-sm flex items-center gap-2">

              <span>Human Resource</span>
            </div>
            <div className="flex items-center gap-4">
              
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

