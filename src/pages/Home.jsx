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
  { id: 'about-our-approach', label: 'Our Approach' },
  { id: 'about-journey', label: 'Our Team' },
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
      // IT-themed corporate hero section (clean, high-contrast design)
      img: '/image3.png',
      // Adjust the visible framing of the image (tweak as needed)
      pos: '50% 35%', // x y (percentage) – moves focus slightly upward
      title: 'Volksskatt  Code. Create. Animate.',
      caption: 'A vibrant fusion of technology and imagination, where developers and designers bring futuristic worlds, games, and ideas to life through innovation and creativity.',
    },
    
    {
      img: '/image1.png',
      pos: '70% 20%',
      style: {
        backgroundSize: '100%',    // zoom out
        backgroundRepeat: 'no-repeat',
      },
      title: 'Python Powering the Future of AI',
      caption: 'A perfect blend of code, data, and innovation — where Python drives intelligence, visualization, and discovery in a futuristic workspace.',
    },
    {
      img: '/image2.png',
      title: 'Cybersecurity Analyst Monitoring Global Threats at Night.',
      caption: 'Cybersecurity analyst monitors global threats with real-time data on multiple screens.A focused workspace with digital dashboards and cityscape views at night',
    },
    {
      img: '/image4.png',
      title: 'Research Team Collaboration in Modern Office',
      caption: 'A diverse research team collaborates around computer monitors and a whiteboard in a bright office.',
    },
  ]
  const [slide, setSlide] = useState(0)
  const [showDots, setShowDots] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [careerOpen, setCareerOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  // Autoplay controls
  const [isPaused, setIsPaused] = useState(false)
  const resumeTimer = useRef(null)
  const [isVisible, setIsVisible] = useState(typeof document !== 'undefined' ? !document.hidden : true)
  // Manual pause toggle (persistent until user plays again)
  const [manualPaused, setManualPaused] = useState(false)
  const toggleManualPause = () => {
    setManualPaused((prev) => {
      const next = !prev
      if (next) {
        // entering manual pause
        setIsPaused(true)
        if (resumeTimer.current) {
          clearTimeout(resumeTimer.current)
          resumeTimer.current = null
        }
      } else {
        // resuming from manual pause
        setIsPaused(false)
      }
      return next
    })
  }
  const prevSlide = () => setSlide((s) => (s - 1 + slides.length) % slides.length)
  const nextSlide = () => setSlide((s) => (s + 1) % slides.length)

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Pause/Resume helpers for autoplay
  const pauseAutoplay = () => {
    // temporary pause (e.g., hover/touch), does not override manual paused state
    if (!manualPaused) setIsPaused(true)
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }
  }
  const resumeAfterDelay = (delay = 2500) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      if (!manualPaused) setIsPaused(false)
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }, delay)
  }

  // Track page visibility to avoid running timers in background tabs
  useEffect(() => {
    const onVis = () => setIsVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [])

  // Autoplay the hero slides every 2s when on Home, visible, and not paused
  useEffect(() => {
    if (active !== 'home' || isPaused || manualPaused || !isVisible) return
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length)
    }, 2000)
    return () => clearInterval(id)
  }, [active, isPaused, manualPaused, isVisible, slides.length])

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
      <header className={`fixed top-0 left-0 right-0 z-20 text-white`}>
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between transition-all">
          <div className={`flex items-center gap-2 transition-opacity duration-300 ${active === 'home' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="relative flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/60 backdrop-blur-md backdrop-saturate-150 ring-1 ring-white/20 shadow-lg">
              {/* subtle glow behind */}
              <div className="pointer-events-none absolute -inset-1 rounded-full bg-white/10 blur-md opacity-60" aria-hidden="true" />
              <div className="relative w-12 h-12 drop-shadow-[0_6px_14px_rgba(0,0,0,0.75)]">
                <img
                  src="/logo.png"
                  alt="volksskatt logo"
                  className="absolute inset-0 w-full h-full object-contain scale-[1.18] brightness-125 contrast-125 saturate-125"
                />
                <span className="absolute inset-0 flex items-center justify-start pl-[30px] -translate-x-[3px] -translate-y-[-9px] pointer-events-none text-[17px] md:text-lg font-semibold tracking-wide text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)]">
                  volksskatt
                </span>
              </div>
            </div>
            <span className="hidden sm:flex -ml-3 flex-col leading-none text-white/90 drop-shadow-sm mt-[3px]">
              <span className="font-medium tracking-wider text-[11px] md:text-base opacity-90 mt-[40px] ml-6 md:ml-17">infotech</span>
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
          <div className="flex items-center gap-3">
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
                  {/* Reused logo pill */}
                  <div className="relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/60 backdrop-blur-md backdrop-saturate-150 ring-1 ring-white/20 shadow">
                    <div className="pointer-events-none absolute -inset-1 rounded-full bg-black/5 blur-md opacity-60" aria-hidden="true" />
                    <div className="relative w-10 h-10 drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]">
                      <img
                        src="/logo.png"
                        alt="volksskatt logo"
                        className="absolute inset-0 w-full h-full object-contain scale-[1.18] brightness-125 contrast-125 saturate-125"
                      />
                      <span className="absolute inset-0 flex items-center justify-start pl-[26px] -translate-x-[3px] -translate-y-[-7px] pointer-events-none text-[15px] font-semibold tracking-wide text-slate-900">
                        volksskatt
                      </span>
                    </div>
                  </div>
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
                  { id: 'about', label: 'About Us' },
                  { id: 'services', label: 'Services' },
                  { id: 'career', label: 'Careers' },
                  { id: 'contact', label: 'Contact Us' },
                ].map((item) => (
                  item.id === 'career' ? (
                    <div key={item.id} className="space-y-2">
                      <button
                        onClick={() => setCareerOpen((v) => !v)}
                        className="w-full flex items-center justify-between text-left text-lg font-semibold"
                        aria-expanded={careerOpen}
                        aria-controls="career-submenu"
                      >
                        <span>{item.label}</span>
                        <span className={`transition-transform ${careerOpen ? 'rotate-180' : ''}`}>▾</span>
                      </button>
                      {careerOpen && (
                        <div id="career-submenu" className="pl-4">
                          <button
                            onClick={() => {
                              setMenuOpen(false)
                              navigate('/careers')
                            }}
                            className="block w-full text-left text-base text-slate-700 hover:text-slate-900"
                          >
                            Careers Home
                          </button>
                          <button
                            onClick={() => {
                              setMenuOpen(false)
                              navigate('/jobspost')
                            }}
                            className="block w-full text-left text-base text-slate-700 hover:text-slate-900"
                          >
                            Serch for Jobs
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMenuOpen(false)
                        scrollTo(item.id)
                      }}
                      className="block w-full text-left text-lg font-semibold"
                    >
                      {item.label}
                    </button>
                  )
                ))}
                {/* Login dropdown */}
                <div className="pt-4">
                  <button
                    onClick={() => setLoginOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-left text-lg font-semibold"
                    aria-expanded={loginOpen}
                    aria-controls="login-submenu"
                  >
                    <span>Login</span>
                    <span className={`transition-transform ${loginOpen ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {loginOpen && (
                    <div id="login-submenu" className="pl-4 mt-2 grid grid-cols-1 gap-2">
                      <button onClick={() => { setMenuOpen(false); navigate('/login-admin'); }} className="w-full text-left text-base text-slate-700 hover:text-slate-900">Admin Login</button>
                      <button onClick={() => { setMenuOpen(false); navigate('/login-hr'); }} className="w-full text-left text-base text-slate-700 hover:text-slate-900">HR Login</button>
                      <button onClick={() => { setMenuOpen(false); navigate('/login-employee'); }} className="w-full text-left text-base text-slate-700 hover:text-slate-900">Employee Login</button>
                    </div>
                  )}
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
        <section
          id="home"
          className="relative h-screen overflow-hidden"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={() => resumeAfterDelay(2500)}
          onTouchStart={pauseAutoplay}
          onTouchEnd={() => resumeAfterDelay(2500)}
        >
          {/* Slides */}
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: s.pos || '50% 50%',
                  transform: idx === slide ? 'scale(1.08)' : 'scale(1.02)',
                  transition: 'transform 7000ms ease-out',
                }}
                loading="eager"
              />
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
            </div>
          </div>

          {/* Dots (hidden initially; appear when user moves within Home) */}
          {showDots && (
            <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-10 flex items-center justify-center gap-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { pauseAutoplay(); setSlide(idx); resumeAfterDelay(3000); }}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-3 w-3 rounded-full border border-white ${idx === slide ? 'bg-white' : 'bg-transparent hover:bg-white/60'} transition`}
                />
              ))}
              <button
                onClick={toggleManualPause}
                aria-label={manualPaused ? 'Play slideshow' : 'Pause slideshow'}
                className="ml-4 h-8 w-8 grid place-items-center rounded-full border border-white/70 text-white bg-black/30 backdrop-blur hover:bg-black/40"
              >
                {manualPaused ? (
                  // Play icon
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7-11-7z" />
                  </svg>
                ) : (
                  // Pause icon
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                )}
              </button>
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
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
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
                  src="/image5.png"
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
                            <div className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow">
                              {`${m.prefix ?? ''}${formatted}${m.suffix ?? ''}`}
                            </div>
                            <div className="text-xs md:text-sm text-slate-400 mt-1 leading-snug">{m.k}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right: animated decorative globe (md+) */}
                  <div className="hidden md:block pointer-events-none select-none" aria-hidden="true">
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-60">
                      {/* soft glow behind */}
                      <div className="absolute inset-0 blur-2xl rounded-full bg-cyan-500/10 w-[460px] h-[460px] translate-x-6 translate-y-6" />
                      <svg width="440" height="440" viewBox="0 0 440 440" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className="animate-spin" style={{ animationDuration: '22s' }}>
                        <defs>
                          <radialGradient id="glo" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35"/>
                            <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
                          </radialGradient>
                        </defs>
                        <circle cx="220" cy="220" r="200" stroke="url(#glo)" strokeWidth="1.2"/>
                        {/* latitude lines */}
                        {[ -60,-30,0,30,60 ].map((lat, i) => (
                          <ellipse key={i} cx="220" cy="220" rx={200*Math.cos(Math.PI*lat/180)} ry={200*Math.sin(Math.PI*30/180)} stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="0.8" fill="none" />
                        ))}
                        {/* longitude lines */}
                        {[0,30,60,90,120,150].map((deg, i) => (
                          <path key={i} d={`M 220 20 A 200 200 0 0 1 220 420`} stroke="#60a5fa" strokeOpacity="0.18" strokeWidth="0.8" fill="none" transform={`rotate(${deg} 220 220)`} />
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values */}
            <div id="about-values" className="scroll-mt-24">
              <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-slate-900">Living Our Values</h3>
              <p className="text-slate-700 max-w-3xl mb-8">
                Our <span className="font-semibold">core values</span> offer a nod to the past with an eye to the future
              </p>

              {/* First row: 3 cards */}
              <div className="grid md:grid-cols-3 gap-6 md:gap-7">
                {[
                  {
                    title: 'Integrity',
                    body:
                      'We maintain the highest ethical standards and are committed to doing the right thing, all the time.',
                  },
                  {
                    title: 'Inclusion',
                    body:
                      'We create an environment where everyone can succeed and be encouraged to be their best and most authentic selves. We believe in providing equal access and opportunities to all.',
                  },
                  {
                    title: 'Value Creation',
                    body:
                      "We’re obsessed with creating value for our clients and supercharging their progress in a secure manner. We always go the extra mile to deliver on our commitments and identify new opportunities for growth.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="group rounded-xl bg-white border border-slate-200 shadow-sm p-6 md:p-7 min-h-[220px] transition-all duration-300 ease-out hover:bg-slate-900 hover:border-slate-800 hover:shadow-lg hover:-rotate-1"
                  >
                    <div className="font-semibold text-slate-900 mb-2 transition-colors group-hover:text-white">{c.title}</div>
                    <p className="text-slate-700 text-sm leading-relaxed transition-colors group-hover:text-white/90">{c.body}</p>
                  </div>
                ))}
              </div>

              {/* Second row: 2 cards centered */}
              <div className="mt-6 grid md:grid-cols-2 gap-6 md:gap-7 max-w-4xl">
                {[
                  {
                    title: 'People–centricity',
                    body:
                      'We encourage our people to “find their spark” and shape their career journeys. We empower people to be entrepreneurs and creators, encouraging them to surface ideas, big and small.',
                  },
                  {
                    title: 'Social Responsibility',
                    body:
                      'We give back to our communities, and we are focused on doing the right things for our planet and the communities where we work and live.',
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="group rounded-xl bg-white border border-slate-200 shadow-sm p-6 md:p-7 min-h-[220px] transition-all duration-300 ease-out hover:bg-slate-900 hover:border-slate-800 hover:shadow-lg hover:-rotate-1"
                  >
                    <div className="font-semibold text-slate-900 mb-2 transition-colors group-hover:text-white">{c.title}</div>
                    <p className="text-slate-700 text-sm leading-relaxed transition-colors group-hover:text-white/90">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Approach (replaces Purpose) */}
            <div id="about-our-approach" className="scroll-mt-24">
              <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-slate-900">Our Approach</h3>
              <p className="text-slate-700 max-w-3xl mb-8">
                Our approach is built on Four pillars
              </p>

              <div className="grid md:grid-cols-4 gap-7">
                {/* Innovation at Core */}
                <div className="group flip-card h-[400px]">
                  <div className="flip-inner rounded-xl shadow-md">
                    <div className="flip-face flip-front rounded-xl bg-[#0f1422] text-white p-7">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="shrink-0 text-cyan-400">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <div>
                          <div className="text-2xl font-semibold mb-2">Innovation at Core</div>
                          <p className="text-white/80 text-sm leading-relaxed">Constantly evolving with emerging technologies like AI, cloud computing, and automation.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flip-face flip-back rounded-xl text-white p-7 bg-gradient-to-br from-fuchsia-600 via-indigo-600 to-cyan-500">
                      <div className="flex items-start gap-4">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <div>
                          <div className="text-2xl font-semibold mb-2">Innovation at Core</div>
                          <p className="text-white/90 text-sm leading-relaxed">We embrace innovation to deliver future-ready solutions that keep businesses ahead of the curve.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client-Centric Focus */}
                <div className="group flip-card h-[400px]">
                  <div className="flip-inner rounded-xl shadow-md">
                    <div className="flip-face flip-front rounded-xl bg-[#0f1422] text-white p-7">
                      <div className="flex items-start gap-4">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="shrink-0 text-indigo-400">
                          <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 21a9 9 0 0118 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <div>
                          <div className="text-2xl font-semibold mb-2">Client‑Centric Focus</div>
                          <p className="text-white/80 text-sm leading-relaxed">Every solution is tailored to solve real challenges, ensuring measurable business outcomes.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flip-face flip-back rounded-xl text-white p-7 bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-500">
                      <div className="flex items-start gap-4">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
                          <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 21a9 9 0 0118 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <div>
                          <div className="text-2xl font-semibold mb-2">Client‑Centric Focus</div>
                          <p className="text-white/90 text-sm leading-relaxed">Our approach focuses on innovation, scalability, and long-term value to drive sustainable growth.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*Planet */}
                <div className="group flip-card h-[400px]">
                  <div className="flip-inner rounded-xl shadow-md">
                    <div className="flip-face flip-front rounded-xl bg-[#0f1422] text-white p-7">
                      <div className="flex items-start gap-4">
                      <svg xmlns="http://www.w3.org/2000/svg"width="36" height="36" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"className="shrink-0 text-indigo-400">
                          <circle cx="12" cy="12" r="9"/>
                          <path d="M2 12h20"/>
                          <path d="M12 3c2.5 0 4.5 4 4.5 9s-2 9-4.5 9-4.5-4-4.5-9 2-9 4.5-9z"/>
                      </svg>
                        <div>
                          <div className="text-2xl font-semibold mb-2">Planet</div>
                          <p className="text-white/80 text-sm leading-relaxed">We deliver long-lasting impact through out a action as a company and through our pacts with stakeholders for a more sustainable future.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flip-face flip-back rounded-xl text-white p-7 bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-500">
                      <div className="flex items-start gap-4">
                      <svg xmlns="http://www.w3.org/2000/svg"width="36" height="36" viewBox="0 0 24 24" fill="none"stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"className="shrink-0 text-white">
                      <circle cx="12" cy="12" r="9"/>
                      <path d="M2 12h20"/>
                      <path d="M12 3c2.5 0 4.5 4 4.5 9s-2 9-4.5 9-4.5-4-4.5-9 2-9 4.5-9z"/>
                      </svg>
                        <div>
                          <div className="text-2xl font-semibold mb-2">Planet</div>
                          <p className="text-white/90 text-sm leading-relaxed"><li><strong>107B+</strong><strong>Liters </strong>"of water harvested"</li><li><strong>73,000+​ Acres </strong>of land greened</li><li><strong>29%​ Reduction in energy consumption</strong> (compared to FY20 baseline)</li></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trusted Partnerships */}
                <div className="group flip-card h-[400px]">
                  <div className="flip-inner rounded-xl shadow-md">
                    <div className="flip-face flip-front rounded-xl bg-[#0f1422] text-white p-7">
                      <div className="flex items-start gap-4">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="shrink-0 text-fuchsia-400">
                          <path d="M7 11l5 5L22 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="2" y="12" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                        <div>
                          <div className="text-2xl font-semibold mb-2">Trusted Partnerships</div>
                          <p className="text-white/80 text-sm leading-relaxed">Beyond services, we build long‑term collaborations based on trust, transparency, and shared success.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flip-face flip-back rounded-xl text-white p-7 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500">
                      <div className="flex items-start gap-4">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
                          <path d="M7 11l5 5L22 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="2" y="12" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                        </svg>
                        <div>
                          <div className="text-2xl font-semibold mb-2">Trusted Partnerships</div>
                          <p className="text-white/90 text-sm leading-relaxed">We work hand-in-hand with clients, ensuring sustainable growth, innovation, and mutual value creation.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Team */}
            <div id="about-journey" className="scroll-mt-24">
              <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-slate-900">Our Team</h3>
              <p className="text-slate-700 max-w-3xl mb-6">The people behind the craft. Designers, engineers and partners obsessed with outcomes.</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Aarav N.', role: 'Principal Engineer', img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop' },
                  { name: 'Priya S.', role: 'Design Lead', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop' },
                  { name: 'Rahul K.', role: 'DevOps Architect', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop' },
                  { name: 'Maya V.', role: 'Data Scientist', img: 'https://images.unsplash.com/photo-1544005316-04ce1f1a19a8?q=80&w=600&auto=format&fit=crop' },
                ].map((m) => (
                  <div
                    key={m.name}
                    className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-52">
                      <img
                        src={m.img}
                        alt={m.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        loading="lazy"
                      />
                      {/* Gradient + shine on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="pointer-events-none absolute inset-0 group-hover:animate-[shine_1.2s_ease-out]" />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">{m.name}</div>
                          <div className="text-sm text-slate-600">{m.role}</div>
                        </div>
                        {/* Socials */}
                        <div className="flex items-center gap-2 opacity-80">
                          <a href="#" aria-label="LinkedIn" className="p-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5ZM5.5 8.75h2.9v9.75H5.5Zm5.22 0h2.78v1.33h.04A3.05 3.05 0 0 1 16.2 8.6c2.1 0 3.5 1.37 3.5 4.32v5.58h-2.89v-5.22c0-1.24-.44-2.09-1.54-2.09a1.67 1.67 0 0 0-1.56 1.11 2.1 2.1 0 0 0-.1.75v5.45h-2.89Z"/></svg>
                          </a>
                          <a href="#" aria-label="GitHub" className="p-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.6.07-.59.07-.59 1 .07 1.52 1.04 1.52 1.04.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.64 0 0 .85-.27 2.78 1.02A9.7 9.7 0 0 1 12 6.84c.86 0 1.73.12 2.54.36 1.93-1.29 2.78-1.02 2.78-1.02.55 1.38.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.69.92.69 1.86v2.75c0 .26.18.57.69.48A10 10 0 0 0 12 2Z"/></svg>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Hover border glow */}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-indigo-300/60 transition" />
                  </div>
                ))}
              </div>

              {/* Small CSS keyframe for shine effect */}
              <style>{`@keyframes shine{0%{background:linear-gradient(120deg,transparent 0%,transparent 30%,rgba(255,255,255,0.25) 45%,transparent 60%,transparent 100%);opacity:0}60%{opacity:1}100%{opacity:0}}`}</style>
            </div>

            {/* Stories of Progress – animated carousel */}
            <div id="about-stories" className="scroll-mt-24">
              <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-slate-900">Stories of Progress</h3>
              <p className="text-slate-700 mb-6">Selected case studies that highlight craft, velocity and measurable business outcomes.</p>

              {/* Horizontal scroll-snap carousel with gradient edges */}
              <div className="relative">
                {/* edges */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent opacity-90"/>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent opacity-90"/>

                <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 pr-2 -mr-2 no-scrollbar">
                  {[
                    {
                      img: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1400&auto=format&fit=crop',
                      tag: 'AI & Data',
                      title: 'Real-time insights at scale',
                      text: 'Deployed streaming analytics with sub‑second dashboards that cut decision time by 63%.',
                    },
                    {
                      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
                      tag: 'Platform',
                      title: 'Modernized CI/CD for 400+ services',
                      text: 'Reduced lead time from days to minutes with golden pipelines and policy as code.',
                    },
                    {
                      img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1400&auto=format&fit=crop',
                      tag: 'Experience',
                      title: 'Reimagined customer onboarding',
                      text: 'Shipped a new React app that improved completion rates by 28% within one quarter.',
                    },
                    {
                      img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1400&auto=format&fit=crop',
                      tag: 'Cloud',
                      title: 'Cost‑aware multi‑region architecture',
                      text: 'Achieved 99.99% availability and 37% cost savings through right‑sizing and autoscaling.',
                    },
                  ].map((c, i) => (
                    <article
                      key={c.title}
                      className="group relative shrink-0 w-[86%] sm:w-[58%] lg:w-[38%] snap-start rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500"
                      style={{ animation: `riseIn 700ms ${100 * i}ms both` }}
                    >
                      {/* media */}
                      <div className="relative h-44">
                        <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <span className="absolute left-3 bottom-3 inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-slate-800 shadow">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          {c.tag}
                        </span>
                      </div>

                      {/* content */}
                      <div className="p-5">
                        <h4 className="text-lg font-semibold text-slate-900 leading-snug">{c.title}</h4>
                        <p className="mt-1.5 text-sm text-slate-600">{c.text}</p>
                        <div className="mt-4 flex items-center gap-2 text-indigo-600 group/link hover:text-indigo-700">
                          <span className="text-sm font-medium">Read case study</span>
                          <svg className="transition-transform duration-300 group-hover/link:translate-x-0.5" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
                        </div>
                      </div>

                      {/* hover outline + ripple */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-indigo-300/70 transition" />
                      <div className="pointer-events-none absolute -inset-[120%] translate-x-[-40%] translate-y-[-40%] bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_45%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </article>
                  ))}
                </div>

                {/* tiny helper styles */}
                <style>{`
                  .no-scrollbar::-webkit-scrollbar{display:none}
                  .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
                  @keyframes riseIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
                `}</style>
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
                  img: '/Services/Frontend.png',
                  variant: 'tilt',
                  pos: '10% 10%',
                  description:
                    'Frontend engineers build the user-facing parts of websites and apps, focusing on design, interactivity, and performance.',
                },
                {
                  title: 'Cloud & DevOps',
                  img: '/Services/could devops.png',
                  variant: 'parallax',
                  pos: '10% 10%',
                  description:
                    'Focuses on deploying, automating, and managing applications in cloud environments (AWS, Azure, GCP). Uses DevOps practices like CI/CD, monitoring, and infrastructure as code to ensure reliability and scalability.',
                },
                {
                  title: 'Data & AI',
                  img: '/Services/data and ai.png',
                  variant: 'glow',
                  pos: '10% 10%',
                  description:
                    'Deals with collecting, analyzing, and interpreting data. Uses machine learning, deep learning, and AI techniques to build predictive models, automation, and intelligent systems for better decision-making.',
                },
                {
                  title: 'Mobile & XR',
                  img: '/Services/Mobile & XR.png',
                  variant: 'lift',
                  pos: '10% 10%',
                  description:
                    'Mobile engineers build apps for iOS and Android, while XR (Extended Reality) covers AR, VR, and MR experiences. They design immersive, interactive applications that go beyond traditional screens.',
                },
                {
                  title: 'Security',
                  img: '/Services/Security.png',
                  variant: 'mask',
                  pos: '10% 10%',
                  description:
                    'Focuses on protecting applications, data, and systems from threats. Involves ethical hacking, vulnerability testing, encryption, and compliance to ensure cyber resilience.',
                },
                {
                  title: 'Product Design',
                  img: '/Services/Product Design.png',
                  variant: 'gradient',
                  pos: '10% 10%',
                  description:
                    'Combines user research, UX/UI design, and prototyping to create intuitive, attractive, and functional products. Works closely with engineers and product managers to bring ideas to life.',
                },
              ].map((card, idx) => (
                <div
                  key={card.title}
                  className={`relative group rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm transition-all duration-500 ${
                    card.variant === 'tilt' ? 'hover:-rotate-1 hover:shadow-xl' :
                    card.variant === 'parallax' ? 'hover:shadow-xl' :
                    card.variant === 'glow' ? 'hover:shadow-indigo-200' :
                    card.variant === 'lift' ? 'hover:-translate-y-1 hover:shadow-lg' :
                    card.variant === 'mask' ? 'hover:shadow-xl' :
                    'hover:shadow-xl'
                  }`}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={card.img}
                      alt={card.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        card.variant === 'parallax' ? 'group-hover:scale-[1.12] translate-y-[-2%]' : 'group-hover:scale-[1.06]'
                      }`}
                      loading="lazy"
                      style={{ objectPosition: card.pos || '50% 50%' }}
                    />
                    {card.variant === 'mask' && (
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(0,0,0,0.35),transparent)] mix-blend-multiply" />
                    )}
                    {card.variant === 'gradient' && (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-fuchsia-200/40 via-transparent to-indigo-200/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    {/* outline glow unique per card */}
                    <div className={`pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent transition ${
                      card.variant === 'glow' ? 'group-hover:ring-indigo-300/70' : 'group-hover:ring-slate-300/60'
                    }`} />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{card.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">0{idx+1}</span>
                  </div>
                  {/* description */}
                  {card.description && (
                    <div className="px-4 pb-4 -mt-2 text-sm text-slate-600">
                      {card.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* helper styles for subtle effects */}
            <style>{`@keyframes floatY{0%{transform:translateY(0)}50%{transform:translateY(-4px)}100%{transform:translateY(0)}}`}</style>
          </div>
        </section>

        {/* Career with animated highlight card and distinct effects */}
        <section id="career" className="min-h-[60vh] px-6 py-16 scroll-mt-24 bg-gradient-to-b from-teal-50 via-sky-50 to-indigo-50 text-slate-900">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            {/* Animated highlight card: gradient ring, subtle float */}
            <div className="relative p-[2px] rounded-2xl bg-gradient-to-tr from-indigo-300 via-fuchsia-300 to-cyan-300">
              <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-[floatY_6s_ease-in-out_infinite]">
                <h2 className="text-3xl font-bold mb-3 text-slate-900">Careers at Volksskatt</h2>
                <p className="max-w-2xl text-slate-700">
                  Build the future with us. We empower makers to ship outcomes, learn fast, and grow their craft.
                </p>
                {/* stats with slide-in on view (simple on-load animation) */}
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    {k:'Open Roles',v:'27'},
                    {k:'Locations',v:'12'},
                    {k:'Avg. Tenure',v:'3.8y'},
                  ].map((s,i)=> (
                    <div key={s.k} style={{animation:`riseIn 700ms ${i*120}ms both`}} className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-xl font-semibold text-slate-900">{s.v}</div>
                      <div className="text-xs text-slate-600">{s.k}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => navigate('/jobspost')} className="relative px-5 py-2 rounded-full bg-slate-900 text-white font-medium overflow-hidden">
                    <span className="relative z-10">Explore Roles</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700"/>
                  </button>
                  <button onClick={() => navigate('/careers')} className="px-5 py-2 rounded-full border border-slate-300 font-medium hover:bg-slate-50">Life at Volksskatt</button>
                </div>
              </div>
            </div>

            {/* Distinct effect image: rotate on hover with shadow burst */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop"
                alt="Team standup"
                className="rounded-2xl shadow-lg object-cover w-full h-72 md:h-96 transition-transform duration-700 ease-out hover:rotate-[-1.5deg] hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute -inset-[30%] bg-[radial-gradient(circle,rgba(99,102,241,0.15),transparent_45%)] opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>
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
            {/* Attractive contact cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  k: 'Sales',
                  d: 'Partner with us to build and scale products.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 13V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6m16 0v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4m16 0H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  ),
                  href: 'mailto:sales@volksskatt.com',
                  variant: 'lift'
                },
                {
                  k: 'Support',
                  d: 'We’re here 24/7 to help you succeed.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0v6a6 6 0 1 0 12 0V8z" stroke="currentColor" strokeWidth="1.5"/><path d="M9 10v2M15 10v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  ),
                  href: 'mailto:support@volksskatt.com',
                  variant: 'glow'
                },
                {
                  k: 'Partnerships',
                  d: 'Let’s co‑create value with technology.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  ),
                  href: '#',
                  variant: 'gradient'
                },
                {
                  k: 'Careers',
                  d: 'Find your spark and grow your craft.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M7 7l1.8-2.4A2 2 0 0 1 10.4 4h3.2a2 2 0 0 1 1.6.8L17 7m-6 5v5m6-5v5m-9 0h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  ),
                  href: '/careers',
                  variant: 'ring'
                },
              ].map((c, i) => (
                <a
                  key={c.k}
                  href={c.href}
                  onClick={(e) => { if (c.href.startsWith('/')) { e.preventDefault(); navigate(c.href) } }}
                  className={`group relative rounded-2xl p-5 bg-white border border-slate-200 shadow-sm transition-all duration-500 ${
                    c.variant === 'lift' ? 'hover:-translate-y-1 hover:shadow-lg' :
                    c.variant === 'glow' ? 'hover:shadow-indigo-200' :
                    c.variant === 'gradient' ? '' :
                    c.variant === 'ring' ? '' :
                    ''
                  }`}
                  style={{ animation: `riseIn 700ms ${i*120}ms both` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="grid place-items-center h-10 w-10 rounded-full bg-slate-900 text-white shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{c.k}</div>
                      <div className="text-sm text-slate-600 mt-0.5">{c.d}</div>
                    </div>
                  </div>
                  {/* Unique hover treatments */}
                  {c.variant === 'gradient' && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-fuchsia-200/40 via-transparent to-indigo-200/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  {c.variant === 'ring' && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-indigo-300/70 transition" />
                  )}
                </a>
              ))}
            </div>
            <style>{`
              @keyframes riseIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
            `}</style>
          </div>
        </section>
      </main>

      <footer className="mt-10 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-300">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              {/* Reused logo pill from header */}
              <div className="relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/60 backdrop-blur-md backdrop-saturate-150 ring-1 ring-white/20 shadow-lg">
                <div className="pointer-events-none absolute -inset-1 rounded-full bg-white/10 blur-md opacity-60" aria-hidden="true" />
                <div className="relative w-12 h-12 drop-shadow-[0_6px_14px_rgba(0,0,0,0.75)]">
                  <img
                    src="/logo.png"
                    alt="volksskatt logo"
                    className="absolute inset-0 w-full h-full object-contain scale-[1.18] brightness-125 contrast-125 saturate-125"
                  />
                  <span className="absolute inset-0 flex items-center justify-start pl-[30px] -translate-x-[3px] -translate-y-[-9px] pointer-events-none text-[17px] md:text-lg font-semibold tracking-wide text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)]">
                    volksskatt
                  </span>
                </div>
              </div>
              <span className="hidden sm:flex -ml-3 flex-col leading-none text-white/90 drop-shadow-sm mt-[3px]">
                <span className="font-medium tracking-wider text-[11px] md:text-base opacity-90 mt-[40px] ml-6 md:ml-17">infotech</span>
              </span>
              <p className="mt-4 text-sm text-slate-400 max-w-xs">
                Code. Create. Animate. We partner with teams to ship modern products with measurable outcomes.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {/* social icons */}
                <a href="#" aria-label="LinkedIn" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5ZM5.5 8.75h2.9v9.75H5.5Zm5.22 0h2.78v1.33h.04A3.05 3.05 0 0 1 16.2 8.6c2.1 0 3.5 1.37 3.5 4.32v5.58h-2.89v-5.22c0-1.24-.44-2.09-1.54-2.09a1.67 1.67 0 0 0-1.56 1.11 2.1 2.1 0 0 0-.1.75v5.45h-2.89Z"/></svg>
                </a>
                <a href="#" aria-label="GitHub" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.6.07-.59.07-.59 1 .07 1.52 1.04 1.52 1.04.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.64 0 0 .85-.27 2.78 1.02A9.7 9.7 0 0 1 12 6.84c.86 0 1.73.12 2.54.36 1.93-1.29 2.78-1.02 2.78-1.02.55 1.38.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.69.92.69 1.86v2.75c0 .26.18.57.69.48A10 10 0 0 0 12 2Z"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.92a8.24 8.24 0 0 1-2.36.65 4.1 4.1 0 0 0 1.8-2.27 8.2 8.2 0 0 1-2.6.99 4.1 4.1 0 0 0-7 3.74A11.64 11.64 0 0 1 3.16 4.9a4.08 4.08 0 0 0 1.27 5.46 4.06 4.06 0 0 1-1.86-.52v.05a4.1 4.1 0 0 0 3.3 4.02 4.1 4.1 0 0 1-1.85.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.57a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.34 8.34 0 0 0 22 5.92Z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div className="text-white font-semibold mb-3">Explore</div>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollTo('about')} className="hover:text-white/90">About</button></li>
                <li><button onClick={() => scrollTo('services')} className="hover:text-white/90">Services</button></li>
                <li><button onClick={() => navigate('/careers')} className="hover:text-white/90">Careers</button></li>
                <li><button onClick={() => scrollTo('contact')} className="hover:text-white/90">Contact</button></li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <div className="text-white font-semibold mb-3">Contact</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>Mon–Fri · 9am–6pm IST</li>
                <li><a href="mailto:hello@volksskatt.com" className="hover:text-white/90">hello@volksskatt.com</a></li>
                <li><a href="tel:+910000000000" className="hover:text-white/90">+91 00000 00000</a></li>
                <li className="text-slate-500">Silicon Valley, CA · Bengaluru, IN</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <div className="text-white font-semibold mb-3">Stay in the loop</div>
              <p className="text-sm text-slate-400 mb-3">Monthly insights on engineering, design and AI. No spam.</p>
              <form onSubmit={(e)=>e.preventDefault()} className="flex items-center gap-2">
                <input type="email" required placeholder="Your email" className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <button className="px-4 py-2 rounded-lg bg-white text-slate-900 font-semibold hover:bg-amber-300 transition">Subscribe</button>
              </form>
            </div>
          </div>

          {/* Legal bar */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>© {new Date().getFullYear()} volksskatt. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white/80">Privacy</a>
              <a href="#" className="hover:text-white/80">Terms</a>
              <a href="#" className="hover:text-white/80">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
