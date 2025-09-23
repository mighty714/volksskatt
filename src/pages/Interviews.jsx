// Interviews.tsx
import { formatDate } from "./utils/dateUtils";

const interviews = [
  { id: 1, candidate: "Jane Doe", schedule: "2025-09-23 10:00", mode: "online", interviewer: "John" },
  { id: 2, candidate: "Mark Lee", schedule: "2025-09-24 15:30", mode: "in-person", interviewer: "Sara" },
];

export default function Interviews() {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <header className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Interviews</h2>
        <button
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 transition text-white text-sm font-medium rounded"
          aria-label="Schedule a new interview"
        >
          + New Interview
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="p-3 font-medium">Candidate</th>
              <th className="p-3 font-medium">Schedule</th>
              <th className="p-3 font-medium">Mode</th>
              <th className="p-3 font-medium">Interviewer</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map(({ id, candidate, schedule, mode, interviewer }) => (
              <tr key={id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-gray-800">{candidate}</td>
                <td className="p-3 text-gray-700">{formatDate(schedule)}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                      ${mode === "online"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {mode}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{interviewer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
