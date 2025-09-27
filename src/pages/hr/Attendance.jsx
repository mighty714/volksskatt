import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaFileCsv } from "react-icons/fa";

export default function Attendance({ sourceKey = 'attendance_hr' }) {
  const [rows, setRows] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | today | active | lunch | out
  const [dataKey, setDataKey] = useState(sourceKey); // 'attendance_hr' | 'attendance_emp'

  useEffect(() => {
    try {
      const primary = JSON.parse(localStorage.getItem(dataKey) || "[]");
      if (dataKey === 'attendance_hr') {
        // HR must NOT see HR/Admin entries via legacy fallback
        setRows(Array.isArray(primary) ? primary : []);
      } else {
        // For other views (e.g., Admin), retain legacy fallback for compatibility
        const legacy = JSON.parse(localStorage.getItem("attendanceRows") || "[]");
        const merged = Array.isArray(primary) && primary.length ? primary : legacy;
        setRows(Array.isArray(merged) ? merged : []);
      }
    } catch {
      setRows([]);
    }
  }, [dataKey]);

  const exportCsv = () => {""
    if (!rows.length) return;
    const headers = ["EmpId,EmpName,Role,Date,Clock In,Lunch Start,Lunch End,Clock Out,Hours,Status"];
    const csvRows = rows.map((r) => [
      r.empId,
      r.empName,
      r.empRole || '',
      r.date,
      r.in || "-",
      r.lunchStart || "-",
      r.lunchEnd || "-",
      r.out || "-",
      r.hours || "-",
      r.status || "-",
      
    ].join(","));
    const csv = [...headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
  };

  // Helpers for filtering
  const formatDate = (date) => date.toLocaleDateString("en-GB");
  const todayDate = formatDate(new Date());

  const displayedRows = rows.filter((r) => {
    const statusOk =
      statusFilter === "all" ||
      (statusFilter === "today" && r.date === todayDate) ||
      (statusFilter === "active" && r.status === "Active") ||
      (statusFilter === "lunch" && r.status === "On Lunch") ||
      (statusFilter === "out" && r.status === "Logged Out");
    if (!statusOk) return false;

    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return [
      r.empId,
      r.empName,
      r.empRole,
      r.date,
      r.in,
      r.lunchStart,
      r.lunchEnd,
      r.out,
      r.hours,
      r.status,
    ]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(q));
  });

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Attendance</h2>
        <div className="flex items-center gap-2 relative">
          {/* Dataset selector: HR vs Employee */}
          <select
            value={dataKey}
            onChange={(e) => setDataKey(e.target.value)}
            className="h-10 px-3 rounded-md border border-gray-300 bg-white text-slate-800 shadow text-sm"
            aria-label="Select dataset"
            title="Select dataset"
          >
            <option value="attendance_hr">HR Records</option>
            <option value="attendance_emp">Employee Records</option>
          </select>
          <button
            type="button"
            title="Search"
            aria-label="Search"
            onClick={() => setShowSearch((v) => !v)}
            className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 shadow"
          >
            <FaSearch className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Filter"
            aria-label="Filter"
            onClick={() => setShowFilter((v) => !v)}
            className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 shadow"
          >
            <FaFilter className="w-4 h-4" />
          </button>
          <button
            onClick={exportCsv}
            title="Export CSV"
            aria-label="Export CSV"
            className="w-10 h-10 grid place-items-center rounded-full bg-blue-700 text-white shadow hover:bg-blue-800 transition transform hover:scale-110 active:scale-95 disabled:opacity-50"
            disabled={!rows.length}
          >
            <FaFileCsv className="w-4 h-4" />
          </button>

          {/* Search popover */}
          {showSearch && (
            <div className="absolute right-28 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-64 animate-pop-bounce">
              <div className="text-xs text-gray-600 mb-1">Search Here</div>
              <input
                autoFocus
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type to search (date, time, status)"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                <button onClick={() => setSearchText("")} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Clear</button>
                <button onClick={() => setShowSearch(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}

          {/* Filter popover */}
          {showFilter && (
            <div className="absolute right-14 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-56 animate-pop-bounce">
              <div className="text-xs text-gray-600 mb-2">Quick filters</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button onClick={() => setStatusFilter("all")} className={`px-2 py-1 rounded border ${statusFilter==='all' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>All</button>
                <button onClick={() => setStatusFilter("today")} className={`px-2 py-1 rounded border ${statusFilter==='today' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>Today</button>
                <button onClick={() => setStatusFilter("active")} className={`px-2 py-1 rounded border ${statusFilter==='active' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>Active</button>
                <button onClick={() => setStatusFilter("lunch")} className={`px-2 py-1 rounded border ${statusFilter==='lunch' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>On Lunch</button>
                <button onClick={() => setStatusFilter("out")} className={`px-2 py-1 rounded border col-span-2 ${statusFilter==='out' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>Logged Out</button>
              </div>
              <div className="mt-2 flex items-center justify-end gap-2">
                <button onClick={() => setStatusFilter('all')} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Reset</button>
                <button onClick={() => setShowFilter(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto rounded-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-sky-50 text-left text-slate-700 border-b border-sky-100">
              <th className="p-3 font-medium sticky top-0 bg-sky-50">EmpId</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">EmpName</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Role</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Date</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Clock In</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Lunch Start</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Lunch End</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Clock Out</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Hours</th>
              <th className="p-3 font-medium text-center sticky top-0 bg-sky-50">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.length > 0 ? (
              displayedRows.map((r) => {
                const badge = r.status === 'Logged Out'
                  ? 'bg-green-100 text-green-700'
                  : r.status === 'On Lunch'
                    ? 'bg-sky-100 text-sky-700'
                    : r.status === 'Active'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700';
                return (
                  <tr key={r.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3 text-black">{r.empId}</td>
                    <td className="p-3 text-black">{r.empName}</td>
                    <td className="p-3 text-black">{r.date}</td>
                    <td className="p-3 text-black">{r.in || '-'}</td>
                    <td className="p-3 text-black">{r.lunchStart || '-'}</td>
                    <td className="p-3 text-black">{r.lunchEnd || '-'}</td>
                    <td className="p-3 text-black">{r.out || '-'}</td>
                    <td className="p-3 text-black">{r.hours || '-'}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${badge}`}>{r.status || '-'}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">{rows.length ? 'No results match your search/filter.' : 'No attendance records yet.'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
