import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'career', label: 'Career' },
  { id: 'contact', label: 'Contact Us' },
]

// Sub-navigation items for the About section
const aboutTabs = [
  { id: 'about-meet', label: 'Meet Volksskatt' },
  { id: 'about-numbers', label: 'Progress in Numbers' },
  { id: 'about-values', label: 'Living Our Values' },
  { id: 'about-purpose', label: 'Our Purpose' },
  { id: 'about-journey', label: 'Our Journey' },
  { id: 'about-stories', label: 'Stories of Progress' },
]

export default function Home() {
  const navigate = useNavigate()
  const refs = useRef(Object.fromEntries(sections.map(s => [s.id, null])))
  const [active, setActive] = useState('home')
  const [aboutActive, setAboutActive] = useState(aboutTabs[0].id)
  const [showAboutNav, setShowAboutNav] = useState(false)
  const [numbersStarted, setNumbersStarted] = useState(false)
  // Simple image carousel state for hero
  const slides = [
    {
      // IT-themed corporate hero (clean, high-contrast)
      img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2400&auto=format&fit=crop',
      title: 'Engineering Excellence.',
      caption: 'IT companies’ best interview questions for real‑world problem solving.',
    },
    {
      img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2400&auto=format&fit=crop',
      title: 'Automate Everything.',
      caption: 'CI/CD, observability, and DevOps practices that keep you moving.',
    },
    {
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2400&auto=format&fit=crop',
      title: 'Delightful Experiences.',
      caption: 'Modern React frontends your users love to use every day.',
    },
  ]
  const [slide, setSlide] = useState(0)
  const [showDots, setShowDots] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const prevSlide = () => setSlide((s) => (s - 1 + slides.length) % slides.length)
  const nextSlide = () => setSlide((s) => (s + 1) % slides.length)

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Scroll spy: highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      {
        root: null,
        // Make last section (contact) register when ~50% is visible
        rootMargin: '0px 0px -50% 0px',
        threshold: 0.3,
      }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Start numbers animation when 'Progress in Numbers' tab becomes active
  useEffect(() => {
    if (aboutActive === 'about-numbers') setNumbersStarted(true)
  }, [aboutActive])

  // Simple count-up hook
  const useCountUp = (to, active, duration = 1200) => {
    const [val, setVal] = useState(0)
    useEffect(() => {
      if (!active) return
      let raf = 0
      const start = performance.now()
      const animate = (t) => {
        const p = Math.min(1, (t - start) / duration)
        setVal(Math.floor(to * p))
        if (p < 1) raf = requestAnimationFrame(animate)
      }
      raf = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(raf)
    }, [to, active, duration])
    return val
  }

  // Show dots only when user has moved on the home section; no autoplay
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      // Show dots whenever Home section is the active/fitted section
      setShowDots(active === 'home')
      setShowScrollTop(y > 120)
      // Hide nav items when leaving the home top or after slight scroll
      setNavHidden(!(active === 'home' && y < 20))

      // Toggle About sticky sub-nav strictly based on sidebar active section
      const headerEl = document.querySelector('header')
      const headerOffset = (headerEl?.offsetHeight ?? 64)
      setShowAboutNav(active === 'about')

      // Determine which top-level section is currently active based on viewport and header
      let bestId = active
      let bestDist = Infinity
      sections.forEach((s) => {
        const el = document.getElementById(s.id)
        if (!el) return
        const r = el.getBoundingClientRect()
        // section considered when it overlaps area below the header
        const overlaps = r.bottom > headerOffset + 8 && r.top < window.innerHeight * 0.6
        const dist = Math.abs(r.top - headerOffset)
        if (overlaps && dist < bestDist) {
          bestDist = dist
          bestId = s.id
        }
      })
      if (bestId !== active) setActive(bestId)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [active])

  // Scroll spy for About tabs
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAboutActive(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -55% 0px',
        threshold: 0.4,
      }
    )

    aboutTabs.forEach((t) => {
      const el = document.getElementById(t.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen relative text-white">
      {/* No global background color for Home page */}
      {/* Top horizontal navbar minimized on scroll: logo persists, items fade (overlay, no background) */}
      <header className="fixed top-0 left-0 right-0 z-20 text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between transition-all">
          <div className={`flex items-center gap-2 transform transition-transform duration-300 ${navHidden ? 'translate-y-4' : ''}`}>
            <div className="relative w-12 h-12 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
              <img
                src="/logo.png"
                alt="volksskatt logo"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <span className="absolute inset-0 flex items-center justify-start pl-[30px] -translate-x-[3px] -translate-y-[-9px] pointer-events-none text-[15px] md:text-base font-semibold tracking-wide text-white drop-shadow">
                volksskatt
              </span>
            </div>
            <span className="hidden sm:flex -ml-3 flex-col leading-none text-white/90 drop-shadow-sm mt-[3px]">
              <span className="font-medium tracking-wider text-[9px] md:text-sm opacity-90 mt-[40px] ml-6 md:ml-17">infotech</span>
            </span>
          </div>
          {/* Text-based nav (fades out when navHidden). No background at start */}
          <nav className={`hidden md:flex items-center gap-1 text-sm rounded-full transition-opacity duration-300 ${navHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-3 py-1.5 rounded-full focus:outline-none focus-visible:outline-none ${
                  active === s.id
                    ? (s.id === 'home' ? 'text-white/80' : 'bg-white/20 text-amber-200')
                    : 'text-white/80'
                }`}
                aria-current={active === s.id ? 'page' : undefined}
              >
                {s.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {/* Circular menu icon (always visible; 3-color theme)
               - Top (hero): light pill, dark bars
               - Scrolled: dark pill, white bars
               - Open: amber pill, dark "×" */}
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className={`h-9 w-9 rounded-full grid place-items-center shadow transition-colors ${
                menuOpen ? 'bg-amber-400 text-slate-900' : navHidden ? 'bg-slate-900 text-white' : 'bg-white/90 hover:bg-white text-slate-900'
              }`}
            >
              <span className="sr-only">Menu</span>
              {!menuOpen ? (
                <span className="flex flex-col items-center gap-1">
                  <span className={`block h-0.5 w-4 ${navHidden ? 'bg-white' : 'bg-slate-900'}`}></span>
                  <span className={`block h-0.5 w-3 ${navHidden ? 'bg-white' : 'bg-slate-900'}`}></span>
                  <span className={`block h-0.5 w-5 ${navHidden ? 'bg-white' : 'bg-slate-900'}`}></span>
                </span>
              ) : (
                <span className={`text-lg ${'text-slate-900'}`}>×</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Right-side overlay menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-30">
          <button
            className="absolute inset-0 w-full h-full bg-black/30"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-[88%] sm:w-[420px] bg-white text-slate-800 shadow-2xl overflow-y-auto">
            <div className="relative h-full bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_12px)]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-slate-900 grid place-items-center text-white font-bold">V</div>
                  <span className="font-semibold">volksskatt</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close"
                  className="h-9 w-9 rounded-full border border-slate-300 hover:bg-slate-100 grid place-items-center"
                >
                  ×
                </button>
              </div>
              <nav className="px-6 py-6 space-y-4">
                {[
                  { id: 'home', label: 'Navigate your next' },
                  { id: 'about', label: 'About Us' },
                  { id: 'services', label: 'Services' },
                  { id: 'career', label: 'Careers' },
                  { id: 'contact', label: 'Contact Us' },
                  { id: 'login', label: 'Login' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMenuOpen(false)
                      if (item.id === 'login') {
                        navigate('/login')
                      } else {
                        scrollTo(item.id)
                      }
                    }}
                    className="block w-full text-left text-lg font-semibold"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 text-slate-600 text-sm">
                  <div className="font-semibold mb-2">volksskatt</div>
                  <ul className="space-y-1">
                    <li>Investors</li>
                    <li>Newsroom</li>
                  </ul>
                </div>
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Left vertical nav like dots/labels */}
      <aside className="fixed left-3 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-start gap-3 z-10">
        {sections
          .filter((s) => s.id === active) // only show current section heading
          .map((s) => {
            const onLight = ['about','services','career','contact'].includes(active)
            const base = onLight
              ? 'bg-slate-900/90 text-white border-slate-800'
              : 'bg-white/15 text-white border-white/10'
            const line = onLight ? 'bg-white' : 'bg-white'
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`group flex items-center gap-2 text-xs rounded-full px-3 py-1.5 backdrop-blur border shadow ${base} focus:outline-none focus-visible:outline-none`}
                aria-current="true"
              >
                <span className={`h-px w-8 ${line}`} />
                <span className="hidden md:inline">{s.label}</span>
              </button>
            )
          })}
      </aside>

      {/* Sections */}
      <main>
        {/* Home hero as full-screen image carousel with overlay text */}
        <section id="home" className="relative h-screen overflow-hidden">
          {/* Slides */}
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20" />
            </div>
          ))}

          {/* Left/Right arrows removed as requested */}

          {/* Text overlay */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 grid md:grid-cols-2 items-start gap-8">
            <div className="md:col-start-2 md:mt-6 md:pl-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                {slides[slide].title}
              </h1>
              <p className="mt-4 text-white/90 text-lg">
                {slides[slide].caption}
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => navigate('/login')} className="px-5 py-2 rounded-full bg-white/90 text-gray-900 font-medium hover:bg-white">
                  Login to App
                </button>
                <button onClick={() => scrollTo('about')} className="px-5 py-2 rounded-full border border-white/60 font-medium hover:bg-white/10">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Dots (hidden initially; appear when user moves within Home) */}
          {showDots && (
            <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-10 flex items-center justify-center gap-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-3 w-3 rounded-full border border-white ${idx === slide ? 'bg-white' : 'bg-transparent hover:bg-white/60'} transition`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Scroll-to-top floating arrow (returns to top/fit to screen) */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-30 h-11 w-11 rounded-full grid place-items-center bg-white/80 text-slate-800 shadow-lg hover:bg-white"
          >
            ↑
          </button>
        )}

        {/* About section with sticky sub-navigation (like the screenshot) */}
        <section id="about" className="min-h-[60vh] px-0 md:px-0 py-0 scroll-mt-24 bg-gradient-to-b from-teal-50 via-sky-50 to-indigo-50 text-slate-900">
          {/* Sticky sub-nav: only show when About section is active */}
          {showAboutNav && (
            <div className="sticky top-14 md:top-16 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
              <div className="max-w-6xl mx-auto px-4">
                <nav className="flex gap-14 md:gap-16 overflow-x-auto no-scrollbar text-sm md:text-base">
                  {aboutTabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => scrollTo(t.id)}
                      className={`relative py-4 whitespace-nowrap text-slate-700 border-b-2 transition-colors focus:outline-none focus-visible:outline-none after:content-[\"\"] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-purple-600 ${
                        aboutActive === t.id ? 'text-slate-900 border-purple-600 after:w-full w-max' : 'border-transparent after:w-0'
                      }`}
                      aria-current={aboutActive === t.id ? 'page' : undefined}
                    >
                      {t.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Content blocks for each About sub-section */}
          <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">
            {/* Meet */}
            <div id="about-meet" className="grid md:grid-cols-2 gap-8 items-center scroll-mt-24">
              {/* Text first, video on the right to resemble screenshot (no card background) */}
              <div className="py-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Meet Volksskatt</h2>
                <div className="space-y-5 text-slate-700 leading-relaxed text-lg">
                  <p>
                    We are a global technology company, home to talented people across many countries, delivering industry-leading
                    capabilities centered around digital, engineering, cloud and AI, powered by a broad portfolio of technology services
                    and products.
                  </p>
                  <p>
                    We work with clients across all major verticals, providing industry solutions for Financial Services, Manufacturing,
                    Life Sciences and Healthcare, High Tech, Semiconductor, Telecom and Media, Retail and CPG and Public Services.
                    Consolidated revenues as of 12 months ending June 2025 totaled $14 billion.
                  </p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop"
                  alt="Volksskatt company preview"
                  className="w-full h-72 md:h-96 object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Numbers */}
            <div id="about-numbers" className="scroll-mt-24">
              {/* Full-bleed dark band (no rounded card) */}
              <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#0b0f12] text-white overflow-hidden">
                {/* subtle vignette and gradient sweep */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_10%,rgba(99,102,241,0.15),transparent_60%)]" />
                <div className="relative max-w-6xl mx-auto grid md:grid-cols-1 gap-8 p-6 md:p-10">
                  {/* Left: title, copy, metrics */}
                  <div>
                    <h3 className="text-3xl md:text-4xl font-semibold mb-4">Progress in Numbers</h3>
                    <p className="text-slate-300 max-w-2xl mb-8">
                      Powered by a global team, we deliver smarter, better ways for all our stakeholders to benefit from technology.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
                      {[
                        { k: 'Revenue', value: 14, prefix: '$', suffix: ' B' },
                        { k: 'People', value: 223, suffix: 'K' },
                        { k: 'Countries', value: 60, suffix: '' },
                        { k: 'Nationalities', value: 167, suffix: '' },
                        { k: 'Delivery Centers', value: 220, suffix: '+' },
                        { k: 'Labs', value: 70, suffix: '+' },
                        { k: 'Clients using our software and products', value: 20000, suffix: '+' },
                        { k: 'Patents driving innovations', value: 2200, suffix: '+' },
                        { k: 'Top employer in twenty-six countries', value: 26, suffix: '' },
                      ].map((m) => {
                        const n = useCountUp(m.value, numbersStarted, 1200)
                        const formatted = n.toLocaleString()
                        return (
                          <div key={m.k} className="flex flex-col">
                            <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                              {`${m.prefix ?? ''}${formatted}${m.suffix ?? ''}`}
                            </div>
                            <div className="text-xs md:text-sm text-slate-400 mt-1 leading-snug">{m.k}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values */}
            <div id="about-values" className="scroll-mt-24">
              <h3 className="text-2xl font-semibold mb-4">Living Our Values</h3>
              <p className="text-slate-700 max-w-3xl">Craft, curiosity, and customer empathy drive our decisions. We obsess over DX and UX equally.</p>
            </div>

            {/* Purpose */}
            <div id="about-purpose" className="scroll-mt-24">
              <h3 className="text-2xl font-semibold mb-4">Our Purpose</h3>
              <p className="text-slate-700 max-w-3xl">Build resilient, ethical software that empowers people and businesses to do their best work.</p>
            </div>

            {/* Journey */}
            <div id="about-journey" className="scroll-mt-24">
              <h3 className="text-2xl font-semibold mb-4">Our Journey</h3>
              <p className="text-slate-700 max-w-3xl">From a small dev shop to a trusted engineering partner across domains and geographies.</p>
            </div>

            {/* Stories */}
            <div id="about-stories" className="scroll-mt-24">
              <h3 className="text-2xl font-semibold mb-4">Stories of Progress</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[1,2,3].map((i)=> (
                  <div key={i} className="group bg-white rounded-xl overflow-hidden shadow border border-slate-200 hover-tilt-small hover-ripple">
                    <img src={`https://picsum.photos/seed/story${i}/640/360`} alt="story" className="h-40 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] hover-shine"/>
                    <div className="p-4">
                      <div className="font-semibold">Case Study #{i}</div>
                      <div className="text-sm text-slate-600">How we shipped measurable outcomes.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services with image cards, light background (updated palette) */}
        <section id="services" className="min-h-[60vh] px-6 py-16 scroll-mt-24 bg-gradient-to-b from-teal-50 via-sky-50 to-indigo-50 text-slate-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Frontend Engineering',
                  img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
                },
                {
                  title: 'Cloud & DevOps',
                  img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop',
                },
                {
                  title: 'Data & AI UI',
                  img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
                },
              ].map((card) => (
                <div key={card.title} className="group bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 hover-tilt-small hover-ripple">
                  <img src={card.img} alt={card.title} className="h-44 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] hover-shine" loading="lazy" />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">{card.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Career with people image, light background (updated palette) */}
        <section id="career" className="min-h-[60vh] px-6 py-16 scroll-mt-24 bg-gradient-to-b from-teal-50 via-sky-50 to-indigo-50 text-slate-900">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">Career</h2>
              <p className="max-w-2xl text-slate-700">
                Join a team that values craft, curiosity, and autonomy. We invest in mentorship and continuous learning.
              </p>
              <button onClick={() => navigate('/login')} className="mt-4 px-5 py-2 rounded bg-slate-900 text-white font-medium">Apply Now</button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"
              alt="Team standup"
              className="rounded-xl shadow-lg object-cover w-full h-72 md:h-96 transition-transform duration-500 ease-out hover:scale-[1.03] hover-shine hover-tilt-small hover-ripple"
              loading="lazy"
            />
          </div>
        </section>

        {/* Contact with light background (updated palette) */}
        <section id="contact" className="min-h-[60vh] px-6 py-16 scroll-mt-24 bg-gradient-to-b from-teal-50 via-sky-50 to-indigo-50 text-slate-900">
          <div className="relative z-0 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="relative z-10 p-6 rounded-2xl bg-white border border-slate-200 shadow-xl">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">Contact Us</h2>
              <p className="max-w-2xl text-slate-700">
                Tell us about your project. We’ll get back within 24 hours.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <input className="px-3 py-2 rounded-lg bg-white border border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Name" />
                <input className="px-3 py-2 rounded-lg bg-white border border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Email" />
                <input className="px-3 py-2 rounded-lg bg-white border border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:col-span-2" placeholder="Company" />
                <textarea className="px-3 py-2 rounded-lg bg-white border border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:col-span-2" placeholder="Message" rows="3" />
              </div>
              <button className="mt-4 px-5 py-2 rounded-full bg-slate-900 text-white font-medium">Send</button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1600&auto=format&fit=crop"
              alt="Support and contact"
              className="relative z-20 pointer-events-auto rounded-xl shadow-lg object-cover w-full h-72 md:h-96 transition-transform duration-500 ease-out hover:scale-[1.03] hover-shine hover-tilt-small hover-ripple"
              loading="lazy"
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-white/70 text-sm">
        <div className="max-w-7xl mx-auto">© {new Date().getFullYear()} volksskatt</div>
      </footer>
    </div>
  )
}
