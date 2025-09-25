import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const seedJobs = [
  { id: '1', title: 'Frontend Engineer', dept: 'Engineering', status: 'Open', location: 'Bengaluru', time: 'Full Time', func: 'Engineering' },
  { id: '2', title: 'Recruiter', dept: 'HR', status: 'Open', location: 'Chennai', time: 'Full Time', func: 'HR' },
  { id: '3', title: 'UX Designer', dept: 'Design', status: 'Open', location: 'Remote', time: 'Contract', func: 'Design' },
]

export default function Jobs() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [openFilter, setOpenFilter] = useState(null) // 'location' | 'time' | 'func' | 'exp'
  const DEFAULTS = { location: 'Location', time: 'Time Type', func: 'Job Title', exp: 'Experience' }
  const [filters, setFilters] = useState({ ...DEFAULTS })
  const [sourceJobs, setSourceJobs] = useState(seedJobs)

  // Load jobs from localStorage saved by Admin (/app/jobs)
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('jobs_public')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed) && parsed.length) {
            const mapped = parsed.map((j, idx) => ({
              id: String(j.id || idx + 1),
              title: j.title || 'Untitled',
              dept: j.dept || j.func || 'General',
              status: (j.status || 'Open').toString().replace(/^open$/i, 'Open'),
              location: j.location || 'Remote',
              time: j.time || 'Full Time',
              func: j.func || j.dept || 'General',
              experience: j.experience || '0-2 years',
            }))
            setSourceJobs(mapped)
            return
          }
        }
      } catch { /* ignore */ }
      // fallback to seeds
      setSourceJobs(seedJobs)
    }
    load()
    // Refresh when another tab updates localStorage or on focus
    const onStorage = (e) => { if (e.key === 'jobs_public') load() }
    const onFocus = () => load()
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  const jobs = sourceJobs.filter(j => {
    const q = query.trim().toLowerCase()
    const matchesQ = !q || j.title.toLowerCase().includes(q) || j.dept.toLowerCase().includes(q)
    const locationOk = filters.location === 'Location' || j.location === filters.location
    const timeOk = filters.time === 'Time Type' || j.time === filters.time
    const funcOk = filters.func === 'Job Title' || j.title === filters.func
    const expOk = filters.exp === 'Experience' || j.experience === filters.exp
    return matchesQ && locationOk && timeOk && funcOk && expOk
  })

  return (
    <div className="text-slate-900">
      {/* Top nav */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className={`flex items-center gap-2`}>
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
              <span className="font-medium tracking-wider text-[11px] md:text-base opacity-90 mt-[40px] ml-6 md:ml-17">infotech</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => navigate('/')} className="hover:underline">Home</button>
            <button onClick={() => navigate('/careers')} className="hover:underline">Careers Home</button>
            <button onClick={() => navigate('/jobspost')} className="hover:underline">Search for Jobs</button>
            <button className="hover:underline">Join Our Talent Network</button>
            <button className="hover:underline" onClick={() => navigate('/signin')}>Sign In</button>
            <button className="hover:underline" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-4 pt-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <div className="text-slate-500 text-sm tracking-wide">JOBS AT VOLKSSKATT</div>
              <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 leading-[1.1]">
                Careers that
                <br /> change lives
              </h1>
              {/* Search */}
              <div className="mt-6 flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for jobs or keywords"
                    className="w-full pl-9 pr-3 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <button className="px-5 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold">Search</button>
              </div>
              {/* Filters */}
              {(() => {
                const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));
                const locations = uniq(sourceJobs.map(j => j.location)).sort();
                const times = uniq(sourceJobs.map(j => j.time || 'Full Time')).sort();
                const titles = uniq(sourceJobs.map(j => j.title)).sort();
                const exps = uniq(sourceJobs.map(j => j.experience || '0-2 years'));
                const config = [
                  { key: 'location', label: filters.location, items: locations.length ? locations : ['Remote','Bengaluru','Chennai','Hyderabad'] },
                  { key: 'time', label: filters.time, items: times.length ? times : ['Full Time','Part Time','Internship','Contract'] },
                  { key: 'func', label: filters.func, items: titles.length ? titles : ['Frontend Engineer','Recruiter','UX Designer'] },
                  { key: 'exp', label: filters.exp, items: exps.length ? exps : ['0-2 years','2-4 years','4-6 years','6+ years'] },
                ];
                const hasActive = filters.location !== DEFAULTS.location || filters.time !== DEFAULTS.time || filters.func !== DEFAULTS.func || filters.exp !== DEFAULTS.exp;
                return (
                  <>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {config.map((f) => (
                        <div key={f.key} className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenFilter(openFilter === f.key ? null : f.key)}
                            className={`px-4 py-2 rounded-md border text-sm flex items-center gap-2 ${filters[f.key] !== (DEFAULTS[f.key]) ? 'bg-sky-50 border-sky-200' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                          >
                            <span>{f.label}</span>
                            <span className={`transition-transform ${openFilter === f.key ? 'rotate-180' : ''}`}>▾</span>
                          </button>

                          {openFilter === f.key && (
                            <div className="absolute left-0 mt-1 w-56 rounded-md border border-slate-200 bg-white shadow-lg z-50 animate-pop-bounce max-h-64 overflow-auto">
                              <button
                                className="block w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                onClick={() => { setFilters((prev) => ({ ...prev, [f.key]: DEFAULTS[f.key] })); setOpenFilter(null); }}
                              >
                                Clear {f.key}
                              </button>
                              <div className="border-t" />
                              {f.items.map((opt) => (
                                <button
                                  key={opt}
                                  className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                                  onClick={() => { setFilters((prev) => ({ ...prev, [f.key]: opt })); setOpenFilter(null); }}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Active filter chips */}
                    {hasActive && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {filters.location !== 'Location' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs">
                            Location: {filters.location}
                            <button className="text-sky-700" onClick={() => setFilters((p)=>({ ...p, location: 'Location' }))}>✕</button>
                          </span>
                        )}
                        {filters.time !== 'Time Type' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs">
                            Time: {filters.time}
                            <button className="text-sky-700" onClick={() => setFilters((p)=>({ ...p, time: 'Time Type' }))}>✕</button>
                          </span>
                        )}
                        {filters.func !== DEFAULTS.func && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs">
                            Job Title: {filters.func}
                            <button className="text-sky-700" onClick={() => setFilters((p)=>({ ...p, func: DEFAULTS.func }))}>✕</button>
                          </span>
                        )}
                        {filters.exp !== 'Experience' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs">
                            Experience: {filters.exp}
                            <button className="text-sky-700" onClick={() => setFilters((p)=>({ ...p, exp: 'Experience' }))}>✕</button>
                          </span>
                        )}
                        <button
                          className="ml-2 px-3 py-1 rounded-md border border-slate-300 text-xs hover:bg-slate-50"
                          onClick={() => setFilters({ ...DEFAULTS })}
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=80"
                srcSet="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1280&q=80 1280w,
                        https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80 1920w,
                        https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=80 2400w"
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt="Careers that change lives – collaboration and growth"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Results header */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <strong className="text-slate-800 mr-2">{jobs.length} Jobs Found</strong>
          Showing sample data below. Use the search and filters above to refine.
        </div>
      </div>

      {/* Jobs list */}
      <div className="max-w-7xl mx-auto px-4 mt-6 grid md:grid-cols-2 gap-6">
        {jobs.map((j) => (
          <div key={j.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <a href="#" className="text-lg font-semibold text-sky-700 hover:underline">{j.title} - {j.location}</a>
                <div className="mt-1 text-slate-600 text-sm flex items-center gap-2">
                  <span>📍 {j.location}</span>
                  <span>•</span>
                  <span>{j.time}</span>
                </div>
                <div className="mt-1 text-slate-500 text-xs">Posted Today • Ref #{j.id.padStart(5,'0')}</div>
              </div>
              <div className="shrink-0 w-14 h-14 rounded-full bg-sky-50 grid place-items-center text-sky-500">🧭</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-sm">Apply</button>
              <button className="px-3 py-2 rounded-md border border-slate-300 text-sm">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
