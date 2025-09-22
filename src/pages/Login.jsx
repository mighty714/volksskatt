import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('Admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) {
      navigate('/', { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-amber-400/80 relative overflow-hidden">
      {/* Right decorative circle */}
      <div className="hidden md:block absolute -right-32 top-20 w-[520px] h-[520px] bg-white rounded-full shadow-xl" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Logo area */}
        <div className="mx-auto w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-400 grid place-items-center text-white font-bold">O</div>
            <div className="text-2xl font-semibold">
              <span className="text-amber-500">orange</span>
              <span className="text-emerald-600">HRM</span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={submit} className="mx-auto w-full max-w-xl bg-white mt-6 rounded-3xl shadow-xl p-6 md:p-8">
          <h1 className="text-center text-2xl font-semibold text-slate-800 mb-4">Login</h1>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 mb-4">
              <span>❗</span>
              <span>{error}</span>
            </div>
          )}

          {/* Hint box */}
          <div className="text-slate-600 bg-slate-100 rounded-xl px-4 py-3 mb-4 text-sm">
            <div>Username : <span className="font-medium">Admin</span></div>
            <div>Password : <span className="font-medium">admin123</span></div>
          </div>

          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            required
          />
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full mb-5 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium shadow hover:brightness-105">
            Login
          </button>

          <div className="text-center mt-4 text-sm text-slate-500">
            <button type="button" className="hover:underline">Forgot your password?</button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500 mt-6">
          OrangeHRM OS 5.7 • © 2005 - {new Date().getFullYear()} OrangeHRM, Inc. All rights reserved.
        </div>
      </div>
    </div>
  )
}

