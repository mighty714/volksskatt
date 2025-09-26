import React, { useState } from 'react'

export default function Settings() {
  const [leavePolicy, setLeavePolicy] = useState({ annual: 20, sick: 10 })
  const [workHours, setWorkHours] = useState({ start: '09:30', end: '18:30' })
  const [saved, setSaved] = useState(false)

  const onSave = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem('admin_settings_leave', JSON.stringify(leavePolicy))
      localStorage.setItem('admin_settings_hours', JSON.stringify(workHours))
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Global Settings</h2>
        {saved && <span className="text-emerald-700 text-sm">✓ Saved</span>}
      </header>
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold text-slate-900 mb-3">Leave Policy</h3>
          <label className="block text-xs text-slate-500 mb-1">Annual Leaves</label>
          <input type="number" min={0} value={leavePolicy.annual} onChange={(e)=> setLeavePolicy({ ...leavePolicy, annual: Number(e.target.value)})} className="w-full px-3 py-2 rounded border bg-white" />
          <label className="block text-xs text-slate-500 mt-3 mb-1">Sick Leaves</label>
          <input type="number" min={0} value={leavePolicy.sick} onChange={(e)=> setLeavePolicy({ ...leavePolicy, sick: Number(e.target.value)})} className="w-full px-3 py-2 rounded border bg-white" />
        </div>
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold text-slate-900 mb-3">Work Hours</h3>
          <label className="block text-xs text-slate-500 mb-1">Start Time</label>
          <input type="time" value={workHours.start} onChange={(e)=> setWorkHours({ ...workHours, start: e.target.value })} className="w-full px-3 py-2 rounded border bg-white" />
          <label className="block text-xs text-slate-500 mt-3 mb-1">End Time</label>
          <input type="time" value={workHours.end} onChange={(e)=> setWorkHours({ ...workHours, end: e.target.value })} className="w-full px-3 py-2 rounded border bg-white" />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="px-4 py-2 rounded-full bg-amber-400 text-slate-900 font-medium shadow hover:brightness-105">Save</button>
        </div>
      </form>
    </section>
  )
}
