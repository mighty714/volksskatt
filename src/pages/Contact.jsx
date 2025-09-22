import React from 'react'
import { getUser } from '../services/auth'

export default function Contact() {
  const user = getUser()
  return (
    <div className="p-6 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Contact volksskatt</h1>
          <p className="mt-2 text-slate-600">
            {user?.fullName ? `Hi ${user.fullName}, ` : ''}Tell us what you need help with and we’ll get back within 24 hours.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form className="bg-white rounded-2xl border border-slate-200 shadow p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm text-slate-700">
                Name
                <input className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Your name" />
              </label>
              <label className="block text-sm text-slate-700">
                Email
                <input type="email" className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="you@example.com" />
              </label>
              <label className="block text-sm text-slate-700 sm:col-span-2">
                Subject
                <input className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="How can we help?" />
              </label>
              <label className="block text-sm text-slate-700 sm:col-span-2">
                Message
                <textarea rows={5} className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Write your message here" />
              </label>
            </div>
            <button type="button" className="mt-4 px-5 py-2 rounded-full bg-slate-900 text-white font-medium">Send</button>
          </form>

          <aside className="bg-white rounded-2xl border border-slate-200 shadow p-6">
            <h2 className="text-xl font-semibold">Office</h2>
            <p className="mt-2 text-slate-600">123 Market Street, Suite 200
              <br/>San Francisco, CA</p>
            <div className="mt-4 text-slate-600">
              <div><span className="font-medium">Email:</span> hello@volksskatt.com</div>
              <div className="mt-1"><span className="font-medium">Phone:</span> +1 (555) 123-4567</div>
            </div>

            <h3 className="mt-6 text-sm font-semibold text-slate-700">Follow us</h3>
            <div className="mt-2 flex items-center gap-3 text-slate-600">
              <a href="#" className="hover:text-slate-800">LinkedIn</a>
              <a href="#" className="hover:text-slate-800">X</a>
              <a href="#" className="hover:text-slate-800">YouTube</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
