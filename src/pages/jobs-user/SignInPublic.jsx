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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={() => navigate(-1)}
      />

      {/* Centered Dialog */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-pop-bounce">
          <div className="px-6 py-4 relative border-b">
            <div className="flex items-center justify-center gap-1">
              <img src="/logo.png" alt="volksskatt logo" className="w-10 h-12 object-contain drop-shadow" />
              <span className="flex -ml-5 mt-5 flex-col leading-none text-black/90">
                <span className="font-semibold tracking-wide text-xs">volksskatt</span>
                <span className="text-[9px] text-slate-600 mt-[px]">infotech</span>
              </span>
            </div>
           
            <button
              aria-label="Careers Home"
              title="Careers Home"
              className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-slate-100 grid place-items-center text-slate-600"
              onClick={() => navigate('/careers')}
            >
              🏠
            </button>
          </div>

          <div className="px-6 pt-5 pb-6">
            <h2 className="text-xl font-semibold text-center text-slate-900">Sign In</h2>

            {error && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 pr-10"
                  />
                  <button
                    type="button"
                    title={showPwd ? "Hide" : "Show"}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    onClick={() => setShowPwd((v) => !v)}
                  >
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center text-xs text-slate-600 mt-1">
                Don't have an account yet? <button type="button" onClick={()=>navigate('/signup')} className="text-sky-700 hover:underline">Create Account</button>
              </div>
              <div className="text-center text-xs">
                <button type="button" onClick={()=>navigate('/forgot-password')} className="text-sky-700 hover:underline">Forgot your password?</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
