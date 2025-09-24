import { useState, useEffect } from "react";
import { FaSignInAlt, FaSignOutAlt, FaUtensils, FaFileCsv } from "react-icons/fa";
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

// Helper to detect device type
const getDeviceType = () => {
  const ua = navigator.userAgent;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(ua)
    ? "Mobile"
    : "Laptop/Desktop";
};

export default function ClockDashboard() {
  const [rows, setRows] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentLunchTaken, setCurrentLunchTaken] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(new Date().getDate() % quotes.length);
  const [toast, setToast] = useState(null); // toast message

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

  const handleLogin = () => {
    if (!window.confirm("Are you sure you want to Login?")) return;
    const now = new Date();
    const deviceType = getDeviceType();
    setRows([
      ...rows,
      {
        id: rows.length + 1,
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
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to Logout?")) return;
    const now = new Date();
    const updated = [...rows];
    const last = updated[updated.length - 1];
    last.clockOut = formatTime(now);
    last.outRaw = now.getTime();
    last.hours = formatHours(calculateMinutes(last));
    setRows(updated);
    setLoggedIn(false);
    setCurrentLunchTaken(false);
    setToast("👋 Logout Successful");
  };

  const handleExport = () => {
    if (!window.confirm("Are you sure you want to Export CSV?")) return;
    const headers = ["Date,Device,Clock In,Lunch Start,Lunch End,Clock Out,Hours,Remarks"];
    const csvRows = rows.map(
      (r) => `${r.date},${r.device || "-"},${r.clockIn},${r.lunchStart},${r.lunchEnd},${r.clockOut},${r.hours},${r.remarks}`
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

  return (
    <div className="max-w-7xl mx-auto mt-5 p-6 bg-gray-50 rounded-xl relative">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-semibold mb-4 text-black">Clock Dashboard</h1>

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
        <div className="flex gap-3">
          {!loggedIn ? (
            <button onClick={handleLogin} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-500 transition transform hover:scale-105">
              <FaSignInAlt /> Login
            </button>
          ) : (
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full shadow hover:bg-red-500 transition transform hover:scale-105">
              <FaSignOutAlt /> Logout
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {loggedIn && !currentLunchTaken && (
            <button onClick={handleLunchStart} className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-white rounded-full shadow hover:bg-yellow-300 transition transform hover:scale-105">
              <FaUtensils /> Lunch Start
            </button>
          )}
          {loggedIn && currentLunchTaken && (
            <button onClick={handleLunchEnd} className="flex items-center gap-2 px-6 py-3 bg-orange-400 text-white rounded-full shadow hover:bg-orange-300 transition transform hover:scale-105">
              <FaUtensils /> Lunch End
            </button>
          )}
        </div>

        <div>
          <button onClick={handleExport} className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full shadow hover:bg-gray-700 transition transform hover:scale-105">
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>

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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="p-3 text-left text-black">Date</th>
              <th className="p-3 text-left text-black">Device</th>
              <th className="p-3 text-left text-black">Login</th>
              <th className="p-3 text-left text-black">Lunch Start</th>
              <th className="p-3 text-left text-black">Lunch End</th>
              <th className="p-3 text-left text-black">Logout</th>
              <th className="p-3 text-left text-black">Hours</th>
              <th className="p-3 text-left text-black">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rows.map((r) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3 text-black">{r.date}</td>
                  <td className="p-3 text-black">{r.device || "-"}</td>
                  <td className="p-3 text-black">{r.clockIn}</td>
                  <td className="p-3 text-black">{r.lunchStart}</td>
                  <td className="p-3 text-black">{r.lunchEnd}</td>
                  <td className="p-3 text-black">{r.clockOut}</td>
                  <td className="p-3 text-black">{r.hours}</td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={r.remarks}
                      onChange={(e) => handleRemarkChange(r.id, e.target.value)}
                      placeholder="Add remark"
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm text-black"
                    />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
