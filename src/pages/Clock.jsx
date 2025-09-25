import { useState, useEffect } from "react";
import { FaSignInAlt, FaSignOutAlt, FaUtensils, FaFileCsv, FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "Your only limit is your mind.",
  "Discipline beats motivation every single day.",
  "Small progress each day adds up to big results.",
  "Dream big, work hard, stay focused.",
  "Consistency is the key to success.",
  "Don’t watch the clock; do what it does — keep going. – Sam Levenson",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
  "Productivity is never an accident. It is always the result of a commitment to excellence. – Paul J. Meyer",
  "Great companies are built on great people. – Elon Musk",
  "Take care of your employees and they’ll take care of your business. – Richard Branson",
];

// Minimum required work duration before Logout (in minutes)
// Change this to 480 for 8 hours in production; currently settable for testing
const MIN_REQUIRED_MINUTES = 1;

// Helper to detect device type
const getDeviceType = () => {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(ua)
      ? "Mobile"
      : "Laptop/Desktop";
  } catch {
    return "Laptop/Desktop";
  }
};

export default function ClockDashboard() {
  const [rows, setRows] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentLunchTaken, setCurrentLunchTaken] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(new Date().getDate() % quotes.length);
  const [toast, setToast] = useState(null); // toast message
  const [toastVariant, setToastVariant] = useState("success"); // success | error
  const [lunchCompleted, setLunchCompleted] = useState(false); // once lunch start+end taken
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | lunch | out | today
  const [empIdInput, setEmpIdInput] = useState("");
  const [empNameInput, setEmpNameInput] = useState("");
  const [lastSavedAttendance, setLastSavedAttendance] = useState(null);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Quote rotation every 10 seconds for testing
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  const dailyQuote = quotes[quoteIndex];

  const formatDate = (date) => date.toLocaleDateString("en-GB");
  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true });

  const calculateMinutes = (r) => {
    if (!r.outRaw || !r.inRaw) return 0;
    let diff = (r.outRaw - r.inRaw) / 60000;
    if (r.lunchStartRaw && r.lunchEndRaw) diff -= (r.lunchEndRaw - r.lunchStartRaw) / 60000;
    return diff;
  };

  const formatHours = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  // Precise worked milliseconds excluding lunch (handles ongoing lunch too)
  const getWorkedMs = (r, now) => {
    if (!r?.inRaw) return 0;
    const out = now.getTime();
    let ms = out - r.inRaw;
    if (r.lunchStartRaw) {
      const lunchEnd = r.lunchEndRaw || out;
      ms -= Math.max(0, lunchEnd - r.lunchStartRaw);
    }
    return Math.max(0, ms);
  };

  const formatDuration = (ms) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(" ");
  };

  // Derive a simple status for each row based on timestamps
  const getStatus = (r) => {
    if (r.outRaw) return "Logged Out";
    if (r.lunchStartRaw && !r.lunchEndRaw) return "On Lunch";
    if (r.inRaw) return "Active";
    return "-";
  };

  // Persist a completed attendance row into localStorage for Attendance page
  const appendAttendance = (r) => {
    try {
      const key = "attendanceRows";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      const rec = {
        id: Date.now(),
        empId: r.empId || "-",
        empName: r.empName || "-",
        date: r.date,
        in: r.clockIn,
        out: r.clockOut,
        lunchStart: r.lunchStart || "-",
        lunchEnd: r.lunchEnd || "-",
        device: r.device || "-",
        hours: r.hours,
        status: getStatus(r),
        remarks: r.remarks || "-",
      };
      localStorage.setItem(key, JSON.stringify([...prev, rec]));
      return rec;
    } catch (e) {
      // non-blocking
      console.error("Failed to save attendance", e);
    }
  };

  const handleLogin = () => {
    if (!window.confirm("Are you sure you want to Login?")) {
      setToastVariant("error");
      setToast("Login cancelled");
      return;
    }
    const now = new Date();
    const deviceType = getDeviceType();
    setRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        empId: empIdInput.trim() || "-",
        empName: empNameInput.trim() || "-",
        date: formatDate(now),
        device: deviceType,
        clockIn: formatTime(now),
        inRaw: now.getTime(),
        lunchStart: "-",
        lunchStartRaw: null,
        lunchEnd: "-",
        lunchEndRaw: null,
        clockOut: "-",
        outRaw: null,
        hours: "-",
        remarks: "",
      },
    ]);
    setLoggedIn(true);
    setCurrentLunchTaken(false);
    setLunchCompleted(false);
    setToastVariant("success");
    setToast("✅ Login Successful");
  };

  const handleLunchStart = () => {
    if (!window.confirm("Are you sure you want to take Lunch Break?")) return;
    const now = new Date();
    const updated = [...rows];
    const last = updated[updated.length - 1];
    last.lunchStart = formatTime(now);
    last.lunchStartRaw = now.getTime();
    setRows(updated);
    setCurrentLunchTaken(true);
  };

  const handleLunchEnd = () => {
    if (!window.confirm("Are you sure you want to End Lunch Break?")) return;
    const now = new Date();
    const updated = [...rows];
    const last = updated[updated.length - 1];
    last.lunchEnd = formatTime(now);
    last.lunchEndRaw = now.getTime();
    setRows(updated);
    setCurrentLunchTaken(false);
    setLunchCompleted(true);
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to Logout?")) return;
    const now = new Date();
    const updated = [...rows];
    const last = updated[updated.length - 1];
    // Enforce minimum minutes excluding lunch (precise to the second)
    const targetMs = MIN_REQUIRED_MINUTES * 60 * 1000;
    const workedMs = getWorkedMs(last, now);
    if (workedMs < targetMs) {
      setToastVariant("error");
      const remainingMs = targetMs - workedMs;
      setToast(`⏰ ${MIN_REQUIRED_MINUTES} minute(s) not completed. Remaining: ${formatDuration(remainingMs)}`);
      return;
    }
    last.clockOut = formatTime(now);
    last.outRaw = now.getTime();
    last.hours = formatHours(calculateMinutes(last));
    setRows(updated);
    // Save to attendance store and show confirmation panel
    const saved = appendAttendance(last);
    if (saved) {
      setLastSavedAttendance(saved);
      // auto-hide after 8s
      setTimeout(() => setLastSavedAttendance(null), 8000);
    }
    setLoggedIn(false);
    setCurrentLunchTaken(false);
    setLunchCompleted(false);
    setToastVariant("success");
    setToast("👋 Logout Successful");
  };

  const handleExport = () => {
    if (!window.confirm("Are you sure you want to Export CSV?")) return;
    const headers = [
      "Emp ID,Emp Name,Date,Clock In,Lunch Start,Lunch End,Clock Out,Hours,Status",
    ];
    const csvRows = rows.map((r) =>
      [
        "-", // Emp ID placeholder
        "-", // Emp Name placeholder
        r.date,
        r.clockIn,
        r.lunchStart,
        r.lunchEnd,
        r.clockOut,
        r.hours,
        getStatus(r),
      ].join(",")
    );
    const csv = [...headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clock.csv";
    a.click();
  };

  const handleRemarkChange = (id, value) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, remarks: value } : r)));
  };

  const totalMinutes = rows.reduce((sum, r) => sum + calculateMinutes(r), 0);
  const totalHoursStr = formatHours(totalMinutes);
  const averageMinutes = rows.length ? totalMinutes / rows.length : 0;
  const averageHoursStr = formatHours(averageMinutes);
  const todayDate = formatDate(new Date());

  // Toast styling/animation based on variant
  const toastBgClass = toastVariant === "error" ? "bg-red-600" : "bg-green-600";
  const toastMotionProps =
    toastVariant === "error"
      ? {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] },
          exit: { opacity: 0, x: 50 },
          transition: { duration: 0.6 },
        }
      : {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 },
          transition: { duration: 0.4 },
        };

  // Apply search and filter to rows
  const displayedRows = rows.filter((r) => {
    // Status filter
    const status = getStatus(r);
    const statusOk =
      statusFilter === "all" ||
      (statusFilter === "active" && status === "Active") ||
      (statusFilter === "lunch" && status === "On Lunch") ||
      (statusFilter === "out" && status === "Logged Out") ||
      (statusFilter === "today" && r.date === todayDate);

    if (!statusOk) return false;

    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    // Search across visible columns
    return [
      r.date,
      r.clockIn,
      r.lunchStart,
      r.lunchEnd,
      r.clockOut,
      r.hours,
      status,
    ]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(q));
  });

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            {...toastMotionProps}
            className={`fixed top-5 right-5 ${toastBgClass} text-white px-4 py-2 rounded-lg shadow-lg z-50`}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-semibold mb-4 text-black text-left">Clock Dashboard</h1>

      {/* Daily Motivational Quote */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm"
        >
          <p className="text-black italic text-center">💡 {dailyQuote}</p>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex gap-3 items-center">
          {!loggedIn ? (
            <button onClick={handleLogin} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-500 transition transform hover:scale-105">
              <FaSignInAlt /> Login
            </button>
          ) : (
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full shadow hover:bg-red-500 transition transform hover:scale-105">
              <FaSignOutAlt /> Logout
            </button>
          )}

          {loggedIn && !currentLunchTaken && !lunchCompleted && (
            <button onClick={handleLunchStart} className="flex items-start gap-2 px-6 py-3 bg-yellow-400 text-white rounded-full shadow hover:bg-yellow-300 transition transform hover:scale-105">
              <FaUtensils /> Lunch Start
            </button>
          )}
          {loggedIn && currentLunchTaken && !lunchCompleted && (
            <button onClick={handleLunchEnd} className="flex items-start gap-2 px-6 py-3 bg-orange-400 text-white rounded-full shadow hover:bg-orange-300 transition transform hover:scale-105">
              <FaUtensils /> Lunch End
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 relative">
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
            onClick={handleExport}
            title="Export CSV"
            aria-label="Export CSV"
            className="w-10 h-10 grid place-items-center rounded-full bg-blue-700 text-white shadow hover:bg-blue-800 transition transform hover:scale-110 active:scale-95"
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

      {/* Last saved attendance confirmation */}
      {lastSavedAttendance && (
        <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-left text-sm text-slate-800">
          <div className="font-semibold text-green-800 mb-1">Saved to Attendance</div>
          <div className="flex flex-wrap gap-4">
            <div><span className="text-slate-500">Emp ID:</span> {lastSavedAttendance.empId}</div>
            <div><span className="text-slate-500">Emp Name:</span> {lastSavedAttendance.empName}</div>
            <div><span className="text-slate-500">Date:</span> {lastSavedAttendance.date}</div>
            <div><span className="text-slate-500">In:</span> {lastSavedAttendance.in}</div>
            <div><span className="text-slate-500">Lunch:</span> {lastSavedAttendance.lunchStart} - {lastSavedAttendance.lunchEnd}</div>
            <div><span className="text-slate-500">Out:</span> {lastSavedAttendance.out}</div>
            <div><span className="text-slate-500">Hours:</span> {lastSavedAttendance.hours}</div>
            <div><span className="text-slate-500">Status:</span> {lastSavedAttendance.status}</div>
          </div>
          <div className="mt-2 text-xs text-slate-600">Open Attendance page to see the full list and export CSV.</div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-black font-medium">Total Hours Worked</div>
          <div className="text-2xl font-bold text-black">{totalHoursStr}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-black font-medium">Days Clocked</div>
          <div className="text-2xl font-bold text-black">{rows.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-black font-medium">Average Daily Hours</div>
          <div className="text-2xl font-bold text-black">{averageHoursStr}</div>
        </div>
      </div>

      {/* Clock Table */}
      {rows.length > 0 && (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="p-3 text-left text-black">Emp ID</th>
              <th className="p-3 text-left text-black">Emp Name</th>
              
              <th className="p-3 text-left text-black">Date</th>
              <th className="p-3 text-left text-black">Clock In</th>
              <th className="p-3 text-left text-black">Lunch Start</th>
              <th className="p-3 text-left text-black">Lunch End</th>
              <th className="p-3 text-left text-black">Clock Out</th>
              <th className="p-3 text-left text-black">Hours</th>
              <th className="p-3 text-left text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {displayedRows.map((r) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3 text-black">-</td>
                  <td className="p-3 text-black">-</td>
                  <td className="p-3 text-black">{r.date}</td>
                  <td className="p-3 text-black">{r.clockIn}</td>
                  <td className="p-3 text-black">{r.lunchStart}</td>
                  <td className="p-3 text-black">{r.lunchEnd}</td>
                  <td className="p-3 text-black">{r.clockOut}</td>
                  <td className="p-3 text-black">{r.hours}</td>
                  <td className="p-3 text-black">{getStatus(r)}</td>
                </motion.tr>
              ))}
              {rows.length > 0 && displayedRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-3 text-center text-gray-600">No results match your search/filter.</td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      )}
    </section>
  );
}
