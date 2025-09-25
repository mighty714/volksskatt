import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInPublic() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    // Fake submit just to demonstrate UI
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Close the modal and return to previous page
      navigate(-1);
      alert("Signed in (demo)");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Top mini bar */}
      <div className="bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-9 py-3 flex items-center justify-end text-slate-600 gap-2">
          <button onClick={() => navigate('/careers')} className="hover:underline">Careers Home</button>
          <span>New to Volksskatt?</span>
          <button className="ml-1 text-sky-700 hover:underline font-medium" onClick={() => navigate('/signup')}>Register</button>
        </div>
      </div>
      {/* Logo Section below navbar */}
<div className="max-w-6xl mx-auto px-9 -mt-16 flex items-center justify-start gap-2">

<div className="flex items-center gap-2">
  <div className="relative w-12 h-12 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
    <img
      src="/logo.png"
      alt="volksskatt logo"
      className="absolute inset-0 w-full h-full object-contain scale-[1.18]"
    />
    <span className="absolute inset-0 flex items-center justify-start pl-[30px] -translate-x-[3px] -translate-y-[-9px] pointer-events-none text-[17px] md:text-lg font-semibold tracking-wide text-black drop-shadow">
      volksskatt
    </span>
  </div>
  <span className="hidden sm:flex -ml-3 flex-col leading-none text-black/90 drop-shadow-sm mt-[3px]">
    <span className="font-medium tracking-wider text-[11px] md:text-base opacity-90 mt-[40px] ml-6 md:ml-17">
      infotech
    </span>
  </span>
</div>
</div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-start">
        {/* Left benefits card */}
        <aside>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">New to Volksskatt?</h2>
            <ul className="list-none">
            <li className="flex items-start gap-2">
               <span className="text-sky-600 mt-1">🚀</span> Apply to jobs instantly with your profile
            </li>
            <li className="flex items-start gap-2">
             <span className="text-sky-600 mt-1">💡</span> Receive personalized job recommendations
            </li>
            <li className="flex items-start gap-2">
            <span className="text-sky-600 mt-1">📢</span> Highlight your profile to top IT companies
            </li>
            <li className="flex items-start gap-2">
            <span className="text-sky-600 mt-1">📊</span> Track your application progress easily
            </li>
            </ul>

            <button onClick={() => navigate('/signup')} className="mt-5 inline-flex items-center justify-center px-5 h-10 rounded-md border border-sky-300 text-sky-700 hover:bg-sky-50 font-medium">Register for Free</button>
          </div>
        </aside>

        {/* Right login card */}
        <section>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900">Login</h2>

            {error && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>
            )}

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email ID / Username <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email ID / Username"
                  className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  autoFocus
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Password <span className="text-red-500">*</span></label>
                  <button
                    type="button"
                    className="text-xs text-sky-700 hover:underline"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 pr-12"
                  />
                  <button
                    type="button"
                    title={showPwd ? "Hide" : "Show"}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    onClick={() => setShowPwd((v) => !v)}
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                className="w-full h-10 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700"
              >
                Use OTP to Login
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex-1 h-px bg-slate-200" />
                <span>Or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <button type="button" className="w-full h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-50 shadow-sm inline-flex items-center justify-center gap-2">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                <span className="font-medium text-slate-700">Sign in with Google</span>
              </button>

              <div className="text-center text-xs text-slate-600">
                Don't have an account? <button type="button" onClick={()=>navigate('/signup')} className="text-sky-700 hover:underline">Register for Free</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
