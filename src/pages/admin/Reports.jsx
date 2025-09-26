import React from 'react'
import { FaDownload } from 'react-icons/fa'

export default function Reports() {
  const reports = [
    { id: 'r1', name: 'Attendance Summary (Monthly)', descr: 'Aggregate attendance metrics across all employees.' },
    { id: 'r2', name: 'Hiring Funnel', descr: 'Applied → Screened → Interviewed → Offered → Hired.' },
    { id: 'r3', name: 'Job Openings Snapshot', descr: 'Open vs Closed jobs, time to fill.' },
  ]

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
      </header>
      <ul className="space-y-3">
        {reports.map((r) => (
          <li key={r.id} className="border rounded p-4 flex items-center justify-between bg-white">
            <div>
              <div className="font-semibold text-slate-900">{r.name}</div>
              <div className="text-sm text-slate-600">{r.descr}</div>
            </div>
            <button className="w-10 h-10 grid place-items-center rounded-full bg-sky-600 text-white shadow hover:bg-sky-700" title="Download CSV" aria-label="Download CSV">
              <FaDownload className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
