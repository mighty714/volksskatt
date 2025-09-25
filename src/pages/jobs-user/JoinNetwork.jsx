import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinNetwork() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    country: "India",
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    phone: "",
    interest: "Engineering",
    linkedin: "",
    experience: "0-2 years",
    skills: "",
    skillsList: [],
    resume: null,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  // Skills tag input helpers
  const addSkill = (raw) => {
    const v = (raw || "").trim();
    if (!v) return;
    setForm((f) => ({ ...f, skills: "", skillsList: Array.from(new Set([...(f.skillsList||[]), v])) }));
  };
  const onSkillsKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(form.skills);
    }
  };
  const removeSkill = (s) => setForm((f)=>({ ...f, skillsList: (f.skillsList||[]).filter(x=>x!==s) }));

  const onSubmit = (e) => {
    e.preventDefault();
    // Validate
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const urlRe = /^https?:\/\/\S+$/i;
    const phoneRe = /^[+]?\d[\d\s-]{6,}$/;
    if (!form.firstName) errs.firstName = 'First name is required';
    if (!form.lastName) errs.lastName = 'Last name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!emailRe.test(form.email)) errs.email = 'Enter a valid email';
    if (form.linkedin && !urlRe.test(form.linkedin)) errs.linkedin = 'Enter a valid URL starting with http(s)://';
    if (form.phone && !phoneRe.test(form.phone)) errs.phone = 'Enter a valid phone number';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    // Simulate submit; persist in localStorage for demo
    setTimeout(() => {
      try {
        const raw = localStorage.getItem("talent_network_submissions") || "[]";
        const arr = JSON.parse(raw);
        const payload = { ...form, id: Date.now(), resume: form.resume ? form.resume.name : null };
        arr.push(payload);
        localStorage.setItem("talent_network_submissions", JSON.stringify(arr));
      } catch {}
      setSubmitting(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="text-slate-900">
      {/* Top nav like other public pages */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className={`flex items-center gap-2`}>
            <div className="relative w-12 h-12 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
              <img src="/logo.png" alt="volksskatt logo" className="absolute inset-0 w-full h-full object-contain scale-[1.18]" />
              <span className="absolute inset-0 flex items-center justify-start pl-[30px] -translate-x-[3px] -translate-y-[-9px] pointer-events-none text-[17px] md:text-lg font-semibold tracking-wide text-black drop-shadow">volksskatt</span>
            </div>
            <span className="hidden sm:flex -ml-3 flex-col leading-none text-black/90 drop-shadow-sm mt-[3px]">
              <span className="font-medium tracking-wider text-[11px] md:text-base opacity-90 mt-[40px] ml-6 md:ml-17">infotech</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => navigate('/careers')} className="hover:underline">Careers Home</button>
            <button onClick={() => navigate('/jobspost')} className="hover:underline">Search for Jobs</button>
            <button onClick={() => navigate('/signin')} className="hover:underline">Sign In</button>
          </div>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-4 pt-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Join Our Talent Network!</h1>
            <p className="mt-2 text-slate-600 max-w-3xl text-sm md:text-base">
              Are you interested in a career at Volksskatt but cannot find a current opening to match your skills? Complete the form below and
              attach your resume. We will contact you if an opportunity becomes available. You may also sign in to create job alerts.
            </p>

            {success ? (
              <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded text-green-700">
                Thank you for your interest! We have received your details.
                <div className="mt-3 flex gap-2">
                  <button className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50" onClick={()=>navigate('/jobspost')}>Search Jobs</button>
                  <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white" onClick={()=>navigate('/careers')}>Back to Careers</button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Country <span className="text-red-500">*</span></label>
                  <select name="country" value={form.country} onChange={onChange} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white">
                    {["India","United States of America","United Kingdom","Germany","Singapore"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Prefix</label>
                  <select name="prefix" value={form.prefix} onChange={onChange} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white">
                    <option value="">Select One</option>
                    <option>Mr</option>
                    <option>Ms</option>
                    <option>Mrs</option>
                    <option>Dr</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">First Name <span className="text-red-500">*</span></label>
                  <input name="firstName" value={form.firstName} onChange={onChange} className={`w-full px-3 py-2 rounded-md border bg-white ${errors.firstName ? 'border-red-400' : 'border-slate-300'}`} />
                  {errors.firstName && <div className="mt-1 text-xs text-red-600">{errors.firstName}</div>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Middle Name</label>
                  <input name="middleName" value={form.middleName} onChange={onChange} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Last Name <span className="text-red-500">*</span></label>
                  <input name="lastName" value={form.lastName} onChange={onChange} className={`w-full px-3 py-2 rounded-md border bg-white ${errors.lastName ? 'border-red-400' : 'border-slate-300'}`} />
                  {errors.lastName && <div className="mt-1 text-xs text-red-600">{errors.lastName}</div>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Suffix</label>
                  <input name="suffix" value={form.suffix} onChange={onChange} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={form.email} onChange={onChange} className={`w-full px-3 py-2 rounded-md border bg-white ${errors.email ? 'border-red-400' : 'border-slate-300'}`} placeholder="you@example.com" />
                  {errors.email && <div className="mt-1 text-xs text-red-600">{errors.email}</div>}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                  <input name="phone" value={form.phone} onChange={onChange} className={`w-full px-3 py-2 rounded-md border bg-white ${errors.phone ? 'border-red-400' : 'border-slate-300'}`} placeholder="+91 98765 43210" />
                  {errors.phone && <div className="mt-1 text-xs text-red-600">{errors.phone}</div>}
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedin" value={form.linkedin} onChange={onChange} className={`w-full px-3 py-2 rounded-md border bg-white ${errors.linkedin ? 'border-red-400' : 'border-slate-300'}`} placeholder="https://www.linkedin.com/in/username" />
                  {errors.linkedin && <div className="mt-1 text-xs text-red-600">{errors.linkedin}</div>}
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Experience</label>
                  <select name="experience" value={form.experience} onChange={onChange} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white">
                    {['0-2 years','2-4 years','4-6 years','6+ years'].map((x)=> <option key={x}>{x}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Area ofInterest</label>
                  <select name="interest" value={form.interest} onChange={onChange} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white">
                    {["Engineering","Design","Sales","HR","Operations"].map(x => <option key={x}>{x}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Skills</label>
                  <input name="skills" value={form.skills} onChange={onChange} onKeyDown={onSkillsKeyDown} onPaste={(e)=>{ const text = e.clipboardData.getData('text'); if (text && text.includes(',')) { e.preventDefault(); text.split(',').map(s=>s.trim()).filter(Boolean).forEach(addSkill); } }} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white" placeholder="Type or paste comma-separated skills and press Enter (e.g., React, Node.js)" />
                  {!!(form.skillsList||[]).length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(form.skillsList||[]).map(s => (
                        <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-sky-100 text-sky-800 text-xs">
                          {s}
                          <button type="button" className="text-sky-700" onClick={()=>removeSkill(s)}>✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Resume</label>
                  <input type="file" name="resume" onChange={onChange} className="block w-full text-sm text-slate-700" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Message</label>
                  <textarea name="message" value={form.message} onChange={onChange} rows={4} className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white" placeholder="Tell us a bit about yourself and your interests" />
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2 border-t pt-4">
                  <button type="button" className="px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-50" onClick={()=>navigate(-1)}>Cancel</button>
                  <button type="submit" disabled={submitting} className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60">
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
