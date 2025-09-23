import { useState } from "react"

const initialOffers = [
  { id: 1, candidate: "Jane Doe", job: "Frontend Engineer", status: "sent" },
  { id: 2, candidate: "Mark Lee", job: "Recruiter", status: "draft" },
  { id: 3, candidate: "Sophia Ray", job: "UI/UX Designer", status: "accepted" },
  { id: 4, candidate: "David Kim", job: "Backend Engineer", status: "rejected" },
]

const statusColors = {
  sent: "bg-blue-100 text-blue-600",
  draft: "bg-gray-100 text-gray-600",
  accepted: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-600",
}

export default function Offers() {
  const [offers, setOffers] = useState(initialOffers)

  // Add a new offer (demo functionality)
  const addOffer = () => {
    const newOffer = {
      id: offers.length + 1,
      candidate: `Candidate ${offers.length + 1}`,
      job: "New Role",
      status: "draft",
    }
    setOffers([...offers, newOffer])
  }

  // View offer (demo functionality)
  const viewOffer = (offer) => {
    alert(`Viewing ${offer.candidate} - ${offer.job} (${offer.status})`)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Job Offers</h2>
        <button
          onClick={addOffer}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium shadow-md hover:bg-sky-700 transition transform hover:scale-105"
        >
          + New Offer
        </button>
      </div>

      {/* Offers List */}
      <ul className="space-y-3">
        {offers.map((o, index) => (
          <li
            key={o.id}
            className="border rounded-xl p-4 flex items-center justify-between bg-gray-50 hover:bg-white transition transform hover:scale-[1.01] hover:shadow-md duration-300 animate-slideUp"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {/* Candidate Info */}
            <div>
              <div className="font-medium text-gray-900">{o.candidate}</div>
              <div className="text-sm text-gray-600">{o.job}</div>
            </div>

            {/* Status + Actions */}
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[o.status]}`}
              >
                {o.status}
              </span>
              <button
                onClick={() => viewOffer(o)}
                className="px-3 py-1.5 rounded-lg border text-sm text-gray-700 hover:bg-gray-100 transition transform hover:scale-105"
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
