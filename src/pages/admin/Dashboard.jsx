import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Dashboard() {
  const cards = [
    { to: '/admin/users', title: 'User Management', descr: 'Manage HR users & Employees. Assign roles.' , icon: '👥' },
    { to: '/admin/attendance', title: 'Attendance Overview', descr: 'View and export attendance across org.' , icon: '📋' },
    { to: '/admin/jobs', title: 'Job & Interview Mgmt', descr: 'CRUD for Jobs and Interviews.' , icon: '💼' },
    { to: '/admin/documents', title: 'Documents', descr: 'Manage documents across the org.' , icon: '📄' },
    { to: '/admin/reports', title: 'Reports & Analytics', descr: 'Org-wide reports and analytics.' , icon: '📊' },
    { to: '/admin/settings', title: 'Global Settings', descr: 'Leave policy, work hours & more.' , icon: '⚙️' },
  ]

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Admin Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <NavLink key={c.to} to={c.to} className="block group rounded-xl border bg-white hover:bg-slate-50 transition shadow-sm">
              <div className="p-5">
                <div className="text-3xl">{c.icon}</div>
                <div className="mt-2 text-slate-900 font-semibold">{c.title}</div>
                <div className="text-slate-600 text-sm">{c.descr}</div>
                <div className="mt-3 text-sky-700 text-sm">Go to {c.title} →</div>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <h3 className="text-slate-800 font-semibold mb-2">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{k:'HR Users',v:4},{k:'Employees',v:124},{k:'Open Jobs',v:7},{k:'Interviews (wk)',v:12}].map((s)=> (
            <div key={s.k} className="rounded-xl border p-4 bg-white">
              <div className="text-slate-500 text-xs">{s.k}</div>
              <div className="text-xl font-semibold text-slate-900">{s.v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
