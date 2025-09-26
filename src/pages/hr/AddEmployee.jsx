import React, { useEffect, useMemo, useState } from 'react'
import { FiChevronDown, FiSearch, FiPlus, FiEdit2, FiTrash2, FiKey } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function generateUsername(name, email) {
  const base = (name || email || '').toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')
  const suffix = Math.floor(100 + Math.random() * 900) // 3-digit
  return base ? `${base}.${suffix}` : `user${Date.now().toString().slice(-4)}`
}

function generatePassword(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function AddEmployee() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', contact: '', role: 'employee', username: '', password: '' })
  const [originalForm, setOriginalForm] = useState({ name: '', email: '', contact: '', role: 'employee', username: '', password: '' })
  const [autoUser, setAutoUser] = useState(true)
  const [autoPass, setAutoPass] = useState(true)
  const [savedToast, setSavedToast] = useState(null)
  const [lastCreatedCreds, setLastCreatedCreds] = useState(null)
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Search fields
  const [qName, setQName] = useState('')
  const [qRole, setQRole] = useState('all')
  const [qUsername, setQUsername] = useState('')

  const key = 'users_db'

  const loadUsers = () => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]')
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      setUsers([])
    }
  }

  const saveUsers = (list) => {
    localStorage.setItem(key, JSON.stringify(list))
    setUsers(list)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useMemo(() => {
    if (autoUser) {
      setForm((f) => ({ ...f, username: generateUsername(f.name, f.email) }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, form.email, autoUser])

  useMemo(() => {
    if (autoPass) {
      setForm((f) => ({ ...f, password: generatePassword() }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPass])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.role) {
      alert('Please fill Name, Email and Role')
      return
    }
    // Persist to a simple local users_db for demo
    try {
      const data = [...users]
      if (editingId) {
        // update
        const idx = data.findIndex((u) => u.id === editingId)
        if (idx !== -1) {
          data[idx] = {
            ...data[idx],
            fullName: form.name,
            email: form.email,
            contact: form.contact,
            role: form.role,
            username: form.username || data[idx].username,
            // do not overwrite password unless manual provided while auto disabled
            password: autoPass ? data[idx].password : (form.password || data[idx].password),
          }
        }
        saveUsers(data)
        setSavedToast('✅ Employee updated')
      } else {
        // create
        const exists = data.some((u) => (u.email || '').toLowerCase() === form.email.toLowerCase())
        if (exists) {
          alert('A user with this email already exists')
          return
        }
        const newUser = {
          id: Date.now(),
          fullName: form.name,
          email: form.email,
          contact: form.contact,
          role: form.role, // 'employee' | 'team_lead' | 'hr' | 'admin'
          username: form.username || generateUsername(form.name, form.email),
          password: form.password || generatePassword(),
          status: 'Enabled',
          mustChangePassword: true,
        }
        saveUsers([newUser, ...data])
        setSavedToast('✅ Employee created')
        setLastCreatedCreds({
          name: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        })
      }
      setTimeout(() => setSavedToast(null), 2500)
      setForm({ name: '', email: '', contact: '', role: 'employee', username: '', password: '' })
      setEditingId(null)
      setShowForm(false)
    } catch (e1) {
      console.error(e1)
      alert('Failed to save user')
    }
  }

  const startAdd = () => {
    setForm({ name: '', email: '', contact: '', role: 'employee', username: '', password: '' })
    setOriginalForm({ name: '', email: '', contact: '', role: 'employee', username: '', password: '' })
    setAutoUser(true)
    setAutoPass(true)
    setEditingId(null)
    setShowForm(true)
  }

  const startEdit = (u) => {
    setForm({
      name: u.fullName || '',
      email: u.email || '',
      contact: u.contact || '',
      role: u.role || 'employee',
      username: u.username || '',
      password: '',
    })
    setOriginalForm({
      name: u.fullName || '',
      email: u.email || '',
      contact: u.contact || '',
      role: u.role || 'employee',
      username: u.username || '',
      password: '',
    })
    setAutoUser(false)
    setAutoPass(false)
    setEditingId(u.id)
    setShowForm(true)
  }

  const resetPassword = (u) => {
    if (!window.confirm(`Reset password for ${u.fullName || u.username}?`)) return
    const pwd = generatePassword()
    const data = users.map((x) => (x.id === u.id ? { ...x, password: pwd, mustChangePassword: true } : x))
    saveUsers(data)
    alert(`New password: ${pwd}`)
  }

  const removeUser = (u) => {
    if (!window.confirm(`Delete ${u.fullName || u.username}?`)) return
    saveUsers(users.filter((x) => x.id !== u.id))
  }

  const filtered = users.filter((u) => {
    const nameOk = !qName || (u.fullName || '').toLowerCase().includes(qName.toLowerCase())
    const userOk = !qUsername || (u.username || '').toLowerCase().includes(qUsername.toLowerCase())
    const roleOk = qRole === 'all' || u.role === qRole
    return nameOk && userOk && roleOk
  })

  const runSearch = () => {
    // If matches found, load first into form for edit
    if (filtered.length > 0) {
      startEdit(filtered[0])
    } else {
      alert('No users found for the given criteria')
    }
  }

  const isDirty = JSON.stringify(form) !== JSON.stringify(originalForm)

  return (
    <section className="bg-white p-6 rounded-xl shadow-md text-black">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">User Management</h2>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <input value={qName} onChange={(e) => setQName(e.target.value)} placeholder="Search by name" className="px-3 py-2 rounded border bg-white text-black text-sm" />
            <input value={qUsername} onChange={(e) => setQUsername(e.target.value)} placeholder="Username" className="px-3 py-2 rounded border bg-white text-black text-sm" />
            <select value={qRole} onChange={(e) => setQRole(e.target.value)} className="px-3 py-2 rounded border bg-white text-black text-sm">
              <option value="all">All Roles</option>
              <option value="employee">Employee</option>
              <option value="team_lead">Team Lead</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={runSearch} className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-50" title="Search" aria-label="Search"><FiSearch className="w-4 h-4" /></button>
          </div>
          <button onClick={startAdd} className="px-3 py-2 rounded-full border border-gray-300 bg-white text-black font-medium hover:bg-gray-50 flex items-center gap-2" title="Add New">
            <FiPlus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-left text-sm text-black">
          <div className="flex items-center justify-between gap-3">
            <div>{savedToast}</div>
            {lastCreatedCreds && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded border border-gray-300 bg-white text-black hover:bg-gray-50"
                  onClick={async () => {
                    const text = `Login: ${lastCreatedCreds.username || lastCreatedCreds.email}\nEmail: ${lastCreatedCreds.email}\nPassword: ${lastCreatedCreds.password}\nRole: ${lastCreatedCreds.role}`
                    try {
                      await navigator.clipboard.writeText(text)
                      alert('Credentials copied to clipboard')
                    } catch {
                      // Fallback: show prompt
                      window.prompt('Copy credentials:', text)
                    }
                  }}
                >
                  Copy credentials
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded border border-gray-300 bg-white text-black hover:bg-gray-50"
                  onClick={() => window.open(
                    (lastCreatedCreds.role === 'admin')
                      ? '/login-admin'
                      : (lastCreatedCreds.role === 'hr')
                        ? '/login-hr'
                        : '/login-employee',
                    '_blank',
                    'noopener,noreferrer'
                  )}
                  title={
                    `Open ${lastCreatedCreds.role === 'admin' ? 'Admin' : lastCreatedCreds.role === 'hr' ? 'HR' : 'Employee'} Login`
                  }
                  aria-label={
                    `Open ${lastCreatedCreds.role === 'admin' ? 'Admin' : lastCreatedCreds.role === 'hr' ? 'HR' : 'Employee'} Login`
                  }
                >
                  {`Go to ${lastCreatedCreds.role === 'admin' ? 'Admin' : lastCreatedCreds.role === 'hr' ? 'HR' : 'Employee'} Login`}
                </button>
              </div>
            )}
          </div>
          {lastCreatedCreds && (
            <div className="mt-2 text-black">
              <div><span className="font-semibold">Username:</span> {lastCreatedCreds.username}</div>
              <div><span className="font-semibold">Email:</span> {lastCreatedCreds.email}</div>
              <div><span className="font-semibold">Password:</span> {lastCreatedCreds.password}</div>
              <div><span className="font-semibold">Role:</span> {lastCreatedCreds.role}</div>
            </div>
          )}
        </div>
      )}

      {(showForm || editingId) && (
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 mb-6 text-black">
      <div>
  <label className="block text-xs text-black mb-1">Name</label>
  <input
    name="name"
    value={form.name}
    onChange={onChange}
    className="w-full px-3 py-2 rounded border bg-white text-black"
    placeholder="Full name"
  />
        </div>
        <div>
          <label className="block text-xs text-black mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} className="w-full px-3 py-2 rounded border bg-white text-black" placeholder="email@company.com" />
        </div>
        <div>
          <label className="block text-xs text-black mb-1">Contact Info</label>
          <input name="contact" value={form.contact} onChange={onChange} className="w-full px-3 py-2 rounded border bg-white text-black" placeholder="Phone or other" />
        </div>
        <div>
          <label className="block text-xs text-black mb-1">Role</label>
          <div className="relative">
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="w-full px-3 py-2 pr-10 rounded border bg-white text-black appearance-none"
            >
              <option value="employee">Employee</option>
              <option value="team_lead">Team Lead</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-black mb-1">Username {autoUser && <span className="text-[10px] text-black ">(auto-generated)</span>}</label>
          <div className="flex gap-2">
            <input name="username" value={form.username} onChange={onChange} className="w-full px-3 py-2 rounded border bg-white text-black" placeholder="Optional username" disabled={autoUser} />
            <button type="button" className="px-3 py-2 rounded border bg-white text-black hover:bg-gray-50" onClick={() => setAutoUser((v) => !v)}>{autoUser ? 'Manual' : 'Auto'}</button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-black mb-1">Password {autoPass && <span className="text-[10px] text-black ">(auto-generated)</span>}</label>
          <div className="flex gap-2">
            <input name="password" value={form.password} onChange={onChange} className="w-full px-3 py-2 rounded border bg-white text-black" placeholder="Set a password" disabled={autoPass} />
            <button type="button" className="px-3 py-2 rounded border bg-white text-black hover:bg-gray-50" onClick={() => setAutoPass((v) => !v)}>{autoPass ? 'Manual' : 'Auto'}</button>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          {isDirty && (
            <button type="submit" className="px-4 py-2 rounded bg-slate-200 text-slate-900 text-sm">Update</button>
          )}
          <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700">Save</button>
        </div>
      </form>
      )}

      {/* List existing employees */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-black">
          <thead>
            <tr className="text-black text-sm">
              <th className="px-6 py-3 font-medium sticky top-0 bg-sky-50">Username</th>
              <th className="px-6 py-3 font-medium sticky top-0 bg-sky-50">Role</th>
              <th className="px-6 py-3 font-medium sticky top-0 bg-sky-50">Name</th>
              <th className="px-6 py-3 font-medium sticky top-0 bg-sky-50">Email</th>
              <th className="px-6 py-3 font-medium sticky top-0 bg-sky-50">Status</th>
              <th className="px-6 py-3 font-medium sticky top-0 bg-sky-50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-medium">{u.username}</td>
                <td className="px-6 py-3 font-medium">{u.role}</td>
                <td className="px-6 py-3 font-medium">{u.fullName}</td>
                <td className="px-6 py-3">{u.email}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${u.status === 'Enabled' ? 'bg-emerald-50 text-black' : 'bg-rose-50 text-black'}`}>{u.status}</span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 grid place-items-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-50 transition" title="Edit" aria-label="Edit" onClick={() => startEdit(u)}>
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 grid place-items-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-50 transition" title="Reset Password" aria-label="Reset Password" onClick={() => resetPassword(u)}>
                      <FiKey className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 grid place-items-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-50 transition" title="Delete" aria-label="Delete" onClick={() => removeUser(u)}>
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-black">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
