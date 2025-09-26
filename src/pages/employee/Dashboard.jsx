import React, { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getUser } from '../../services/auth'

function parseHours(hhmm) {
  if (!hhmm || typeof hhmm !== 'string' || !hhmm.includes(':')) return 0
  const [h, m] = hhmm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export default function EmployeeDashboard() {
  const user = getUser()
  const [rows, setRows] = useState([])

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('attendanceRows') || '[]')
      setRows(Array.isArray(data) ? data : [])
    } catch {
      setRows([])
    }
  }, [])

  const myRows = useMemo(() => {
    if (!user?.fullName) return []
    return rows.filter(r => (r.empName || '').toLowerCase() === user.fullName.toLowerCase())
  }, [rows, user])

  const totalMinutes = myRows.reduce((sum, r) => sum + parseHours(r.hours), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalMins = totalMinutes % 60
  const avgMinutes = myRows.length ? Math.floor(totalMinutes / myRows.length) : 0
  const avgHours = Math.floor(avgMinutes / 60)
  const avgMins = avgMinutes % 60

  const cards = [
    { to: '/employee/clock', title: 'Clock', descr: 'Clock In / Out and Lunch', icon: '⏱️' },
    { to: '/employee/attendance', title: 'Attendance', descr: 'Your attendance history', icon: '📋' },
    { to: '/employee/documents', title: 'My Documents', descr: 'Payslips, letters, etc.', icon: '📄' },
    { to: '/employee/jobs', title: 'My Jobs', descr: 'Apply / Track applications', icon: '💼' },
    { to: '/employee/leave', title: 'Leave', descr: 'Request time off', icon: '🛫' },
  ]

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Employee Dashboard</h2>
          <div className="text-sm text-slate-600">Welcome, {user?.fullName || 'Employee'}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {cards.map((c) => (
            <NavLink key={c.to} to={c.to} className="block rounded-xl border bg-white hover:bg-slate-50 transition shadow-sm">
              <div className="p-5">
                <div className="text-3xl">{c.icon}</div>
                <div className="mt-2 text-slate-900 font-semibold">{c.title}</div>
                <div className="text-slate-600 text-sm">{c.descr}</div>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <h3 className="text-slate-800 font-semibold mb-3">My Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border p-4 bg-white text-center">
            <div className="text-slate-500 text-xs">Total Hours</div>
            <div className="text-2xl font-semibold text-slate-900">{totalHours}:{String(totalMins).padStart(2,'0')}</div>
          </div>
          <div className="rounded-xl border p-4 bg-white text-center">
            <div className="text-slate-500 text-xs">Days Worked</div>
            <div className="text-2xl font-semibold text-slate-900">{myRows.length}</div>
          </div>
          <div className="rounded-xl border p-4 bg-white text-center">
            <div className="text-slate-500 text-xs">Average / Day</div>
            <div className="text-2xl font-semibold text-slate-900">{avgHours}:{String(avgMins).padStart(2,'0')}</div>
          </div>
        </div>
      </section>
    </div>
  )
}
