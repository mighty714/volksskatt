import { useMemo, useState } from 'react';

// Sample attendance data
const rows = [
  { id: 1, date: '2025-09-20', in: '09:10', out: '18:02' },
  { id: 2, date: '2025-09-21', in: '09:06', out: '18:11' },
  { id: 3, date: '2025-09-22' },
  { id: 4, date: '2025-09-23', in: '08:55' },
  { id: 5, date: '2025-10-02', in: '09:05', out: '17:45' },
  { id: 6, date: '2025-10-03' },
];

// Format date to YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

// Generate all dates in the specified month
const getAllDatesInMonth = (year, month) => {
  const dates = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    dates.push(formatDate(new Date(date)));
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

// Calculate total hours worked
const calculateHours = (inTime, outTime) => {
  if (!inTime || !outTime) return '-';
  const [inH, inM] = inTime.split(':').map(Number);
  const [outH, outM] = outTime.split(':').map(Number);

  let minutes = (outH * 60 + outM) - (inH * 60 + inM);
  if (minutes < 0) return '-';

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
};

export default function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState('2025-09');

  const [year, month] = selectedMonth.split('-').map(Number);

  const allDates = useMemo(() => getAllDatesInMonth(year, month - 1), [selectedMonth]);

  const dateMap = useMemo(() => {
    const map = {};
    for (const row of rows) {
      const rowMonth = row.date.slice(0, 7); // 'YYYY-MM'
      if (rowMonth === selectedMonth) {
        map[row.date] = row;
      }
    }
    return map;
  }, [selectedMonth]);

  // Export to CSV
  const handleExportCSV = () => {
    const csvHeader = ['Date', 'Clock In', 'Clock Out', 'Hours'];
    const csvRows = allDates.map((dateStr) => {
      const record = dateMap[dateStr];
      const inTime = record?.in ?? '-';
      const outTime = record?.in && record?.out ? record.out : '-';
      const hours =
        record?.in && record?.out
          ? calculateHours(record.in, record.out)
          : '-';
      return [dateStr, inTime, outTime, hours];
    });

    const csvContent = [csvHeader, ...csvRows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const monthNames = {
    '2025-09': 'September 2025',
    '2025-10': 'October 2025',
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Report</h1>
          <p className="text-sm text-gray-500">{monthNames[selectedMonth]}</p>
        </div>

        <div className="flex gap-2">
          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="2025-09">September 2025</option>
            <option value="2025-10">October 2025</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="sticky top-0 bg-sky-100 z-10 shadow-sm">
              <tr className="text-left font-semibold border-b border-gray-300">
                <th className="p-3 border border-gray-300">Date</th>
                <th className="p-3 border border-gray-300">Clock In</th>
                <th className="p-3 border border-gray-300">Clock Out</th>
                <th className="p-3 border border-gray-300">Hours</th>
              </tr>
            </thead>
            <tbody>
              {allDates.map((dateStr, index) => {
                const record = dateMap[dateStr];
                const inTime = record?.in ?? '-';
                const outTime = record?.in && record?.out ? record.out : '-';
                const hours =
                  record?.in && record?.out
                    ? calculateHours(record.in, record.out)
                    : '-';

                return (
                  <tr
                    key={dateStr}
                    className={`border-t border-gray-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-3 border border-gray-300">{dateStr}</td>
                    <td className="p-3 border border-gray-300">{inTime}</td>
                    <td className="p-3 border border-gray-300">{outTime}</td>
                    <td className="p-3 border border-gray-300">{hours}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
