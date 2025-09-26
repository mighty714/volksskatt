import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Dashboard() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">HR Dashboard</h2>
      <p className="text-slate-600 text-sm mb-4">The System Users form has been moved.</p>
      <div className="flex items-center gap-3">
        <NavLink
          to="/app/add-employee"
          className="px-4 py-2 rounded-full bg-sky-600 text-white text-sm shadow hover:bg-sky-700"
        >
          Go to Add New Employee
        </NavLink>
      </div>
    </section>
  )
}
