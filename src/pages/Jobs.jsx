const jobs = [
  { id: '1', title: 'Frontend Engineer', dept: 'Engineering', status: 'open' },
  { id: '2', title: 'Recruiter', dept: 'HR', status: 'open' },
]

export default function Jobs() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Job Posts</h2>
        <button className="px-3 py-2 rounded bg-sky-600 text-white text-sm">New Job</button>
      </div>
      <ul className="space-y-2">
        {jobs.map(j => (
          <li key={j.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{j.title}</div>
              <div className="text-sm text-gray-600">{j.dept} • {j.status}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded border text-sm">View</button>
              <button className="px-3 py-1.5 rounded border text-sm">Candidates</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
