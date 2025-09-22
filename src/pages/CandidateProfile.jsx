export default function CandidateProfile() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Candidate Profile</h2>
        <div className="space-y-2 text-sm">
          <div><span className="text-gray-600">Name:</span> Jane Doe</div>
          <div><span className="text-gray-600">Email:</span> jane@example.com</div>
          <div><span className="text-gray-600">Phone:</span> +1 555-1234</div>
          <div><span className="text-gray-600">Status:</span> interview</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-medium mb-2">Actions</h3>
        <div className="flex flex-col gap-2">
          <button className="px-3 py-2 rounded bg-sky-600 text-white text-sm">Schedule Interview</button>
          <button className="px-3 py-2 rounded border text-sm">Upload Resume</button>
        </div>
      </div>
    </div>
  )
}
