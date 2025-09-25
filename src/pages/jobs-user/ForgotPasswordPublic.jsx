import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPublic() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close" className="absolute inset-0 bg-black/40" onClick={() => navigate(-1)} />
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

            <button aria-label="Careers Home" title="Careers Home" className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-slate-100 grid place-items-center text-slate-600" onClick={() => navigate('/careers')}>🏠</button>
          </div>

          <div className="px-6 pt-5 pb-6">
            <h2 className="text-xl font-semibold text-center text-slate-900">Forgot your password?</h2>
            {error && <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}

            {!sent ? (
              <form onSubmit={onSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={loading} className="mt-2 w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed transition">{loading ? "Sending..." : "Send reset link"}</button>
                <div className="text-center text-xs mt-1">
                  Remembered your password? <button type="button" onClick={()=>navigate('/signin')} className="text-sky-700 hover:underline">Sign In</button>
                </div>
              </form>
            ) : (
              <div className="mt-4 text-sm text-slate-700">
                We sent a password reset link to <span className="font-medium">{email}</span>.
                <div className="mt-2">Please check your inbox and follow the instructions.</div>
                <div className="mt-4 flex items-center justify-center">
                  <button className="px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-50" onClick={()=>navigate('/signin')}>Back to Sign In</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
