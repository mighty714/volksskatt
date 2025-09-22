const docs = [
  { id: 1, owner: 'user: 7d9...', type: 'id_proof', file: 'id.pdf' },
  { id: 2, owner: 'candidate: 9a2...', type: 'resume', file: 'jane_resume.pdf' },
]

export default function Documents() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Documents</h2>
        <button className="px-3 py-2 rounded bg-sky-600 text-white text-sm">Upload</button>
      </div>
      <ul className="space-y-2">
        {docs.map(d => (
          <li key={d.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.file}</div>
              <div className="text-sm text-gray-600">{d.type} • {d.owner}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded border text-sm">Download</button>
              <button className="px-3 py-1.5 rounded border text-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
