import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaFilter, FaFileCsv } from "react-icons/fa";

export default function TalentNetworkSubmissions() {
  const [subs, setSubs] = useState([]);
  const [q, setQ] = useState("");
  const [interest, setInterest] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("talent_network_submissions") || "[]";
      setSubs(JSON.parse(raw));
    } catch {
      setSubs([]);
    }
  }, []);

  // Click-outside and Escape handling for popovers
  useEffect(() => {
    const onClick = (e) => {
      if (!controlsRef.current) return;
      if (!controlsRef.current.contains(e.target)) {
        setShowFilter(false);
        setShowSearch(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowFilter(false);
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return subs.filter((s) => {
      const matchesQ = !query ||
        (s.firstName + " " + s.lastName).toLowerCase().includes(query) ||
        (s.email || "").toLowerCase().includes(query) ||
        (s.linkedin || "").toLowerCase().includes(query) ||
        (s.skillsList || []).join(",").toLowerCase().includes(query);
      const interestOk = interest === "All" || s.interest === interest;
      return matchesQ && interestOk;
    });
  }, [subs, q, interest]);

  const exportCsv = () => {
    const rows = [
      [
        "id","firstName","lastName","email","phone","country","prefix","suffix","interest","experience","linkedin","portfolio","company","role","noticePeriod","skills","resume","created"
      ],
      ...filtered.map((s) => [
        s.id,
        s.firstName,
        s.lastName,
        s.email,
        s.phone,
        s.country,
        s.prefix,
        s.suffix,
        s.interest,
        s.experience,
        s.linkedin,
        s.portfolio,
        s.company,
        s.role,
        s.noticePeriod,
        (s.skillsList||[]).join("; "),
        s.resume,
        new Date(s.id).toISOString()
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${(v??"").toString().replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'talent_network_submissions.csv';
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="text-slate-900">
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Talent Network Submissions</h1>
          <div ref={controlsRef} className="relative flex items-center gap-2">
            <button
              title="Search"
              aria-label="Search"
              onClick={()=>{ setShowSearch(v=>!v); setTimeout(()=>searchRef.current?.focus(), 0); }}
              className="w-9 h-9 rounded-full border border-slate-300 text-slate-700 grid place-items-center hover:bg-slate-50"
            >
              <FaSearch />
            </button>
            {showSearch && (
              <div className="absolute right-24 top-full mt-2 bg-white border border-slate-200 rounded-full shadow px-3 py-2 z-10">
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                  placeholder="Search/Filter"
                  className="outline-none text-sm w-64"
                />
              </div>
            )}
            <button
              title="Filter"
              aria-label="Filter"
              onClick={()=>setShowFilter((v)=>!v)}
              className="w-9 h-9 rounded-full border border-slate-300 text-slate-700 grid place-items-center hover:bg-slate-50"
            >
              <FaFilter />
            </button>
            {showFilter && (
              <div className="absolute right-12 top-full mt-2 bg-white border border-slate-200 rounded-md shadow p-2 z-10">
                <label className="block text-xs text-slate-500 mb-1">Area of Interest</label>
                <select value={interest} onChange={(e)=>setInterest(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 bg-white text-sm">
                  {['All','Engineering','Design','Sales','HR','Operations'].map(x=> <option key={x}>{x}</option>)}
                </select>
              </div>
            )}
            <button
              title="Export CSV"
              aria-label="Export CSV"
              onClick={exportCsv}
              className="w-9 h-9 rounded-full bg-sky-600 text-white grid place-items-center hover:bg-sky-700"
            >
              <FaFileCsv />
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              {['Name','Email','Phone','Interest','Experience','Skills','LinkedIn','Portfolio','Company','Role','Notice Period','Submitted'].map(h => (
                <th key={h} className="px-3 py-2 border-b text-slate-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="odd:bg-white even:bg-slate-50">
                <td className="px-3 py-2 border-b">{s.prefix ? s.prefix + ' ' : ''}{s.firstName} {s.middleName} {s.lastName} {s.suffix}</td>
                <td className="px-3 py-2 border-b">{s.email}</td>
                <td className="px-3 py-2 border-b">{s.phone}</td>
                <td className="px-3 py-2 border-b">{s.interest}</td>
                <td className="px-3 py-2 border-b">{s.experience}</td>
                <td className="px-3 py-2 border-b">{(s.skillsList||[]).join(', ')}</td>
                <td className="px-3 py-2 border-b">{s.linkedin ? <a href={s.linkedin} className="text-sky-700 hover:underline" target="_blank" rel="noreferrer">Link</a> : '-'}</td>
                <td className="px-3 py-2 border-b">{s.portfolio ? <a href={s.portfolio} className="text-sky-700 hover:underline" target="_blank" rel="noreferrer">Link</a> : '-'}</td>
                <td className="px-3 py-2 border-b">{s.company || '-'}</td>
                <td className="px-3 py-2 border-b">{s.role || '-'}</td>
                <td className="px-3 py-2 border-b">{s.noticePeriod || '-'}</td>
                <td className="px-3 py-2 border-b">{new Date(s.id).toLocaleString()}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan={12}>No submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
