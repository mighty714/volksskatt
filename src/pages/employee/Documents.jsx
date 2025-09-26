import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaSearch, FaFilter, FaUpload, FaDownload, FaTrash } from 'react-icons/fa'
import { getUser } from '../../services/auth'

export default function EmployeeDocuments() {
  const user = getUser()
  const [docs, setDocs] = useState([])
  const [searchText, setSearchText] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all') // all | payslip | offer | file
  const listRef = useRef(null)

  // Load global docs and filter to user (fallback to user email or name)
  useEffect(() => {
    try {
      const globalDocsRaw = [] // no shared store; start empty
      setDocs(globalDocsRaw)
    } catch {
      setDocs([])
    }
  }, [])

  const myDocs = useMemo(() => {
    const ownerKey = user?.email || user?.fullName || 'me'
    return docs.filter((d) => (d.owner || '').includes(ownerKey))
  }, [docs, user])

  const displayedDocs = myDocs.filter((d) => {
    const typeOk = typeFilter === 'all' || d.type === typeFilter
    if (!typeOk) return false
    const q = searchText.trim().toLowerCase()
    if (!q) return true
    return [d.file, d.type, d.owner].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
  })

  const handleUploadClick = () => {
    document.getElementById('empFileInput').click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const ownerKey = user?.email || user?.fullName || 'me'
    const newDocs = files.map((file, idx) => ({
      id: Date.now() + idx,
      owner: ownerKey,
      type: 'file',
      file: file.name,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    }))
    setDocs((prev) => [...prev, ...newDocs])
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, 0)
  }

  const handleDelete = (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Documents</h2>
        <div className="flex items-center gap-2 relative">
          <button type="button" title="Search" aria-label="Search" onClick={() => setShowSearch((v) => !v)} className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 shadow"><FaSearch className="w-4 h-4" /></button>
          <button type="button" title="Filter" aria-label="Filter" onClick={() => setShowFilter((v) => !v)} className="w-10 h-10 grid place-items-center rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50 shadow"><FaFilter className="w-4 h-4" /></button>
          <button className="w-10 h-10 grid place-items-center rounded-full bg-sky-600 text-white shadow hover:bg-sky-700 transition transform hover:scale-110 active:scale-95" title="Upload" aria-label="Upload" onClick={handleUploadClick}>
            <FaUpload className="w-4 h-4" />
          </button>

          {showSearch && (
            <div className="absolute right-28 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-64">
              <div className="text-xs text-gray-600 mb-1">Search My Documents</div>
              <input autoFocus value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Type filename or type" className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div className="mt-2 flex items-center justify-end gap-2">
                <button onClick={() => setSearchText('')} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Clear</button>
                <button onClick={() => setShowSearch(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}

          {showFilter && (
            <div className="absolute right-12 top-12 z-20 bg-white border border-gray-200 rounded-md shadow p-2 w-56">
              <div className="text-xs text-gray-600 mb-2">Filter by Type</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button onClick={() => setTypeFilter('all')} className={`px-2 py-1 rounded border ${typeFilter==='all' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>All</button>
                <button onClick={() => setTypeFilter('payslip')} className={`px-2 py-1 rounded border ${typeFilter==='payslip' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-800 border-gray-300'}`}>Payslip</button>
              </div>
              <div className="mt-2 flex items-center justify-end gap-2">
                <button onClick={() => { setTypeFilter('all') }} className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">Reset</button>
                <button onClick={() => setShowFilter(false)} className="px-2 py-1 rounded text-xs bg-slate-900 text-white">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <input id="empFileInput" type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />

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
                  <a href={d.url} download={d.file} title="Download" aria-label="Download" className="w-9 h-9 grid place-items-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition transform hover:scale-110 active:scale-95">
                    <FaDownload className="w-4 h-4" />
                  </a>
                  <button title="Delete" aria-label="Delete" className="w-9 h-9 grid place-items-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition transform hover:scale-110 active:scale-95" onClick={() => handleDelete(d.id)}>
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No documents yet.</p>
          )}
        </ul>
      </div>
    </section>
  )
}
