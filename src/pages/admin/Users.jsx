import { useMemo, useState } from 'react'
import { FaSearch, FaFilter, FaUserShield, FaUser, FaEdit, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa'

// Simple in-memory seed for HR users and Employees
const seedUsers = [
  { id: 'u1', type: 'HR', username: 'admin', fullName: 'Platform Admin', role: 'Super Admin', status: 'Enabled' },
  { id: 'u2', type: 'HR', username: 'hr.jane', fullName: 'Jane HR', role: 'HR', status: 'Enabled' },
  { id: 'u3', type: 'HR', username: 'hr.john', fullName: 'John HR', role: 'HR', status: 'Disabled' },
  { id: 'e1', type: 'Employee', username: 'emp.ravi', fullName: 'Ravi Kumar', role: 'ESS', status: 'Enabled' },
  { id: 'e2', type: 'Employee', username: 'emp.meera', fullName: 'Meera Sen', role: 'ESS', status: 'Enabled' },
]

export default function Users() {
  const [rows, setRows] = useState(() => {
    try {
      const raw = localStorage.getItem('admin_users')
      return raw ? JSON.parse(raw) : seedUsers
    } catch {
      return seedUsers
    }
  })
  const [expanded, setExpanded] = useState({ HR: true, Employee: true })
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all') // all | HR | ESS | Super Admin
  const [statusFilter, setStatusFilter] = useState('all') // all | Enabled | Disabled

  const promote = (id) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, role: r.role === 'ESS' ? 'HR' : r.role === 'HR' ? 'Super Admin' : 'Super Admin' } : r))
  }

  const demote = (id) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, role: r.role === 'Super Admin' ? 'HR' : r.role === 'HR' ? 'ESS' : 'ESS' } : r))
  }

  const toggleStatus = (id) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === 'Enabled' ? 'Disabled' : 'Enabled' } : r))
  }

  const onDelete = (id) => {
    if (!confirm('Delete this user?')) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  // Persist changes
  useMemo(() => {
    try { localStorage.setItem('admin_users', JSON.stringify(rows)) } catch {}
  }, [rows])

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase()
    const qOk = !q || [r.username, r.fullName, r.type, r.role, r.status].some(v => String(v).toLowerCase().includes(q))
    const roleOk = roleFilter === 'all' || r.role === roleFilter
    const statusOk = statusFilter === 'all' || r.status === statusFilter
    return qOk && roleOk && statusOk
  })

  const grouped = useMemo(() => ({
    HR: filtered.filter((r) => r.type === 'HR'),
    Employee: filtered.filter((r) => r.type === 'Employee')
  }), [filtered])

  const Section = ({ title, items, icon }) => (
    <section className="bg-white rounded-2xl shadow-sm border">
      <header className="p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="text-lg font-semibold text-slate-800">{title} ({items.length})</h3>
        </div>
        <button onClick={() => setExpanded((e) => ({ ...e, [title]: !e[title] }))} className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm">
          {expanded[title] ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </header>
      {expanded[title] && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm">
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3">{r.username}</td>
                  <td className="px-6 py-3">{r.fullName}</td>
                  <td className="px-6 py-3">{r.role}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${r.status === 'Enabled' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <button title="Promote" className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs" onClick={() => promote(r.id)}>Promote</button>
                      <button title="Demote" className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs" onClick={() => demote(r.id)}>Demote</button>
                      <button title="Toggle Status" className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs" onClick={() => toggleStatus(r.id)}>{r.status === 'Enabled' ? 'Disable' : 'Enable'}</button>
                      <button title="Edit" className="hover:text-slate-900"><FaEdit /></button>
                      <button title="Delete" className="hover:text-slate-900" onClick={() => onDelete(r.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">User Management</h2>
          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setShowSearch((v) => !v)}
              className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 shadow"
              aria-label="Search"
              title="Search"
            >
              <FaSearch className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilter((v) => !v)}
              className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 shadow"
              aria-label="Filter"
              title="Filter"
            >
              <FaFilter className="w-4 h-4" />
            </button>

            {showSearch && (
              <div className="absolute right-20 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-72">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, username, role, status"
                  className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
            )}

            {showFilter && (
              <div className="absolute right-5 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-3 w-72">
                <div className="text-xs text-gray-600 mb-2">Role</div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900">
                  <option value="all">All</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="HR">HR</option>
                  <option value="ESS">ESS</option>
                </select>
                <div className="text-xs text-gray-600 mt-3 mb-2">Status</div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900">
                  <option value="all">All</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button onClick={() => { setRoleFilter('all'); setStatusFilter('all'); }} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Reset</button>
                  <button onClick={() => setShowFilter(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-slate-500 text-sm">Manage HR users and Employees. Promote or demote roles, and enable/disable access.</p>
      </section>

      <Section title="HR" items={grouped.HR} icon={<FaUserShield />} />
      <Section title="Employee" items={grouped.Employee} icon={<FaUser />} />
    </div>
  )
}
