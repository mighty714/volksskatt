const offers = [
  { id: 1, candidate: 'Jane Doe', job: 'Frontend Engineer', status: 'sent' },
  { id: 2, candidate: 'Mark Lee', job: 'Recruiter', status: 'draft' },
]

export default function Offers() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Offers</h2>
        <button className="px-3 py-2 rounded bg-sky-600 text-white text-sm">New Offer</button>
      </div>
      <ul className="space-y-2">
        {offers.map(o => (
          <li key={o.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{o.candidate}</div>
              <div className="text-sm text-gray-600">{o.job} • {o.status}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded border text-sm">View</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
