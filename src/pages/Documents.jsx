import { useState, useEffect } from "react";

export default function Documents() {
  const [docs, setDocs] = useState([
    { id: 1, owner: "user: 7d9...", type: "id_proof", file: "id.pdf", url: "/uploads/id.pdf" },
    { id: 2, owner: "candidate: 9a2...", type: "resume", file: "jane_resume.pdf", url: "/uploads/jane_resume.pdf" },
    { id: 3, owner: "candidate: 5a6...", type: "photo", file: "photo.pdf", url: "/uploads/photo.pdf" },
  ]);

  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocs, setFilteredDocs] = useState(docs);

  
  useEffect(() => {
    setFilteredDocs(docs);
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
    }));
    setDocs([...docs, ...newDocs]);
    setNotification("📤 File uploaded successfully!");
    setTimeout(() => {
    setNotification("");
  }, 2000);

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

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredDocs(docs); 
      return;
    }

    const match = docs.find((doc) =>
      doc.file.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredDocs(match ? [match] : []); 
  };

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
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="🔍︎ Search file..."
            className="border rounded px-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="px-3 py-2 rounded bg-sky-400 text-black text-sm" onClick={handleSearch}>Search</button>
          <button className="px-3 py-2 rounded bg-sky-400 text-black text-sm">Filter</button>
          <button className="px-3 py-2 rounded bg-sky-400 text-black text-sm" onClick={handleUploadClick}>⬆️ Upload</button>
        </div>

        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />
      </div>

      <ul className="space-y-2">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((d) => (
            <li key={d.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{d.file}</div>
                <div className="text-sm text-gray-600">
                  {d.type} • {d.owner}
                </div>
              </div>
              <div className="flex gap-2">
                <a href={d.url} download={d.file}className="px-3 bg-green-400 py-1.5 rounded border text-sm">⬇️ Download</a>
                <button className="px-3 bg-orange-200 py-1.5 rounded border text-sm" onClick={() => handleEdit(d.id)}>✏️ Edit</button>
                <input
                  type="file"
                  id={`editInput-${d.id}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleEditChange(e, d.id)}
                />
                <button className="px-3 bg-red-500 text-white py-1.5 rounded border text-sm" onClick={() => handleDelete(d.id)}>🗑 Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No documents found.</p>
        )}
      </ul>
    </div>
  );
}
