import { useState } from "react";

export default function Documents() {
  const [docs, setDocs] = useState([
  { id: 1, owner: 'user: 7d9...', type: 'id_proof', file: 'id.pdf', url: '/uploads/id.pdf' },
  { id: 2, owner: 'candidate: 9a2...', type: 'resume', file: 'jane_resume.pdf', url: '/uploads/jane_resume.pdf' },
  ]);
  
  const handleUploadClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newDocs = files.map((file, index) => ({
      id: docs.length + index + 1,
      owner: 'user: uploaded',
      type: 'file',
      file: file.name,
      url: URL.createObjectURL(file) 
    }));
    setDocs([...docs, ...newDocs]);
  };
  const handleDelete = (id) => {
    setDocs(docs.filter((doc) => doc.id !== id));
  };

  const handleEdit = (docId) => {
    // Trigger hidden input specific for editing
    const input = document.getElementById(`editInput-${docId}`);
    input.click();
  };

  const handleEditChange = (event, docId) => {
    const file = event.target.files[0];
    if (!file) return;

    const updatedDocs = docs.map(d =>
      d.id === docId
        ? { ...d, file: file.name, url: URL.createObjectURL(file) }
        : d
    );
    setDocs(updatedDocs);
  };


  return (
    <div className="bg-blue p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Documents</h2>
        <button className="px-3 py-2 rounded bg-sky-600 text-white text-sm" onClick={handleUploadClick}>Upload</button>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          multiple
          onChange={handleFileChange}
        />
      </div>

      <ul className="space-y-2">
        {docs.map((d) => (
          <li key={d.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.file}</div>
              <div className="text-sm text-gray-600">{d.type} • {d.owner}</div>
            </div>
            <div className="flex gap-2">
              <a href={d.url} download={d.file} className="px-3 py-1.5 rounded border text-sm">Download </a>
               <button className="px-3 py-1.5 rounded border text-sm" onClick={() => handleEdit(d.id)}>Edit</button>
              <input
                type="file"
                id={`editInput-${d.id}`}
                style={{ display: 'none' }}
                onChange={(e) => handleEditChange(e, d.id)}
              />
              <button className="px-3 py-1.5 rounded border text-sm" onClick={() => handleDelete(d.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
