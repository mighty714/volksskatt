import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPublic() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mobile, setMobile] = useState("");
  const [workStatus, setWorkStatus] = useState("experienced");
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
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Navbar - keep height same */}
<div className="bg-white/80 border-b">
  <div className="max-w-6xl mx-auto px-9 py-3 flex items-center justify-end text-slate-600 gap-2">
    <button onClick={() => navigate('/careers')} className="hover:underline">
      Careers Home
    </button>
    <span className="text-slate-600">Already Registered?</span>
    <button
      className="ml-1 text-sky-700 hover:underline font-medium"
      onClick={() => navigate('/signin')}
    >
      Login here
    </button>
  </div>
</div>

{/* Logo Section below navbar */}
<div className="max-w-6xl mx-auto px-9 -mt-16 flex items-center justify-start gap-2">

<div className="flex items-center gap-2 -mt-0">
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
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[320px,1fr] gap-6 items-start">
        {/* Left info card */}
        <aside className="hidden md:block">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-6">
            <div className="flex items-center gap-3">

              <div>
                <div className="font-semibold text-slate-900">On registering, you can</div>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">●</span> Build your profile and let recruiters find you</li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">●</span> Get job postings delivered right to your email</li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">●</span> Find a job and grow your career</li>
            </ul>
          </div>
        </aside>

        {/* Right form card */}
        <section>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-[1fr,1px,220px]">
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Create your profile</h1>
                    <p className="text-slate-500 text-sm">Search & apply to jobs from Volksskatt</p>
                  </div>

                </div>

                {error && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}

                {/* Form */}
                <form onSubmit={onSubmit} className="mt-5 grid gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Full name<span className="text-red-500">*</span></label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="What is your name?" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email ID<span className="text-red-500">*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Tell us your Email ID" />
                    <div className="text-xs text-slate-500 mt-1">We'll send relevant job leads and updates to this email</div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Password<span className="text-red-500">*</span></label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Minimum 6 characters" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Confirm password<span className="text-red-500">*</span></label>
                      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Re-enter password" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Mobile number<span className="text-red-500">*</span></label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-700">+91</span>
                      <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full h-11 px-3 rounded-r-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Enter your mobile number" />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Recruiters will contact you on this number</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Work status<span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setWorkStatus('experienced')} className={`p-3 rounded-lg border ${workStatus === 'experienced' ? 'border-sky-300 bg-sky-50' : 'border-slate-300 bg-white'}`}>I'm experienced</button>
                      <button type="button" onClick={() => setWorkStatus('fresher')} className={`p-3 rounded-lg border ${workStatus === 'fresher' ? 'border-sky-300 bg-sky-50' : 'border-slate-300 bg-white'}`}>I'm a fresher</button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed transition">
                      {loading ? "Creating..." : "Create Profile"}
                    </button>
                    <div className="text-center text-xs mt-2">
                      By continuing, you agree to our terms and privacy policy.
                    </div>
                  </div>
                </form>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-slate-200" />

              {/* Social sign-in */}
              <div className="p-6 md:p-8 flex flex-col justify-center items-center">
  <div className="text-slate-500 text-sm">Continue with</div>

  <button className="mt-3 inline-flex items-center gap-2 px-4 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-50 shadow-sm">
    <img 
      src="https://www.google.com/favicon.ico" 
      alt="Google" 
      className="w-4 h-4" 
    />
    <span className="font-medium text-slate-700">Google</span>
  </button>
</div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
