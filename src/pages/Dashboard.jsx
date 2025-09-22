import React from 'react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top filter card like System Users search */}
      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">System Users</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Username</label>
            <input className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-200 focus:outline-none" placeholder="" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">User Role</label>
            <select className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-emerald-200 focus:outline-none">
              <option>-- Select --</option>
              <option>Admin</option>
              <option>ESS</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Employee Name</label>
            <input className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-200 focus:outline-none" placeholder="Type for hints..." />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Status</label>
            <select className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-emerald-200 focus:outline-none">
              <option>-- Select --</option>
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 justify-end">
          <button className="px-4 py-2 rounded-full border text-slate-700 hover:bg-slate-50">Reset</button>
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-lime-400 to-amber-400 text-slate-900 font-medium shadow hover:brightness-105">Search</button>
        </div>
      </section>

      {/* Add button + table card */}
      <section className="bg-white rounded-2xl shadow-sm border">
        <div className="p-4 md:p-6">
          <button className="px-4 py-2 rounded-full bg-amber-400 text-slate-900 font-medium shadow hover:brightness-105">+ Add</button>
          <p className="text-slate-500 text-sm mt-4">(9) Records Found</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm">
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">User Role</th>
                <th className="px-6 py-3">Employee Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { u: 'Admin', r: 'Admin', e: 'manda user', s: 'Enabled' },
                { u: 'chyrine', r: 'ESS', e: 'chyrine souid', s: 'Disabled' },
                { u: 'lubna', r: 'ESS', e: 'Joseph Evans', s: 'Disabled' },
                { u: 'ShazuuuKhan', r: 'Admin', e: 'Shazuuu Khan', s: 'Enabled' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-3">{row.u}</td>
                  <td className="px-6 py-3">{row.r}</td>
                  <td className="px-6 py-3">{row.e}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.s === 'Enabled' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{row.s}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3 text-slate-500">
                      <button title="Edit" className="hover:text-slate-800">✏️</button>
                      <button title="View" className="hover:text-slate-800">👁️</button>
                      <button title="Delete" className="hover:text-slate-800">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
