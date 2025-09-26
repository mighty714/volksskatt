import React, { useMemo } from 'react'
import { useClock } from '../utils/useClock'
import { getUser } from '../../services/auth'
import { getRandomQuote } from '../utils/quotes'
import { FaPlay, FaStop, FaHamburger, FaFileCsv } from 'react-icons/fa'

export default function ClockEmp() {
  const user = getUser()
  const defaultEmp = useMemo(() => ({
    empId: user?.email || 'emp-user',
    empName: user?.fullName || 'Employee',
    empRole: user?.role || 'employee'
  }), [user])

  const { rows, status, actions } = useClock({
    storageKey: 'attendance_emp',
    defaultEmp,
  })

  const quote = useMemo(() => getRandomQuote(), [])

  const badge = status === 'Logged Out'
    ? 'bg-gray-100 text-gray-700'
    : status === 'On Lunch'
      ? 'bg-sky-100 text-sky-700'
      : status === 'Active'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-gray-100 text-gray-700'

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Clock</h2>
          <p className="text-sm text-gray-600 mt-1">{quote}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge}`}>{status}</span>
          <button onClick={actions.exportCsv} className="w-10 h-10 grid place-items-center rounded-full bg-blue-700 text-white shadow hover:bg-blue-800" title="Export CSV" aria-label="Export CSV">
            <FaFileCsv className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={actions.clockIn} className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2" aria-label="Clock In">
          <FaPlay className="w-4 h-4" /> Clock In
        </button>
        <button onClick={actions.startLunch} className="px-3 py-2 rounded bg-sky-600 text-white hover:bg-sky-700 flex items-center gap-2" aria-label="Start Lunch">
          <FaHamburger className="w-4 h-4" /> Start Lunch
        </button>
        <button onClick={actions.endLunch} className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2" aria-label="End Lunch">
          <FaHamburger className="w-4 h-4" /> End Lunch
        </button>
        <button onClick={actions.clockOut} className="px-3 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-2" aria-label="Clock Out">
          <FaStop className="w-4 h-4" /> Clock Out
        </button>
      </div>

      <div className="overflow-x-auto max-h-[420px] overflow-y-auto rounded-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-sky-50 text-left text-slate-700 border-b border-sky-100">
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Date</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Clock In</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Lunch Start</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Lunch End</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Clock Out</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Hours</th>
              <th className="p-3 font-medium text-center sticky top-0 bg-sky-50">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((r) => {
                const badgeRow = r.status === 'Logged Out'
                  ? 'bg-green-100 text-green-700'
                  : r.status === 'On Lunch'
                    ? 'bg-sky-100 text-sky-700'
                    : r.status === 'Active'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                return (
                  <tr key={r.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 text-black">{r.date}</td>
                    <td className="p-3 text-black">{r.in || '-'}</td>
                    <td className="p-3 text-black">{r.lunchStart || '-'}</td>
                    <td className="p-3 text-black">{r.lunchEnd || '-'}</td>
                    <td className="p-3 text-black">{r.out || '-'}</td>
                    <td className="p-3 text-black">{r.hours || '-'}</td>
                    <td className="p-3 text-center"><span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${badgeRow}`}>{r.status || '-'}</span></td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">No attendance records yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
