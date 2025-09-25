import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPublic() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !password || !confirm) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Account created (demo). You can now sign in.");
      navigate("/signin", { replace: true });
    }, 900);
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
            <h2 className="text-xl font-semibold text-center text-slate-900">Create Account</h2>
            {error && <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}
            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Confirm Password</label>
                <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="mt-2 w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed transition">{loading ? "Creating..." : "Create Account"}</button>
              <div className="text-center text-xs mt-1">
                Already have an account? <button type="button" onClick={()=>navigate('/signin')} className="text-sky-700 hover:underline">Sign In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
