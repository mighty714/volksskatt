import React, { useMemo } from 'react'

export default function TeamReports() {
  // Placeholder data: in a real app, fetch team-only stats from API/store
  const stats = useMemo(() => ([
    { k: 'Team Members', v: 8 },
    { k: 'Present Today', v: 7 },
    { k: 'On Leave', v: 1 },
    { k: 'Avg Hours (30d)', v: '7:42' },
  ]), [])

  const recent = useMemo(() => ([
    { id: 1, name: 'Alice', date: '24/09/2025', status: 'Present', hours: '8:10' },
    { id: 2, name: 'Bob', date: '24/09/2025', status: 'Leave', hours: '-' },
    { id: 3, name: 'Chen', date: '24/09/2025', status: 'Present', hours: '7:55' },
  ]), [])

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Team Reports</h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.k} className="rounded-xl border p-4 bg-white text-center">
            <div className="text-slate-500 text-xs">{s.k}</div>
            <div className="text-2xl font-semibold text-slate-900">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-4 bg-white">
        <h3 className="font-semibold text-slate-900 mb-3">Recent Attendance (Team)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-sky-50 text-left text-slate-700 border-b border-sky-100">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Hours</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 text-black">{r.name}</td>
                  <td className="p-3 text-black">{r.date}</td>
                  <td className="p-3 text-black">{r.status}</td>
                  <td className="p-3 text-black">{r.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
