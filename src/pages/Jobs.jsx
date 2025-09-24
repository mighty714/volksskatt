import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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

  const [formData, setFormData] = useState({
    title: "",
    dept: "",
    descri: "",
  });

  const toggleView = (jobId) => {
    setOpenJobId(openJobId === jobId ? null : jobId);
    setOpenCandidatesJobId(null);
  };

  const toggleCandidates = (jobId) => {
    setOpenCandidatesJobId(openCandidatesJobId === jobId ? null : jobId);
    setOpenJobId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addNewJob = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dept || !formData.descri) {
      alert("Please fill all fields!");
      return;
    }
    const newJob = {
      id: Date.now().toString(),
      title: formData.title,
      dept: formData.dept,
      status: "open",
      descri: formData.descri,
      candidates: [],
    };
    setJobs([...jobs, newJob]);
    setFormData({ title: "", dept: "", descri: "" });
    setShowForm(false);
  };

  const deleteJob = (jobId) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
    if (openJobId === jobId) setOpenJobId(null);
    if (openCandidatesJobId === jobId) setOpenCandidatesJobId(null);

    setSuccessMsg("✅ Job deleted successfully!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const buttonClass = "px-3 py-1.5 rounded bg-sky-600 text-white text-sm hover:bg-sky-700";

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      job.title.toLowerCase().includes(query) ||
      job.dept.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Header without box */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-gray-900 text-3xl font-bold">Jobs</h1>

        <div className="flex gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-2 top-1.5 text-gray-400 pointer-events-none" />
          </div>

          <button onClick={() => setShowForm(true)} className={buttonClass}>
            + New Job
          </button>
        </div>
      </div>

      {/* Job posts section */}
      <div className="space-y-2">
        {successMsg && <div className="text-green-600 font-medium">{successMsg}</div>}

        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <li key={job.id} className="list-none border rounded p-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-700">{job.dept} • {job.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleView(job.id)} className={buttonClass}>View</button>
                  <button onClick={() => toggleCandidates(job.id)} className={buttonClass}>Candidates</button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700 flex items-center gap-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Job</h3>
            <form onSubmit={addNewJob} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
              <input
                type="text"
                name="dept"
                placeholder="Department"
                value={formData.dept}
                onChange={handleFormChange}
                className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
              <textarea
                name="descri"
                placeholder="Description"
                value={formData.descri}
                onChange={handleFormChange}
                className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded bg-gray-400 text-white">Cancel</button>
                <button type="submit" className={buttonClass}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
