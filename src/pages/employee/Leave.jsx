import React, { useEffect, useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'

const types = ['Annual', 'Sick', 'Casual', 'Unpaid']

export default function EmployeeLeave() {
  const [requests, setRequests] = useState(() => {
    try {
      const raw = localStorage.getItem('employee_leave_requests')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [form, setForm] = useState({ type: 'Annual', from: '', to: '', reason: '' })

  useEffect(() => {
    try { localStorage.setItem('employee_leave_requests', JSON.stringify(requests)) } catch {}
  }, [requests])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.from || !form.to) return alert('Please select From and To dates')
    const item = { id: Date.now(), ...form, status: 'Pending', createdAt: new Date().toISOString() }
    setRequests((prev) => [item, ...prev])
    setForm({ type: 'Annual', from: '', to: '', reason: '' })
  }

  const onDelete = (id) => setRequests((prev) => prev.filter((r) => r.id !== id))

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Request Leave</h2>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded border bg-white">
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">From</label>
          <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="w-full px-3 py-2 rounded border bg-white" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">To</label>
          <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="w-full px-3 py-2 rounded border bg-white" />
        </div>
        <div className="md:col-span-4">
          <label className="block text-xs text-slate-500 mb-1">Reason</label>
          <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 rounded border bg-white" placeholder="Optional" />
        </div>
        <div className="md:col-span-4 flex justify-end">
          <button type="submit" className="px-4 py-2 rounded-full bg-amber-400 text-slate-900 font-medium shadow hover:brightness-105 flex items-center gap-2"><FaPlus className="w-3 h-3" /> Submit</button>
        </div>
      </form>

      <h3 className="text-slate-900 font-semibold mb-2">My Requests</h3>
      <ul className="space-y-2">
        {requests.length ? requests.map((r) => (
          <li key={r.id} className="border rounded p-3 bg-white flex items-center justify-between">
            <div className="text-left">
              <div className="font-medium text-slate-900">{r.type} Leave</div>
              <div className="text-sm text-slate-600">{r.from} → {r.to}</div>
              {r.reason && <div className="text-xs text-slate-500 mt-1">{r.reason}</div>}
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs">{r.status}</span>
              <button onClick={() => onDelete(r.id)} className="w-8 h-8 grid place-items-center rounded-full bg-red-600 text-white shadow hover:bg-red-700" title="Delete" aria-label="Delete"><FaTrash className="w-3.5 h-3.5" /></button>
            </div>
          </li>
        )) : <div className="text-sm text-slate-500">No leave requests yet.</div>}
      </ul>
    </section>
  )
}
