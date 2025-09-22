const rows = [
  { id: 1, date: '2025-09-20', in: '09:10', out: '18:02', hours: '8:12' },
  { id: 2, date: '2025-09-21', in: '09:06', out: '18:11', hours: '8:25' },
]

export default function Attendance() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Attendance</h2>
        <button className="px-3 py-2 rounded bg-gray-900 text-white text-sm">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Date</th>
              <th className="p-2">Clock In</th>
              <th className="p-2">Clock Out</th>
              <th className="p-2">Hours</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.in}</td>
                <td className="p-2">{r.out}</td>
                <td className="p-2">{r.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
