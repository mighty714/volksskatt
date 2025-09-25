// Interviews.tsx
import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { formatDate } from "../utils/dateUtils";

const initialInterviews = [
  { id: 1, candidate: "Jane Doe", schedule: "2025-09-23 10:00", mode: "online", interviewer: "John" },
  { id: 2, candidate: "Mark Lee", schedule: "2025-09-24 15:30", mode: "in-person", interviewer: "Sara" },
  { id: 2, candidate: "Divya", schedule: "2025-09-24 15:30", mode: "in-person", interviewer: "Nagesh" },

];

export default function Interviews() {
  // Ensure each row has a stable unique uid (independent of external id)
  const seedWithUid = (list) => list.map((it, idx) => ({ ...it, uid: `${it.id}-${idx}-${it.schedule}` }))
  const [items, setItems] = useState(seedWithUid(initialInterviews));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ candidate: "", schedule: "", mode: "online", interviewer: "" });
  const [errors, setErrors] = useState({});
  const [editingUid, setEditingUid] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [query, setQuery] = useState("");
  const [fromAt, setFromAt] = useState(""); // date string 'YYYY-MM-DD'
  const [toAt, setToAt] = useState("");   // date string 'YYYY-MM-DD'
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);

  const openForm = () => setShowForm(true);
  const closeForm = () => { setShowForm(false); setForm({ candidate: "", schedule: "", mode: "online", interviewer: "" }); setErrors({}); setEditingUid(null); };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.candidate.trim()) e.candidate = "Required";
    if (!form.schedule) e.schedule = "Required";
    if (!form.interviewer.trim()) e.interviewer = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingUid) {
      setItems((prev) => prev.map((it) => (it.uid === editingUid ? { ...it, ...form } : it)));
      closeForm();
      return;
    }
    const newItem = { id: Date.now(), uid: String(Date.now()), ...form };
    setItems((prev) => [newItem, ...prev]);
    closeForm();
  };

  const onEdit = (item) => {
    setForm({ candidate: item.candidate, schedule: item.schedule, mode: item.mode, interviewer: item.interviewer });
    setEditingUid(item.uid);
    setShowForm(true);
  };

  const onDelete = (uid) => {
    if (window.confirm('Delete this interview?')) {
      setItems((prev) => prev.filter((it) => it.uid !== uid));
    }
  };

  // Ensure form is hidden on initial mount
  useEffect(() => {
    setShowForm(false);
  }, []);

  const filteredItems = items.filter((it) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q ||
      it.candidate.toLowerCase().includes(q) ||
      it.interviewer.toLowerCase().includes(q) ||
      it.mode.toLowerCase().includes(q);
    // Date-only filter (ignore time)
    const itDate = new Date(it.schedule.replace(' ', 'T'));
    const itDay = new Date(itDate.getFullYear(), itDate.getMonth(), itDate.getDate());
    const fromOk = !fromAt || itDay >= new Date(`${fromAt}T00:00:00`);
    const toOk = !toAt || itDay <= new Date(`${toAt}T23:59:59`);
    return matchesQuery && fromOk && toOk;
  });

  return (
    <section className="interviews bg-white p-6 rounded-xl shadow-md text-center">
      <header className="flex items-center justify-between mb-5 text-left gap-3">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Interviews</h2>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setShowSearch((v) => !v)}
              className="w-9 h-9 grid place-items-center rounded border border-gray-300 bg-white text-slate-700 hover:bg-gray-50"
              aria-label="Toggle search"
              title="Search"
            >
              <FaSearch className="w-4 h-4" />
            </button>
            {showSearch && (
              <div className="absolute right-0 top-11 z-20 bg-white border border-gray-200 rounded-md shadow p-2 animate-pop-bounce">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search (name, mode, interviewer)"
                  className="w-64 px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowFilter((v) => !v)}
              className="w-9 h-9 grid place-items-center rounded border border-gray-300 bg-white text-slate-700 hover:bg-gray-50"
              aria-label="Toggle filters"
              title="Filter"
            >
              <FaFilter className="w-4 h-4" />
            </button>

            {showFilter && (
              <div className="absolute right-0 top-11 z-20 bg-white border border-gray-200 rounded-md shadow p-3 w-72 animate-pop-bounce">
                <div className="text-xs text-gray-600 mb-2">Filter by Date</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="relative">
                    <input
                      type="date"
                      value={fromAt}
                      onChange={(e) => setFromAt(e.target.value)}
                      onFocus={() => setFromFocused(true)}
                      onBlur={() => setFromFocused(false)}
                      className={`w-full px-3 py-2 rounded border border-gray-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 date-clean ${!fromAt ? 'is-empty' : ''}`}
                      aria-label="Start date"
                    />
                    {(!fromAt && !fromFocused) && (
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">Start Date</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={toAt}
                      onChange={(e) => setToAt(e.target.value)}
                      onFocus={() => setToFocused(true)}
                      onBlur={() => setToFocused(false)}
                      className={`w-full px-3 py-2 rounded border border-gray-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 date-clean ${!toAt ? 'is-empty' : ''}`}
                      aria-label="End date"
                    />
                    {(!toAt && !toFocused) && (
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">End Date</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button onClick={() => { setFromAt(""); setToAt(""); }} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Reset</button>
                  <button onClick={() => setShowFilter(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
                </div>
              </div>
            )}
          </div>
          <button
            className="w-10 h-10 grid place-items-center rounded-full bg-sky-600 text-white shadow hover:bg-sky-700 transition transform hover:scale-110 active:scale-95"
            aria-label="Schedule a new interview"
            title="New Interview"
            onClick={openForm}
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-panel mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 mx-auto max-w-2xl">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Candidate</label>
              <input
                name="candidate"
                value={form.candidate}
                onChange={onChange}
                className={`w-full px-3 py-2 rounded border ${errors.candidate ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white text-slate-900`}
                placeholder="Full name"
              />
              {errors.candidate && <p className="text-xs text-red-500 mt-1">{errors.candidate}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Schedule</label>
              <input
                type="datetime-local"
                name="schedule"
                value={form.schedule}
                onChange={onChange}
                className={`w-full px-3 py-2 rounded border ${errors.schedule ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white text-slate-900 [color-scheme:light]`}
              />
              {errors.schedule && <p className="text-xs text-red-500 mt-1">{errors.schedule}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={onChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white text-slate-900"
              >
                <option value="online">online</option>
                <option value="in-person">in-person</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Interviewer</label>
              <input
                name="interviewer"
                value={form.interviewer}
                onChange={onChange}
                className={`w-full px-3 py-2 rounded border ${errors.interviewer ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-sky-200 bg-white text-slate-900`}
                placeholder="Interviewer name"
              />
              {errors.interviewer && <p className="text-xs text-red-500 mt-1">{errors.interviewer}</p>}
            </div>
            <div className="sm:col-span-2 flex items-center justify-center gap-2 pt-1">
              <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700">Save</button>
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto max-h-[420px] overflow-y-auto rounded-lg">
        <table className="min-w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-sky-50 text-center text-slate-700 border-b border-sky-100">
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Candidate</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Schedule</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Mode</th>
              <th className="p-3 font-medium sticky top-0 bg-sky-50">Interviewer</th>
              <th className="p-3 font-medium text-center sticky top-0 bg-sky-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((row) => (
              <tr key={row.uid} className="border-t hover:bg-gray-50 transition text-center">
                <td className="p-3 font-medium text-gray-800">{row.candidate}</td>
                <td className="p-3 text-gray-700">{formatDate(row.schedule)}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                      ${row.mode === "online"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {row.mode}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{row.interviewer}</td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="w-9 h-9 grid place-items-center rounded-full bg-blue-500 text-white shadow hover:bg-blue-600 transition transform hover:scale-110 active:scale-95"
                      onClick={() => setViewItem(row)}
                      aria-label="View details"
                      title="View"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      className="w-9 h-9 grid place-items-center rounded-full bg-amber-500 text-white shadow hover:bg-amber-600 transition transform hover:scale-110 active:scale-95"
                      onClick={() => onEdit(row)}
                      aria-label="Edit interview"
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      className="w-9 h-9 grid place-items-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition transform hover:scale-110 active:scale-95"
                      onClick={() => onDelete(row.uid)}
                      aria-label="Delete interview"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View modal */}
      {viewItem && (
        <div className="fixed inset-0 z-30">
          <button className="absolute inset-0 bg-black/30" aria-label="Close" onClick={() => setViewItem(null)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[96%] max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">Interview Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600">Candidate</dt><dd className="font-medium text-slate-900">{viewItem.candidate}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Schedule</dt><dd className="font-medium text-slate-900">{formatDate(viewItem.schedule)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Mode</dt><dd className="font-medium text-slate-900">{viewItem.mode}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Interviewer</dt><dd className="font-medium text-slate-900">{viewItem.interviewer}</dd></div>
            </dl>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setViewItem(null)} className="px-4 py-2 rounded bg-slate-900 text-white text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

