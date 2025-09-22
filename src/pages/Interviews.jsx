const interviews = [
  { id: 1, candidate: 'Jane Doe', when: '2025-09-23 10:00', mode: 'online', interviewer: 'John' },
  { id: 2, candidate: 'Mark Lee', when: '2025-09-24 15:30', mode: 'in-person', interviewer: 'Sara' },
]

export default function Interviews() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Interviews</h2>
        <button className="px-3 py-2 rounded bg-sky-600 text-white text-sm">New Interview</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Candidate</th>
              <th className="p-2">When</th>
              <th className="p-2">Mode</th>
              <th className="p-2">Interviewer</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map(i => (
              <tr key={i.id} className="border-t">
                <td className="p-2">{i.candidate}</td>
                <td className="p-2">{i.when}</td>
                <td className="p-2">{i.mode}</td>
                <td className="p-2">{i.interviewer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
