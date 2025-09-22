import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('Admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [wordmarkVisible, setWordmarkVisible] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) {
      navigate('/app', { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  // Intro animation sequence: show wordmark, then reveal form
  useEffect(() => {
    const t0 = setTimeout(() => setWordmarkVisible(true), 250)
    const t2 = setTimeout(() => setFormVisible(true), 900)
    return () => {
      clearTimeout(t0)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background: decent color gradient (no image) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-800 to-sky-700" />
        <div className="absolute -top-24 -left-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-10 -right-12 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
      </div>

      {/* Header/Nav */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white/80 grid place-items-center text-slate-800 font-bold">V</div>
            <span className="font-semibold text-white">volksskatt</span>
          </button>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <button onClick={() => navigate('/login')} className="text-white">Login</button>
          </nav>
        </div>
      </header>

      {/* Right-side badge removed as requested */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        {/* Floating wordmark card */}
        <div className={`mx-auto w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] p-5 transition-all duration-700 ${
          wordmarkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/80 grid place-items-center text-slate-800 font-bold">V</div>
            <div className="text-2xl font-semibold text-white">
              <span className="text-emerald-300">volk</span>
              <span className="text-amber-300">sskatt</span>
            </div>
          </div>
        </div>

        {/* Docked logo removed as requested */}

        {/* Form card */}
        <form
          onSubmit={submit}
          className={`mx-auto w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/10 mt-6 rounded-3xl shadow-xl p-6 md:p-8 transform transition-all duration-700 ${
            formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
          }`}
        >
          <h1 className="text-center text-2xl font-semibold text-white mb-4">Login</h1>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 mb-4">
              <span>❗</span>
              <span>{error}</span>
            </div>
          )}

          {/* Hint box */}
          <div className="text-white bg-white/5 rounded-2xl px-5 py-4 mb-5 text-sm border border-white/10">
            <div>Username : <span className="font-medium">Admin</span></div>
            <div>Password : <span className="font-medium">admin123</span></div>
          </div>

          <label className="block text-sm mb-1 text-white/90">Username</label>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">👤</span>
            <input
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              required
            />
          </div>

          <label className="block text-sm mb-1 text-white/90">Password</label>
          <div className="relative mb-5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">🔒</span>
            <input
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium shadow hover:brightness-105">
            Login
          </button>

          <div className="text-center mt-4 text-sm text-white/80">
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

