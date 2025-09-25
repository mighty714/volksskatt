import { useState, useRef, useEffect } from "react";
import { FaTrash, FaSearch, FaFilter, FaEye, FaEdit, FaPlus } from "react-icons/fa";

export default function Jobs() {
  const [jobs, setJobs] = useState([
    {
      id: '1',
      title: 'Frontend Developer',
      dept: 'Engineering',
      status: 'open',
      descri: `We are looking for enthusiastic and motivated fresh graduates or experienced developers to join our frontend team.

Responsibilities:
- Build user interfaces using React and ensure responsive design.
- Collaborate with UX/UI designers and backend developers.
- Optimize application for maximum speed and scalability.

Requirements:
- Knowledge of HTML, CSS, JavaScript, and React.
- Familiarity with version control (Git).
- Strong problem-solving and communication skills.`,
      candidates: [
        { id: 'c1', name: 'Bunny', email: 'bunnyo3@gmail.com', status: 'Applied' },
        { id: 'c7', name: 'Raju', email: 'raju@gmail.com', status: 'Interview Scheduled' },
        { id: 'c8', name: 'Nithya', email: 'nithya@gmail.com', status: 'Applied' },
        { id: 'c9', name: 'Ajay', email: 'ajay@gmail.com', status: 'Rejected' },
      ]
    },
    {
      id: '2',
      title: 'Backend Developer',
      dept: 'Engineering',
      status: 'open',
      descri: `We are seeking an experienced Backend Developer to build scalable server-side applications.

Responsibilities:
- Develop APIs, database schemas, and server-side logic.
- Ensure high performance and responsiveness.
- Collaborate with frontend developers to integrate user-facing elements.

Requirements:
- Proficiency in Node.js, Python, Java, or similar.
- Experience with databases (SQL/NoSQL) and RESTful APIs.
- Strong debugging and analytical skills.`,
      candidates: [
        { id: 'c10', name: 'Suresh', email: 'suresh@gmail.com', status: 'Applied' },
        { id: 'c11', name: 'Latha', email: 'latha@gmail.com', status: 'Interview Scheduled' },
        { id: 'c12', name: 'Kiran', email: 'kiran@gmail.com', status: 'Rejected' },
      ]
    },
    {
      id: '3',
      title: 'Data Analyst',
      dept: 'Data',
      status: 'open',
      descri: `We are looking for a Data Analyst to gather, process, and analyze business data.

Responsibilities:
- Collect and interpret data from multiple sources.
- Create reports and visualizations to support decision-making.
- Collaborate with teams to identify business opportunities.

Requirements:
- Proficiency in Excel, SQL, and data visualization tools.
- Analytical and problem-solving skills.
- Strong communication and reporting skills.`,
      candidates: [
        { id: 'c13', name: 'Vikram', email: 'vikram@gmail.com', status: 'Applied' },
        { id: 'c14', name: 'Anita', email: 'anita@gmail.com', status: 'Applied' },
      ]
    },
    {
      id: '4',
      title: 'Project Manager',
      dept: 'Management',
      status: 'open',
      descri: `We are seeking an experienced Project Manager to oversee projects from initiation to completion.

Responsibilities:
- Plan, execute, and deliver projects on time.
- Coordinate teams, resources, and stakeholders.
- Track project performance and report progress.

Requirements:
- Proven experience in project management.
- Strong leadership and organizational skills.
- Familiarity with project management tools (JIRA, Trello).`,
      candidates: [
        { id: 'c15', name: 'Ramesh', email: 'ramesh@gmail.com', status: 'Interview Scheduled' },
      ]
    },
    {
      id: '5',
      title: 'Recruiter',
      dept: 'HR',
      status: 'open',
      descri: 'Manage hiring process and coordinate interviews with candidates.',
      candidates: [
        { id: 'c2', name: 'Geetha', email: 'geetha23@gmail.com', status: 'Applied' },
        { id: 'c16', name: 'Priya', email: 'priya@gmail.com', status: 'Interview Scheduled' },
      ]
    },
  ]);

  const [openJobId, setOpenJobId] = useState(null);
  const [openCandidatesJobId, setOpenCandidatesJobId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [experienceFilter, setExperienceFilter] = useState("all"); // all | 0-2 years | 2-4 years | 4-6 years | 6+ years
  const [viewJob, setViewJob] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const listRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    dept: "",
    location: "",
    descri: "",
    status: "open",
    experience: "0-2 years",
    skills: "",
    openings: 1,
  });

  // Load jobs from localStorage if present (so public Jobspost reflects admin changes)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('jobs_public');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setJobs(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist jobs to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem('jobs_public', JSON.stringify(jobs));
    } catch {
      // ignore
    }
  }, [jobs]);

  const toggleView = (jobId) => {
    setOpenJobId(openJobId === jobId ? null : jobId);
    setOpenCandidatesJobId(null);
  };

  // ===== Skills suggestions helpers =====
  const commonSkills = [
    "React","Node.js","JavaScript","TypeScript","HTML","CSS","Tailwind","Next.js","Redux",
    "Express","Node","Python","Django","Flask","Java","Spring","SQL","PostgreSQL","MySQL",
    "MongoDB","GraphQL","AWS","Azure","GCP","Docker","Kubernetes","Git"
  ];

  const getAllSkills = () => {
    const fromJobs = jobs.flatMap((j) => Array.isArray(j.skills) ? j.skills : []);
    return Array.from(new Set([...commonSkills, ...fromJobs])).filter(Boolean);
  };

  const currentSkillsArray = () =>
    formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const currentToken = () => {
    const parts = formData.skills.split(',');
    return parts[parts.length - 1].trim();
  };

  const suggestions = (() => {
    const token = currentToken().toLowerCase();
    if (!token) return [];
    const selected = new Set(currentSkillsArray().map((s) => s.toLowerCase()));
    return getAllSkills()
      .filter((s) => s.toLowerCase().includes(token) && !selected.has(s.toLowerCase()))
      .slice(0, 8);
  })();

  const addSkillFromSuggestion = (skill) => {
    const existing = currentSkillsArray();
    if (existing.map((s) => s.toLowerCase()).includes(skill.toLowerCase())) return;
    const base = formData.skills.trim();
    const next = base ? base.replace(/[,\s]*$/, '') + ", " + skill : skill;
    setFormData((prev) => ({ ...prev, skills: next }));
  };

  const toggleCandidates = (jobId) => {
    // deprecated: candidates view removed
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addNewJob = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dept) {
      alert("Please enter Job Title and Department.");
      return;
    }
    const payload = {
      title: formData.title,
      dept: formData.dept,
      location: formData.location,
      status: formData.status,
      descri: formData.descri,
      experience: formData.experience,
      skills: formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      openings: Number(formData.openings) || 1,
    };
    if (editingJobId) {
      setJobs((prev) => prev.map((j) => (j.id === editingJobId ? { ...j, ...payload } : j)));
    } else {
      const newJob = {
        id: Date.now().toString(),
        ...payload,
        candidates: [],
      };
      // Put the new job at the top so it is immediately visible
      setJobs((prev) => [newJob, ...prev]);
    }
    setFormData({ title: "", dept: "", location: "", descri: "", status: "open", experience: "0-2 years", skills: "", openings: 1 });
    setShowForm(false);
    setEditingJobId(null);
    // Reset search and filter so the newly added job is visible
    setSearchQuery("");
    setExperienceFilter("all");
  };

  const openEdit = (job) => {
    setFormData({
      title: job.title || "",
      dept: job.dept || "",
      location: job.location || "",
      descri: job.descri || "",
      status: job.status || "open",
      experience: job.experience || "0-2 years",
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || ""),
      openings: typeof job.openings === 'number' ? job.openings : 1,
    });
    setEditingJobId(job.id);
    setShowForm(true);
  };

  const deleteJob = (jobId) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
    if (openJobId === jobId) setOpenJobId(null);
    if (openCandidatesJobId === jobId) setOpenCandidatesJobId(null);

    setSuccessMsg("✅ Job deleted successfully!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const buttonClass = "px-2 py-1 rounded bg-sky-600 text-white text-sm hover:bg-sky-700";

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.trim().toLowerCase();
    const qOk = !q || job.title.toLowerCase().includes(q) || job.dept.toLowerCase().includes(q);
    const exp = (job.experience || "").toLowerCase();
    const ef = experienceFilter.toLowerCase();
    const expOk = experienceFilter === "all" || exp === ef;
    return qOk && expOk;
  });

  return (
    <section className="bg-white p-6 rounded-xl shadow-md text-center">
      {/* Header with Search + Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 text-left">
        <h1 className="text-gray-900 text-2xl font-bold">Jobs</h1>

        <div className="flex items-center gap-2 relative">
          {/* Search icon with popover and suggestions */}
          <button
            type="button"
            onClick={() => setShowSearch((v) => !v)}
            className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 shadow"
            aria-label="Search"
            title="Search"
          >
            <FaSearch className="w-4 h-4" />
          </button>
          {showSearch && (
            <div className="absolute right-36 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-72">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search job title/department"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              {(() => {
                const titles = Array.from(new Set(jobs.map(j => j.title)));
                const depts = Array.from(new Set(jobs.map(j => j.dept)));
                const q = searchQuery.trim().toLowerCase();
                const titleMatches = (q ? titles.filter(t => t.toLowerCase().includes(q)) : titles).slice(0, 6);
                const deptMatches = (q ? depts.filter(d => d.toLowerCase().includes(q)) : depts).slice(0, 6);
                const items = [
                  { key: '__all__', label: 'All', value: '' },
                  ...titleMatches.map(t => ({ key: `t-${t}`, label: t, value: t })),
                  ...deptMatches.map(d => ({ key: `d-${d}`, label: d, value: d })),
                ];
                return items.length ? (
                  <ul className="mt-2 max-h-56 overflow-y-auto border border-gray-200 rounded divide-y divide-gray-100">
                    {items.map((it) => (
                      <li key={it.key}>
                        <button
                          type="button"
                          onClick={() => { setSearchQuery(it.value); setShowSearch(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-slate-800"
                        >
                          {it.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null;
              })()}
              <div className="mt-2 flex items-center justify-end gap-2">
                <button onClick={() => setSearchQuery("")} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Clear</button>
                <button onClick={() => setShowSearch(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}

      {/* View modal */}
      {viewJob && (
        <div className="fixed inset-0 z-50">
          <button className="absolute inset-0 bg-black/30" aria-label="Close" onClick={() => setViewJob(null)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-[96%] max-w-3xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Job Details</h3>
              <button onClick={() => setViewJob(null)} className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm">Close</button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-xs text-slate-500">Job Title</div>
                <div className="font-medium text-slate-900">{viewJob.title}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Department</div>
                <div className="font-medium text-slate-900">{viewJob.dept}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Location</div>
                <div className="font-medium text-slate-900">{viewJob.location || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Status</div>
                <div className="font-medium text-slate-900 capitalize">{viewJob.status}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Experience</div>
                <div className="font-medium text-slate-900">{viewJob.experience || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Number of Posts</div>
                <div className="font-medium text-slate-900">{typeof viewJob.openings === 'number' ? viewJob.openings : '-'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-slate-500">Skills</div>
                {Array.isArray(viewJob.skills) && viewJob.skills.length ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {viewJob.skills.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 text-[11px] rounded-full bg-sky-100 text-sky-700 border border-sky-200">{sk}</span>
                    ))}
                  </div>
                ) : (
                  <div className="font-medium text-slate-900">-</div>
                )}
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-slate-500">Description</div>
                <div className="mt-1 p-3 rounded border bg-gray-50 text-slate-800 whitespace-pre-line max-h-60 overflow-y-auto">{viewJob.descri}</div>
              </div>
            </div>
          </div>
        </div>
      )}

          {/* Filter popover */}
          <button
            type="button"
            onClick={() => setShowFilter((v) => !v)}
            className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 shadow"
            aria-label="Filter"
            title="Filter"
          >
            <FaFilter className="w-4 h-4" />
          </button>
          {showFilter && (
            <div className="absolute right-20 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-3 w-72">
              <div className="text-xs text-gray-600 mb-2">Filter by Experience</div>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="all">All</option>
                <option value="0-2 years">0-2 years</option>
                <option value="2-4 years">2-4 years</option>
                <option value="4-6 years">4-6 years</option>
                <option value="6+ years">6+ years</option>
              </select>
              <div className="mt-2 flex items-center justify-end gap-2">
                <button onClick={() => setExperienceFilter('all')} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Reset</button>
                <button onClick={() => setShowFilter(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowForm(true)}
            title="New Job"
            aria-label="New Job"
            className="w-10 h-10 grid place-items-center rounded-full bg-sky-600 text-white shadow hover:bg-sky-700 transition transform hover:scale-110 active:scale-95"
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Job posts section (scrollable) */}
      <div ref={listRef} className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {successMsg && <div className="text-green-600 font-medium">{successMsg}</div>}

        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <li key={job.id} className="list-none border rounded p-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{job.title}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewJob(job)}
                    title="View"
                    aria-label="View"
                    className="w-9 h-9 grid place-items-center rounded-full bg-blue-500 text-white shadow hover:bg-blue-600 transition transform hover:scale-110 active:scale-95"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEdit(job)}
                    title="Edit"
                    aria-label="Edit"
                    className="w-9 h-9 grid place-items-center rounded-full bg-amber-500 text-white shadow hover:bg-amber-600 transition transform hover:scale-110 active:scale-95"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    title="Delete"
                    aria-label="Delete"
                    className="w-9 h-9 grid place-items-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition transform hover:scale-110 active:scale-95"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {openJobId === job.id && (
                <div className="mt-2 p-2 bg-white rounded border whitespace-pre-line text-gray-800">{job.descri}</div>
              )}

              {openCandidatesJobId === job.id && (
                <ul className="mt-2 p-2 bg-white rounded border space-y-1 text-gray-800">
                  {job.candidates.length > 0 ? (
                    job.candidates.map((c) => (
                      <li key={c.id} className="text-sm border-b pb-1">
                        <div><strong>{c.name}</strong> ({c.email})</div>
                        <div>Status: {c.status}</div>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">No candidates applied yet.</li>
                  )}
                </ul>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No jobs found.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">{editingJobId ? 'Edit Job' : 'Add New Job'}</h3>
            </div>
            <form onSubmit={addNewJob} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <input
                  type="text"
                  name="dept"
                  value={formData.dept}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder="e.g., Engineering"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  list="job-location-suggestions"
                  className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder="e.g., Bengaluru, Remote"
                />
                <datalist id="job-location-suggestions">
                  <option value="Bengaluru" />
                  <option value="Hyderabad" />
                  <option value="Chennai" />
                  <option value="Mumbai" />
                  <option value="Pune" />
                  <option value="Delhi NCR" />
                  <option value="Remote" />
                  <option value="Hybrid" />
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Number of Posts</label>
                <input
                  type="number"
                  name="openings"
                  min={1}
                  value={formData.openings}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option>0-2 years</option>
                  <option>2-4 years</option>
                  <option>4-6 years</option>
                  <option>6+ years</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  placeholder="e.g., React, Node.js, SQL"
                />
                {suggestions.length > 0 && (
                  <div className="mt-2 p-2 border rounded bg-gray-50">
                    <div className="text-xs text-slate-500 mb-1">Suggestions</div>
                    <div className="flex flex-wrap gap-1">
                      {suggestions.map((sk) => (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => addSkillFromSuggestion(sk)}
                          className="px-2 py-0.5 text-[11px] rounded-full bg-sky-100 text-sky-700 border border-sky-200 hover:bg-sky-200"
                          title="Add skill"
                        >
                          {sk}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!!formData.skills.trim() && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {formData.skills.split(',').map((s, i) => (
                      <span key={i} className="px-2 py-0.5 text-[11px] rounded-full bg-gray-100 text-gray-700 border">{s.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  name="descri"
                  value={formData.descri}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  rows={4}
                  placeholder="Describe responsibilities and requirements"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded bg-gray-400 text-white">Cancel</button>
                <button type="submit" className={buttonClass}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}