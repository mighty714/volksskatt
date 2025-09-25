import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('Admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState({ loading: false, success: false, message: '' })
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

  // Mount flag for subtle entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const submitForgot = async (e) => {
    e.preventDefault()
    if (!forgotEmail) return
    setForgotStatus({ loading: true, success: false, message: '' })
    // Mock async API call for password reset email
    await new Promise((r) => setTimeout(r, 1000))
    setForgotStatus({ loading: false, success: true, message: 'If an account exists for this email, a reset link has been sent.' })
  }

  // Left welcome area (centered content)
  const renderWelcomeCard = () => (
    <div className="w-full flex flex-col items-center pl-0">
      <div className="text-center">
        <div className="text-white text-4xl md:text-5xl font-semibold tracking-tight" style={{fontFamily:'Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif'}}>Volksskatt</div>
        <div className="text-white/90 text-2xl md:text-3xl font-medium -mt-1 tracking-tight" style={{fontFamily:'Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif'}}>Infotech</div>
      </div>
      <div className="mt-8">
        <div className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-white/10 border-2 border-white/40 grid place-items-center">
          <img src="/logo.png" alt="logo" className="w-28 h-28 md:w-32 md:h-32 object-contain" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Minimal navbar with Home icon at right corner */}
      <header className="absolute top-0 right-0 z-20 p-4">
        <button onClick={() => navigate('/')} aria-label="Home" title="Home" className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white">
          {/* Home icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M3 11l9-8 9 8"/>
            <path d="M5 10v10h14V10"/>
          </svg>
        </button>
      </header>
      {/* Screensaver-style animated background */}
      <div className="absolute inset-0 -z-10 screensaver" />

      {/* Two-column layout: left welcome card, right login form */}
      <div className={`min-h-screen grid place-items-center px-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center justify-center md:justify-start md:-translate-x-4">
            {renderWelcomeCard()}
          </div>
          {/* Transparent login card */}
          <form onSubmit={submit} className="bg-transparent rounded-3xl p-6 md:p-8 shadow-2xl border border-transparent w-full max-w-md min-h-[520px] flex flex-col">
            <div className="mb-6 text-center">
              <div className="text-white text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow">Member Login</div>
              <div className="mt-3 flex justify-center">
                <span className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm grid place-items-center text-white">👤</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 mb-4">
                <span>❗</span>
                <span>{error}</span>
              </div>
            )}

            <label className="block text-xs font-semibold tracking-wide text-orange-600 mb-1">EMAIL</label>
            <div className="relative mb-4">
              <input
                className="w-full pl-9 pr-3 py-3 bg-transparent border-0 border-b-2 border-orange-400 placeholder-orange-400 focus:outline-none focus:border-orange-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="name@addressemail.com"
                required
              />
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-orange-500">👤</span>
            </div>

            <label className="block text-xs font-semibold tracking-wide text-orange-600 mb-1">PASSWORD</label>
            <div className="relative mb-4">
              <input
                className="w-full pl-9 pr-3 py-3 bg-transparent border-0 border-b-2 border-orange-400 placeholder-orange-400 focus:outline-none focus:border-orange-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••••"
                required
              />
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-orange-500">🔒</span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600 mb-6">
              <label className="inline-flex items-center gap-2 select-none">
                <input type="checkbox" className="accent-orange-500" />
                <span>Remember</span>
              </label>
              <button type="button" onClick={() => setShowForgot(true)} className="text-orange-600 hover:underline">Forgot password?</button>
            </div>

            <div className="mt-auto flex justify-center pt-4">
              <button className="w-40 py-3 rounded-xl bg-[#f57c00] hover:bg-[#e96f00] text-white text-base font-semibold">LOG IN</button>
            </div>

            {/* Sign up removed per request */}
          </form>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-800 text-xl font-semibold">Reset your password</h2>
              <button onClick={() => { setShowForgot(false); setForgotStatus({ loading:false, success:false, message:'' }); }} className="text-slate-600 hover:text-slate-900">✕</button>
            </div>
            <p className="text-sm text-slate-600 mb-4">Enter the email address associated with your account and well send you a link to reset your password.</p>
            <form onSubmit={submitForgot}>
              <label className="block text-xs font-semibold tracking-wide text-orange-600 mb-1">EMAIL</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/80 text-slate-900 placeholder-slate-500"
                type="email"
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              {forgotStatus.message && (
                <div className="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{forgotStatus.message}</div>
              )}
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => { setShowForgot(false); setForgotStatus({ loading:false, success:false, message:'' }); }} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white/80 hover:bg-white">Cancel</button>
                <button type="submit" disabled={forgotStatus.loading} className="px-4 py-2 rounded-lg bg-[#f57c00] text-white hover:bg-[#e96f00] disabled:opacity-60 disabled:cursor-not-allowed">
                  {forgotStatus.loading ? 'Sending…' : 'Send reset link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

