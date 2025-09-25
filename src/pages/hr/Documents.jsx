import { useState, useEffect, useRef } from "react";
import { FaSearch, FaFilter, FaUpload, FaDownload, FaEdit, FaTrash } from "react-icons/fa";

export default function Documents() {
  const [docs, setDocs] = useState([
    { id: 1, owner: "user: 7d9...", type: "id_proof", file: "id.pdf", url: "/uploads/id.pdf", createdAt: new Date().toISOString() },
    { id: 2, owner: "candidate: 9a2...", type: "resume", file: "jane_resume.pdf", url: "/uploads/jane_resume.pdf", createdAt: new Date().toISOString() },
    { id: 3, owner: "candidate: 5a6...", type: "photo", file: "photo.pdf", url: "/uploads/photo.pdf", createdAt: new Date().toISOString() },
  ]);

  const [notification, setNotification] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all"); // all | id_proof | resume | photo | file
  const [dateFrom, setDateFrom] = useState(""); // YYYY-MM-DD
  const [dateTo, setDateTo] = useState("");   // YYYY-MM-DD
  const [displayedDocs, setDisplayedDocs] = useState(docs);
  const listRef = useRef(null);

  
  useEffect(() => {
    setDisplayedDocs(docs);
  }, [docs]);

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newDocs = files.map((file, index) => ({
      id: docs.length + index + 1,
      owner: "user: uploaded",
      type: "file",
      file: file.name,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    }));
    setDocs([...docs, ...newDocs]);
    setNotification("📤 File uploaded successfully!");
    setTimeout(() => {
    setNotification("");
  }, 2000);
    // After rendering, scroll the list to the bottom to show the newest uploads
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 0);
  };

  const handleDelete = (id) => {
    setDocs(docs.filter((doc) => doc.id !== id));
    setNotification("✅ Successfully deleted");

    setTimeout(() => {
      setNotification("");
    }, 1000);
  };

  const handleEdit = (docId) => {
    const input = document.getElementById(`editInput-${docId}`);
    input.click();
  };

  const handleEditChange = (event, docId) => {
    const file = event.target.files[0];
    if (!file) return;

    const updatedDocs = docs.map((d) =>
      d.id === docId ? { ...d, file: file.name, url: URL.createObjectURL(file) } : d
    );
    setDocs(updatedDocs);
  };

  // Apply search and filter any time inputs change
  useEffect(() => {
    const q = searchText.trim().toLowerCase();
    const filtered = docs.filter((d) => {
      const typeOk = typeFilter === "all" || d.type === typeFilter;
      if (!typeOk) return false;
      // Date range filter based on createdAt (upload date)
      if (dateFrom) {
        const fromTs = new Date(dateFrom + 'T00:00:00').getTime();
        const docTs = new Date(d.createdAt || Date.now()).getTime();
        if (docTs < fromTs) return false;
      }
      if (dateTo) {
        const toTs = new Date(dateTo + 'T23:59:59').getTime();
        const docTs = new Date(d.createdAt || Date.now()).getTime();
        if (docTs > toTs) return false;
      }
      if (!q) return true;
      return [d.file, d.type, d.owner]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
    setDisplayedDocs(filtered);
  }, [docs, searchText, typeFilter, dateFrom, dateTo]);

  return (
    <div className="bg-white text-black p-6 rounded-xl shadow relative">
     
      {notification && (
        <div className="fixed inset-10 flex items-start justify-center z-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-3xl shadow-2xl text-lg font-semibold animate-fadeInOut">
            {notification}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Documents</h2>
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
            className="w-10 h-10 grid place-items-center rounded-full bg-sky-600 text-white shadow hover:bg-sky-700 transition transform hover:scale-110 active:scale-95"
            title="Upload"
            aria-label="Upload"
            onClick={handleUploadClick}
          >
            <FaUpload className="w-4 h-4" />
          </button>

          {/* Search popover */}
          {showSearch && (
            <div className="absolute right-28 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-64">
              <div className="text-xs text-gray-600 mb-1">Search Documents</div>
              <input
                autoFocus
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type filename, type or owner"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                <button onClick={() => setSearchText("")} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Clear</button>
                <button onClick={() => setShowSearch(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}

          {showFilter && (
            <div className="absolute right-12 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-56">
              <div className="text-xs text-gray-600 mb-2">Filter by Type</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button onClick={() => setTypeFilter('all')} className={`px-2 py-1 rounded border ${typeFilter==='all' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>All</button>
                <button onClick={() => setTypeFilter('resume')} className={`px-2 py-1 rounded border ${typeFilter==='resume' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>Resume</button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-2 py-1 border rounded" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-2 py-1 border rounded" />
              </div>
              <div className="mt-2 flex items-center justify-end gap-2">
                <button onClick={() => { setTypeFilter('all'); setDateFrom(''); setDateTo(''); }} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Reset</button>
                <button onClick={() => setShowFilter(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden input used by the Upload button */}
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        multiple
        onChange={handleFileChange}
      />

      <div ref={listRef} className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
      <ul className="space-y-2">
        {displayedDocs.length > 0 ? (
          displayedDocs.map((d) => (
            <li key={d.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{d.file}</div>
                <div className="text-sm text-gray-600">
                  {d.type} • {d.owner}
                  <span className="ml-2 text-gray-500">• Uploaded: {new Date(d.createdAt || Date.now()).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={d.url}
                  download={d.file}
                  title="Download"
                  aria-label="Download"
                  className="w-9 h-9 grid place-items-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition transform hover:scale-110 active:scale-95"
                >
                  <FaDownload className="w-4 h-4" />
                </a>
                <button
                  title="Edit"
                  aria-label="Edit"
                  className="w-9 h-9 grid place-items-center rounded-full bg-amber-500 text-white shadow hover:bg-amber-600 transition transform hover:scale-110 active:scale-95"
                  onClick={() => handleEdit(d.id)}
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  id={`editInput-${d.id}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleEditChange(e, d.id)}
                />
                <button
                  title="Delete"
                  aria-label="Delete"
                  className="w-9 h-9 grid place-items-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition transform hover:scale-110 active:scale-95"
                  onClick={() => handleDelete(d.id)}
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No results match your search/filter.</p>
        )}
      </ul>
      </div>
    </div>
  );
}
