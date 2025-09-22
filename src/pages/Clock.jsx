import { useState } from 'react'

export default function Clock() {
  const [status, setStatus] = useState('not-clocked')
  const [photo, setPhoto] = useState(null)

  const onUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhoto(url)
    }
  }

  const now = new Date().toLocaleString()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Clock In / Out</h2>
        <p className="text-sm text-gray-600 mb-4">Current time: {now}</p>
        <div className="flex gap-3 items-center mb-4">
          <button
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => setStatus('clocked-in')}
          >
            Clock In
          </button>
          <button
            className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700"
            onClick={() => setStatus('clocked-out')}
          >
            Clock Out
          </button>
          <span className="text-sm text-gray-700">Status: {status}</span>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Selfie Upload (mock)</h3>
          <input type="file" accept="image/*" onChange={onUpload} />
          {photo && (
            <img src={photo} alt="selfie" className="mt-3 rounded w-40 h-40 object-cover" />
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Today's Summary</h2>
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>First clock-in: 9:12 AM</li>
          <li>Last clock-out: 6:04 PM</li>
          <li>Total hours: 8h 10m</li>
        </ul>
      </div>
    </div>
  )
}
