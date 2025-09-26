import React, { useEffect, useMemo, useState } from 'react'
import { FaSearch, FaFilter, FaEye, FaPaperPlane } from 'react-icons/fa'
import { getUser } from '../../services/auth'

export default function EmployeeJobs() {
  const user = getUser()
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [expFilter, setExpFilter] = useState('all') // all | 0-2 years | 2-4 years | 4-6 years | 6+ years
  const [viewJob, setViewJob] = useState(null)

  const [applications, setApplications] = useState(() => {
    try {
      const raw = localStorage.getItem('employee_applications')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('jobs_public')
      const parsed = raw ? JSON.parse(raw) : []
      setJobs(Array.isArray(parsed) ? parsed : [])
    } catch {
      setJobs([])
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('employee_applications', JSON.stringify(applications)) } catch {}
  }, [applications])

  const filteredJobs = jobs.filter((j) => {
    const q = query.trim().toLowerCase()
    const qOk = !q || j.title?.toLowerCase().includes(q) || j.dept?.toLowerCase().includes(q)
    const exp = (j.experience || '').toLowerCase()
    const ef = expFilter.toLowerCase()
    const expOk = expFilter === 'all' || exp === ef
    return qOk && expOk
  })

  const myApps = useMemo(() => applications.filter(a => a.applicant === (user?.email || user?.fullName)), [applications, user])

  const alreadyApplied = (jobId) => myApps.some(a => a.jobId === jobId)

  const applyToJob = (job) => {
    if (alreadyApplied(job.id)) return
    const applicant = user?.email || user?.fullName || 'me'
    const app = { id: Date.now(), jobId: job.id, jobTitle: job.title, dept: job.dept, applicant, status: 'Applied', createdAt: new Date().toISOString() }
    setApplications((prev) => [app, ...prev])
    alert('✅ Application submitted!')
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md text-center">
      <header className="flex items-center justify-between mb-5 text-left gap-3">
        <h2 className="text-xl font-bold text-gray-800">Jobs & Applications</h2>
        <div className="flex items-center gap-2 relative">
          <button type="button" onClick={() => setShowSearch((v) => !v)} className="w-9 h-9 grid place-items-center rounded border border-gray-300 bg-white text-slate-700 hover:bg-gray-50" aria-label="Toggle search" title="Search"><FaSearch className="w-4 h-4" /></button>
          {showSearch && (
            <div className="absolute right-20 top-11 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-72">
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title/department" className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
            </div>
          )}
          <button type="button" onClick={() => setShowFilter((v) => !v)} className="w-9 h-9 grid place-items-center rounded border border-gray-300 bg-white text-slate-700 hover:bg-gray-50" aria-label="Toggle filters" title="Filter"><FaFilter className="w-4 h-4" /></button>
          {showFilter && (
            <div className="absolute right-5 top-11 z-20 bg-white border border-gray-200 rounded-md shadow p-3 w-72">
              <div className="text-xs text-gray-600 mb-2">Filter by Experience</div>
              <select value={expFilter} onChange={(e) => setExpFilter(e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200">
                <option value="all">All</option>
                <option value="0-2 years">0-2 years</option>
                <option value="2-4 years">2-4 years</option>
                <option value="4-6 years">4-6 years</option>
                <option value="6+ years">6+ years</option>
              </select>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button onClick={() => { setExpFilter('all') }} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Reset</button>
                <button onClick={() => setShowFilter(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-4">
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {filteredJobs.length ? (
            filteredJobs.map((job) => (
              <li key={job.id} className="list-none border rounded p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{job.title}</div>
                    <div className="text-sm text-slate-600">{job.dept} {job.experience ? `• ${job.experience}` : ''}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewJob(job)} title="View" aria-label="View" className="w-9 h-9 grid place-items-center rounded-full bg-blue-500 text-white shadow hover:bg-blue-600 transition"><FaEye className="w-4 h-4" /></button>
                    <button onClick={() => applyToJob(job)} disabled={alreadyApplied(job.id)} title={alreadyApplied(job.id) ? 'Already applied' : 'Apply'} aria-label="Apply" className={`w-9 h-9 grid place-items-center rounded-full ${alreadyApplied(job.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white shadow transition`}>
                      <FaPaperPlane className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No jobs found.</p>
          )}
        </div>

        <aside className="border rounded-xl p-4 h-fit bg-white">
          <h3 className="text-slate-900 font-semibold mb-2">My Applications</h3>
          <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {myApps.length ? myApps.map(app => (
              <li key={app.id} className="border rounded p-2 text-left">
                <div className="font-medium text-slate-900">{app.jobTitle}</div>
                <div className="text-xs text-slate-600">{app.dept} • {new Date(app.createdAt).toLocaleDateString('en-GB')}</div>
                <div className="mt-1 text-xs"><span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">{app.status}</span></div>
              </li>
            )) : <div className="text-sm text-slate-500">No applications yet.</div>}
          </ul>
        </aside>
      </div>

      {viewJob && (
        <div className="fixed inset-0 z-30">
          <button className="absolute inset-0 bg-black/30" aria-label="Close" onClick={() => setViewJob(null)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[96%] max-w-2xl p-6 text-left">
            <h3 className="text-xl font-semibold mb-2 text-slate-800">{viewJob.title}</h3>
            <div className="text-sm text-slate-700 mb-2">{viewJob.dept} • {viewJob.location || '-'} • {viewJob.experience || '-'}</div>
            <div className="p-3 rounded border bg-gray-50 text-slate-800 whitespace-pre-line max-h-60 overflow-y-auto">{viewJob.descri}</div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setViewJob(null)} className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm">Close</button>
              <button onClick={() => { applyToJob(viewJob); setViewJob(null) }} disabled={alreadyApplied(viewJob.id)} className={`px-3 py-1.5 rounded ${alreadyApplied(viewJob.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-sm`}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
