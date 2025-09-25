import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CareersHome() {
  const navigate = useNavigate()
  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1800&auto=format&fit=crop',
      eyebrow: 'BE YOUR AUTHENTIC SELF',
      title: 'You make the difference',
      copy: 'Your unique experience and perspective are vital to our success. We are passionate about inclusion, collaboration, and innovation.'
    },
    {
      img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1800&auto=format&fit=crop',
      eyebrow: 'GROW WITH US',
      title: 'Engineer your career',
      copy: 'From mentorship to training, we help you grow the skills that matter across modern technologies and domains.'
    },
    {
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1800&auto=format&fit=crop',
      eyebrow: 'THRIVE TOGETHER',
      title: 'A culture of innovation',
      copy: 'We celebrate ideas, foster diversity, and build products that change lives.'
    }
  ]
  const [cur, setCur] = useState(0)
  const prev = () => setCur((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCur((c) => (c + 1) % slides.length)

  return (
    <div className="text-slate-900">
      {/* Top nav (replicated from Jobspost.jsx) */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className={`flex items-center gap-2`}>
            <div className="relative w-12 h-12 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
              <img
                src="/logo.png"
                alt="volksskatt logo"
                className="absolute inset-0 w-full h-full object-contain scale-[1.18]"
              />
              <span className="absolute inset-0 flex items-center justify-start pl-[30px] -translate-x-[3px] -translate-y-[-9px] pointer-events-none text-[17px] md:text-lg font-semibold tracking-wide text-black drop-shadow">
                volksskatt
              </span>
            </div>
            <span className="hidden sm:flex -ml-3 flex-col leading-none text-black/90 drop-shadow-sm mt-[3px]">
              <span className="font-medium tracking-wider text-[11px] md:text-base opacity-90 mt-[40px] ml-6 md:ml-17">infotech</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => navigate('/Home')} className="hover:underline">Home</button>
            <button onClick={() => navigate('/careers')} className="hover:underline">Careers Home</button>
            <button onClick={() => navigate('/jobspost')} className="hover:underline">Search for Jobs</button>
            <button className="hover:underline">Join Our Talent Network</button>
            <button className="hover:underline" onClick={() => navigate('/signin')}>Sign In</button>
            <button className="hover:underline" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero that matches the reference layout: big left text, right image */}
      <header className="max-w-7xl mx-auto px-4 pt-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-2 items-stretch">
            {/* Left copy */}
            <div className="p-8 md:p-14 flex flex-col justify-center">
              <div className="text-slate-500 text-sm tracking-wide">VOLKSSKATT CAREERS</div>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 leading-[1.08]">
                Careers that
                <br /> change lives
              </h1>
              <div className="mt-6 flex gap-3">
                <button onClick={() => navigate('/jobspost')} className="px-5 py-3 rounded-full border border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium">
                  Search jobs ↗
                </button>
                <button className="px-5 py-3 rounded-full border border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium">
                  Employee-only job search ↗
                </button>
              </div>
            </div>

            {/* Right image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
                alt="Careers team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Soft white fade on left edge to blend like the reference */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent" />
            </div>
          </div>
        </div>
      </header>

      {/* Bottom tabs (overview links) */}
      <div className="mt-6 bg-white/90 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex flex-wrap gap-6 py-3 text-sm text-slate-700">
            {['Overview','Culture','Engineer Your Career','Early Careers','Inclusion & Diversity','Awards & Events'].map((t) => (
              <button key={t} className="hover:underline whitespace-nowrap">{t}</button>
            ))}
          </nav>
        </div>
      </div>

      {/* Feature band: image left, copy right, with simple slider controls */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-xl overflow-hidden shadow">
            <img src={slides[cur].img} alt={slides[cur].title} className="w-full h-64 md:h-80 object-cover" />
          </div>
          <div>
            <div className="text-indigo-700 text-xs tracking-[.25em] font-semibold">{slides[cur].eyebrow}</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-indigo-900">{slides[cur].title}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed max-w-prose">{slides[cur].copy}</p>
            <button className="mt-4 inline-flex items-center gap-1 text-indigo-700 font-medium hover:underline">Learn more ↗</button>
          </div>
        </div>
        {/* Slider controls */}
        <div className="mt-6 flex items-center justify-center gap-4 text-indigo-700">
          <button onClick={prev} aria-label="Previous" className="p-2 rounded-full hover:bg-indigo-50">‹</button>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === cur ? 'bg-indigo-700' : 'bg-indigo-200'}`} />
            ))}
          </div>
          <button onClick={next} aria-label="Next" className="p-2 rounded-full hover:bg-indigo-50">›</button>
        </div>
        <hr className="mt-8 border-slate-200" />
      </section>

      {/* Quote band */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-[1fr,280px] gap-8 items-center">
          <div>
            <div className="text-indigo-600 text-6xl leading-none">“</div>
            <p className="-mt-4 text-2xl md:text-3xl text-slate-800 font-semibold leading-snug">
              This is a company of people — innovative, passionate, smart people. We provide health and we provide hope.
            </p>
            <div className="mt-4 text-slate-500 text-sm">— Geoff Martha, Chairman and CEO, Medtronic</div>
          </div>
          <div className="justify-self-center">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
              alt="Leader"
              className="w-44 h-44 md:w-56 md:h-56 rounded-full object-cover border-4 border-white shadow"
            />
          </div>
        </div>
      </section>

      {/* IT‑focused feature rows */}
      <section className="max-w-7xl mx-auto px-4 pb-10 space-y-10">
        {/* Row 1: Culture / Early careers (IT only) */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl border border-slate-200 p-6">
          <div>
            <div className="text-slate-500 text-xs tracking-[.25em] font-semibold">CULTURE</div>
            <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-indigo-900">A mission‑driven engineering culture</h3>
            <p className="mt-3 text-slate-600">We build cloud‑native products, automate with DevOps, and ship secure, scalable software that powers real businesses.</p>
            <button className="mt-4 text-indigo-700 font-medium hover:underline">Learn more ↗</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop"
            alt="Engineers collaborating on code"
            className="w-full h-64 object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl border border-slate-200 p-6">
          <img
            src="https://images.unsplash.com/photo-1551836022-deb4988cc6c5?q=80&w=1600&auto=format&fit=crop"
            alt="Early career developers"
            className="w-full h-64 object-cover rounded-lg order-last md:order-first"
            loading="lazy"
          />
          <div>
            <div className="text-slate-500 text-xs tracking-[.25em] font-semibold">EARLY CAREERS</div>
            <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-indigo-900">Build your future with software</h3>
            <p className="mt-3 text-slate-600">Join our graduate and internship programs in full‑stack, data engineering, SRE, and platform engineering.</p>
            <button className="mt-4 text-indigo-700 font-medium hover:underline">Learn more ↗</button>
          </div>
        </div>

        {/* Row 2: Engineer your career / Inclusion & Diversity (IT only) */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl border border-slate-200 p-6">
          <div>
            <div className="text-slate-500 text-xs tracking-[.25em] font-semibold">ENGINEER YOUR CAREER</div>
            <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-indigo-900">Be an innovator every day</h3>
            <p className="mt-3 text-slate-600">Work with modern stacks—React, Node, Go, Python, Kubernetes, and AI—shipped with CI/CD and strong observability.</p>
            <button className="mt-4 text-indigo-700 font-medium hover:underline">Learn more ↗</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1600&auto=format&fit=crop"
            alt="Developer with test equipment"
            className="w-full h-64 object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl border border-slate-200 p-6">
          <img
            src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1600&auto=format&fit=crop"
            alt="Inclusive dev team"
            className="w-full h-64 object-cover rounded-lg order-last md:order-first"
            loading="lazy"
          />
          <div>
            <div className="text-slate-500 text-xs tracking-[.25em] font-semibold">INCLUSION & DIVERSITY</div>
            <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-indigo-900">Diversity is key to innovation</h3>
            <p className="mt-3 text-slate-600">Diverse teams build better software. We value different perspectives to deliver resilient, user‑centric systems.</p>
            <button className="mt-4 text-indigo-700 font-medium hover:underline">Learn more ↗</button>
          </div>
        </div>
      </section>

      {/* Related articles (IT themed) */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-center text-2xl font-semibold text-slate-800">Related articles</h3>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Engineering the extraordinary',
                img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
              },
              {
                title: 'Leading tech innovation since 2010',
                img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
              },
              {
                title: 'Recognized for culture, leadership, and growth',
                img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
              },
            ].map((card, i) => (
              <article key={i} className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                <img src={card.img} alt={card.title} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <div className="text-indigo-700 text-xs tracking-[.25em] font-semibold">WHO WE ARE</div>
                  <h4 className="mt-2 text-lg font-semibold text-indigo-900">{card.title}</h4>
                  <button className="mt-3 text-indigo-700 text-sm hover:underline">Learn more ↗</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dark footer (IT company style) */}
      <footer className="bg-[#0d0f3a] text-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <div className="font-semibold">Careers</div>
            <button onClick={() => navigate('/jobspost')} className="text-white/80 hover:underline text-left">Search Jobs</button>
            <button className="text-white/80 hover:underline text-left">Campus Hiring</button>
            <button className="text-white/80 hover:underline text-left">Hiring Process</button>
          </div>
          <div className="space-y-3">
            <div className="font-semibold">Engineering</div>
            <button className="text-white/80 hover:underline text-left">Open Source</button>
            <button className="text-white/80 hover:underline text-left">Security</button>
            <button className="text-white/80 hover:underline text-left">Tech Blog</button>
          </div>
          <div className="space-y-3">
            <div className="font-semibold">Company</div>
            <button className="text-white/80 hover:underline text-left">About</button>
            <button className="text-white/80 hover:underline text-left">Newsroom</button>
            <button className="text-white/80 hover:underline text-left">Investors</button>
          </div>
          <div className="space-y-3">
            <div className="font-semibold">Legal</div>
            <button className="text-white/80 hover:underline text-left">Privacy</button>
            <button className="text-white/80 hover:underline text-left">Terms</button>
            <button className="text-white/80 hover:underline text-left">Accessibility</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-10 text-white/70 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="volksskatt" className="w-6 h-6 object-contain" />
            <div>
              <div className="font-semibold">volksskatt</div>
              <div>Engineering the extraordinary</div>
            </div>
          </div>
          <div>© {new Date().getFullYear()} Volksskatt</div>
        </div>
      </footer>
    </div>
  )
}
