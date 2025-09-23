import { useState } from "react";

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
      descri:'Manage hiring process and coordinate interviews with candidates.',
      candidates: [
        { id: 'c2', name: 'Geetha', email: 'geetha23@gmail.com', status: 'Applied' },
        { id: 'c16', name: 'Priya', email: 'priya@gmail.com', status: 'Interview Scheduled' },
      ]
    },
  ]);

  const [openJobId, setOpenJobId] = useState(null);
  const [openCandidatesJobId, setOpenCandidatesJobId] = useState(null);

  const toggleView = (jobId) => {
    setOpenJobId(openJobId === jobId ? null : jobId);
    setOpenCandidatesJobId(null);
  };
  const toggleCandidates = (jobId) => {
    setOpenCandidatesJobId(openCandidatesJobId === jobId ? null : jobId);
    setOpenJobId(null);
  };

  const addNewJob = () => {
    const title = prompt("Enter job title:");
    const dept = prompt("Enter department:");
    const descri = prompt("Enter description:");

    if (!title?.trim() || !dept?.trim() || !descri?.trim()) {
      alert("Please provide all job details!");
      return;
    }

    const newJob = {
      id: (jobs.length + 1).toString(),
      title,
      dept,
      status: 'open',
      descri,
      candidates: [],
    };
    setJobs([...jobs, newJob]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Job Posts</h2>
        <button 
          onClick={addNewJob}
          className="px-3 py-2 rounded bg-sky-600 text-white text-sm"
        >
          New Job
        </button>
      </div>

      <ul className="space-y-2">
        {jobs.map(job => (
          <li key={job.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{job.title}</div>
                <div className="text-sm text-gray-600">{job.dept} • {job.status}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleView(job.id)}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => toggleCandidates(job.id)}
                  className="px-3 py-1.5 rounded border text-sm"
                >
                  Candidates
                </button>
              </div>
            </div>

            {openJobId === job.id && (
              <div className="mt-2 p-2 bg-gray-50 rounded border whitespace-pre-line">
                {job.descri}
              </div>
            )}

            {openCandidatesJobId === job.id && (
              <ul className="mt-2 p-2 bg-gray-50 rounded border space-y-1">
                {job.candidates.length > 0 ? (
                  job.candidates.map(c => (
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
        ))}
      </ul>
    </div>
  );
}
