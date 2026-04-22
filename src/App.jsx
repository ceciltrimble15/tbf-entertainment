import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────
   SCROLL-REVEAL HOOK
───────────────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TBF LOGO IMAGE COMPONENT

   The actual logo image (hat + TBF ENTERTAINMENT) is served
   from /logo.png in the public directory.

   size:    'nav'       → height 36px  (nav bar)
            'xs'        → height 56px  (section dividers)
            'sm'        → height 80px  (publishing anchor)
            'md'        → height 110px (footer / CTA)
            'lg'        → height 160px (larger feature placements)
            'watermark' → height 45vw, max 520px (hero bg)

   glow:    'none' | 'subtle' | 'medium' | 'strong'
            Silver + blue drop-shadow system, dark bg only.

   opacity: 0–1  (use low values for watermarks / textures)
   blur:    true/false (adds CSS blur for watermark softness)
   align:   'left' | 'center'
───────────────────────────────────────────────────────── */
const LOGO_HEIGHTS = {
  nav:       '64px',   // nav bar — dominant brand marker
  xs:        '120px',  // section dividers — clear presence
  sm:        '160px',  // publishing anchor
  md:        '200px',  // footer / CTA
  lg:        '260px',  // larger feature placements
  watermark: 'clamp(320px, 60vw, 720px)', // hero bg — full dominance
};

const LOGO_GLOWS = {
  none:   '',
  subtle: 'drop-shadow(0 0 8px rgba(30,144,255,0.22)) drop-shadow(0 0 4px rgba(192,192,192,0.12))',
  medium: 'drop-shadow(0 0 18px rgba(30,144,255,0.38)) drop-shadow(0 0 8px rgba(192,192,192,0.18))',
  strong: 'drop-shadow(0 0 36px rgba(30,144,255,0.58)) drop-shadow(0 0 18px rgba(192,192,192,0.30))',
};

function Logo({
  size    = 'md',
  glow    = 'none',
  opacity = 1,
  blur    = false,
  align   = 'left',
  onClick,
  style   = {},
  className = '',
}) {
  const h  = LOGO_HEIGHTS[size] || LOGO_HEIGHTS.md;
  const gf = LOGO_GLOWS[glow] || '';
  const bf = blur ? 'blur(1.2px)' : '';
  const filterVal = [bf, gf].filter(Boolean).join(' ') || undefined;

  return (
    <div
      onClick={onClick}
      className={`flex ${align === 'center' ? 'justify-center' : 'justify-start'} ${onClick ? 'cursor-pointer select-none' : 'select-none'} ${className}`}
      style={{ opacity, ...style }}
    >
      <img
        src="/logo.png"
        alt="TBF Entertainment"
        draggable={false}
        style={{
          height: h,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: filterVal,
          pointerEvents: onClick ? 'auto' : 'none',
          transition: 'filter 0.3s, opacity 0.3s',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────── */
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Home', 'Publishing', 'Artistry', 'Media', 'Connect'];

  const go = (p) => {
    setPage(p.toLowerCase());
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.96)' : 'rgba(10,10,10,0)',
        borderBottom: scrolled ? '1px solid rgba(43,43,43,0.8)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">

        {/* Nav Logo — 36px height, no glow (recognition through repetition) */}
        <Logo
          size="nav"
          glow="none"
          align="left"
          onClick={() => go('home')}
        />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => go(l)}
              className={`nav-link ${page === l.toLowerCase() ? 'active text-white' : ''}`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button onClick={() => go('Connect')} className="btn-outline-blue text-xs px-6 py-3">
            Get in Touch
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="block w-6 h-px bg-white transition-all duration-300" style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : '' }} />
          <span className="block w-6 h-px bg-white transition-all duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-6 h-px bg-white transition-all duration-300" style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : '' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          background: 'rgba(10,10,10,0.98)',
          borderTop: menuOpen ? '1px solid #2B2B2B' : 'none',
        }}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => go(l)}
              className={`nav-link text-left text-sm ${page === l.toLowerCase() ? 'text-white' : ''}`}
            >
              {l}
            </button>
          ))}
          <button onClick={() => go('Connect')} className="btn-outline-blue text-xs mt-2">
            Get in Touch
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */
function Footer({ setPage }) {
  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#060606', borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">

          {/* Brand column — full logo signature, no heavy glow */}
          <div className="md:col-span-2">
            <Logo size="md" glow="none" align="left" style={{ marginBottom: '14px' }} />
            <p
              className="font-body uppercase tracking-[0.16em] mb-5"
              style={{ fontSize: '0.62rem', color: '#A9A9A9' }}
            >
              Built from reality. Nothing added. Everything earned.
            </p>
            <p className="font-body text-sm text-tbf-silver-dim leading-relaxed max-w-sm">
              A culture-driven entertainment company building powerful stories, visual identity, and creative expansion through publishing, artistry, and media.
            </p>
            <div className="flex gap-3 mt-6">
              {['IG', 'X', 'YT'].map((s) => (
                <div
                  key={s}
                  className="w-9 h-9 border border-tbf-dark flex items-center justify-center text-xs text-tbf-silver-dim font-body font-semibold tracking-wider cursor-pointer transition-colors duration-200 hover:border-tbf-blue hover:text-tbf-blue"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="eyebrow mb-5">Navigate</p>
            <div className="flex flex-col gap-3">
              {['Home', 'Publishing', 'Artistry', 'Media', 'Connect'].map((l) => (
                <button
                  key={l}
                  onClick={() => go(l.toLowerCase())}
                  className="font-body text-sm text-tbf-silver-dim hover:text-white transition-colors duration-200 text-left"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow mb-5">Contact</p>
            <div className="flex flex-col gap-3">
              <a href="mailto:info@tbfentertainment.art" className="font-body text-sm text-tbf-silver-dim hover:text-tbf-blue transition-colors duration-200">
                info@tbfentertainment.art
              </a>
              <p className="font-body text-sm text-tbf-silver-dim">Publishing Inquiries</p>
              <p className="font-body text-sm text-tbf-silver-dim">Partnership Inquiries</p>
              <button onClick={() => go('connect')} className="font-body text-sm text-tbf-blue hover:text-white transition-colors duration-200 text-left mt-1">
                Submit Inquiry →
              </button>
            </div>
          </div>
        </div>

        <div className="hr-dark pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-tbf-silver-dim tracking-wider">
            © {new Date().getFullYear()} TBF Entertainment. All rights reserved.
          </p>
          <p className="font-body text-xs text-tbf-silver-dim tracking-wider">
            tbfentertainment.art
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────
   BOOK COVER — uses actual cover art
───────────────────────────────────────────────────────── */
function BookCover({ size = 'lg' }) {
  // +40% dominance on the home/publishing anchor
  const w = size === 'lg' ? '310px' : '220px';
  const h = size === 'lg' ? '420px' : '300px';

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        width: w,
        height: h,
        boxShadow: '8px 16px 56px rgba(0,0,0,0.85), 0 0 40px rgba(30,144,255,0.15)',
        border: '1px solid rgba(30,144,255,0.15)',
      }}
    >
      <img
        src="/book-cover.png"
        alt="Young Gs vs Old Gs: The Takeover — TBF Entertainment"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          display: 'block',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION LOGO DIVIDER
   Small logo mark above section headlines.
   size 'xs' (56px) for mid-scroll marks.
───────────────────────────────────────────────────────── */
function SectionLogo({ align = 'center', glow = 'subtle' }) {
  return (
    <div className={`flex ${align === 'center' ? 'justify-center' : 'justify-start'} mb-6`}>
      <Logo size="xs" glow={glow} opacity={0.82} align={align} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE HERO (reusable for inner pages)
───────────────────────────────────────────────────────── */
function PageHero({ eyebrow, title, titleAccent, subtitle }) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: '#0A0A0A' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(30,144,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(30,144,255,0.07) 0%, transparent 70%)',
          top: '-100px', left: '50%', transform: 'translateX(-50%)',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="animate-fade-in-up">
          <p className="eyebrow mb-5">{eyebrow}</p>
        </div>
        <h1
          className="font-display font-black uppercase text-white leading-none animate-fade-in-up delay-100"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '0.04em' }}
        >
          {title}
          {titleAccent && <><br /><span style={{ color: '#1E90FF' }}>{titleAccent}</span></>}
        </h1>
        <div className="w-14 h-px mt-6 mb-6 animate-fade-in-up delay-200" style={{ background: '#1E90FF' }} />
        {subtitle && (
          <p className="font-body text-tbf-silver max-w-2xl leading-relaxed animate-fade-in-up delay-300" style={{ fontSize: '1rem' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }} />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   CONNECT FORM
───────────────────────────────────────────────────────── */
function ConnectForm({ compact = false }) {
  const [email, setEmail]   = useState('');
  const [name, setName]     = useState('');
  const [type, setType]     = useState('General');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = { border: '1px solid #2B2B2B', fontSize: '0.875rem', background: 'transparent' };
  const onFocus = (e) => { e.target.style.borderColor = 'rgba(30,144,255,0.5)'; };
  const onBlur  = (e) => { e.target.style.borderColor = '#2B2B2B'; };
  const baseInput = 'w-full font-body text-sm px-5 py-4 text-white placeholder-tbf-silver-dim outline-none transition-all duration-200';

  if (submitted) {
    return (
      <div className="p-8 text-center" style={{ background: 'rgba(30,144,255,0.06)', border: '1px solid rgba(30,144,255,0.25)' }}>
        <div className="font-display font-bold uppercase text-tbf-blue text-xl mb-2">Received.</div>
        <p className="font-body text-tbf-silver text-sm">We'll be in touch. Welcome to the TBF circle.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto" style={{ border: '1px solid rgba(30,144,255,0.3)' }}>
        <input
          type="email" placeholder="Enter your email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="flex-1 font-body text-sm px-6 py-5 text-white placeholder-tbf-silver-dim outline-none transition-all duration-200 bg-transparent"
          style={{ border: 'none', background: 'transparent' }}
          onFocus={(e) => { e.target.parentElement.style.borderColor = 'rgba(30,144,255,0.6)'; }}
          onBlur={(e) => { e.target.parentElement.style.borderColor = 'rgba(30,144,255,0.3)'; }}
        />
        <button type="submit" className="btn-blue whitespace-nowrap" style={{ borderRadius: 0, padding: '1.1rem 2rem', fontSize: '0.78rem' }}>Get Early Access</button>
      </form>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="eyebrow block mb-2">Name</label>
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className={baseInput} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
        <div>
          <label className="eyebrow block mb-2">Email</label>
          <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required className={baseInput} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
      </div>
      <div>
        <label className="eyebrow block mb-2">Inquiry Type</label>
        <select
          value={type} onChange={(e) => setType(e.target.value)}
          className="w-full font-body text-sm px-5 py-4 text-white outline-none transition-all duration-200 cursor-pointer"
          style={{ ...inputStyle, background: '#0A0A0A', appearance: 'none' }}
          onFocus={onFocus} onBlur={onBlur}
        >
          <option value="General">General Inquiry</option>
          <option value="Publishing">Publishing</option>
          <option value="Artistry">Artistry / Artist Collaboration</option>
          <option value="Media">Media / Content</option>
          <option value="Partnership">Business Partnership</option>
        </select>
      </div>
      <div>
        <label className="eyebrow block mb-2">Message</label>
        <textarea
          placeholder="Tell us about your inquiry..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={5}
          className={`${baseInput} resize-none`} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
        />
      </div>
      <button type="submit" className="btn-blue w-full md:w-auto">Submit Inquiry</button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────── */
function HomePage({ setPage }) {
  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          1. HERO
          Watermark logo: centered, 45vw height, 32% opacity,
          slight blur, strong blue glow behind it.
          Headline text sits on top — do NOT remove.
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden grain" style={{ background: '#0A0A0A' }}>
        {/* Cinematic grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(30,144,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.028) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Blue glow orb — shifted right to counterweight left-aligned headline */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            background: 'radial-gradient(ellipse 60% 55% at 72% 42%, rgba(30,144,255,0.11) 0%, transparent 70%)',
          }}
        />

        {/* Watermark logo — right third on desktop, top-center on mobile, drifts over 18s */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center md:justify-end md:pr-[6vw]"
          style={{ zIndex: 1, transform: 'translateY(-14%)' }}
        >
          <div className="animate-hero-drift">
            <Logo
              size="watermark"
              glow="strong"
              opacity={0.29}
              blur={true}
              align="center"
            />
          </div>
        </div>

        {/* Hero content — z-index 2, above watermark */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24" style={{ zIndex: 2 }}>
          <div className="animate-fade-in-up">
            <p className="eyebrow mb-6">Est. Now. Built to Last.</p>
          </div>
          <h1
            className="font-display font-black uppercase text-white leading-[0.95] animate-fade-in-up delay-100 max-w-5xl"
            style={{ fontSize: 'clamp(2.4rem, 5.2vw, 5rem)', letterSpacing: '0.01em' }}
          >
            Built from reality.<br />
            <span style={{ color: '#C0C0C0' }}>Nothing added.</span><br />
            <span style={{ color: '#1E90FF' }}>Everything earned.</span>
          </h1>
          <div className="w-16 h-px mt-8 mb-8 animate-fade-in-up delay-200" style={{ background: '#1E90FF' }} />
          <p className="font-body text-tbf-silver max-w-xl leading-relaxed animate-fade-in-up delay-300" style={{ fontSize: 'clamp(0.98rem, 1.6vw, 1.12rem)' }}>
            A culture-driven entertainment company shaping story, sound, and visual identity through publishing, artistry, and media.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 animate-fade-in-up delay-500">
            <button onClick={() => go('publishing')} className="btn-blue">Explore Publishing</button>
            <button onClick={() => go('home')} className="btn-ghost">View the Vision ↓</button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }} />
      </section>

      {/* ═══════════════════════════════════════════════════
          2. BRAND POSITIONING
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <p className="eyebrow mb-4">The Foundation</p>
              <h2 className="font-display font-black uppercase text-white leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                Built for More<br />Than One Lane
              </h2>
              <div className="blue-line" />
              <p className="font-body text-tbf-silver leading-relaxed" style={{ fontSize: '1rem' }}>
                TBF Entertainment is a multi-platform creative company rooted in storytelling, sound, and visual culture. We are building across publishing, artistry, and media with a focus on execution, originality, and long-term catalog value.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Publishing', active: true,  desc: 'Current launch lane. Active catalog. Proven execution.' },
                  { label: 'Artistry',  active: false, desc: 'Independent collaborations. Culture-rooted sound development.' },
                  { label: 'Media',     active: false, desc: 'Visual storytelling. Cinematic expression. Creative content.' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-5 flex flex-col gap-3"
                    style={{
                      background: item.active ? 'rgba(30,144,255,0.06)' : '#111111',
                      border: item.active ? '1px solid rgba(30,144,255,0.35)' : '1px solid #2B2B2B',
                    }}
                  >
                    {item.active && <div className="font-body font-semibold uppercase tracking-widest text-tbf-blue" style={{ fontSize: '0.55rem' }}>Active</div>}
                    <p className="font-display font-bold uppercase text-white tracking-wider text-sm">{item.label}</p>
                    <p className="font-body text-tbf-silver-dim" style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. FLAGSHIP RELEASE — Featured on homepage.
          Cover + hook + buy button + learn more.
          This is not the full pitch. That lives on /publishing.
          Rule: show it exists, show it's live, give the exit.
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: '#060606' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(30,144,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.018) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow mb-10">Now Live — Flagship Release</p>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Cover */}
            <Reveal delay={80}>
              <div className="flex justify-start">
                <div className="relative">
                  <div className="absolute -inset-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(30,144,255,0.14) 0%, transparent 70%)' }} />
                  <BookCover size="lg" />
                </div>
              </div>
            </Reveal>

            {/* Copy — tight, 3-part: title, hook, actions */}
            <Reveal delay={160}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full bg-tbf-blue animate-pulse flex-shrink-0" />
                <span className="font-body font-semibold uppercase tracking-[0.18em] text-tbf-blue" style={{ fontSize: '0.62rem' }}>Available Now — Print &amp; eBook</span>
              </div>

              <h2 className="font-display font-black uppercase text-white leading-none mb-2" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)' }}>
                Young G's<br />vs. O.G.'s
              </h2>
              <p className="font-body uppercase tracking-[0.14em] mb-6" style={{ fontSize: '0.72rem', color: '#C0C0C0' }}>
                The Takeover — Book One
              </p>

              <div className="blue-line" />

              <p className="font-body text-tbf-silver leading-relaxed mb-8" style={{ fontSize: '1rem', maxWidth: '440px' }}>
                A war in Cincinnati. A young crew with nothing to lose. Four OG legends with forty years behind them. The debut release from TBF Entertainment Publishing.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.amazon.com/s?k=Young+Gs+vs+Old+Gs+The+Takeover+OG+Tom+Tom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-blue"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Buy on Amazon <span style={{ fontSize: '0.85em' }}>↗</span>
                </a>
                <button onClick={() => go('publishing')} className="btn-outline-blue">
                  Full Details →
                </button>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. THREE PILLARS
          Section logo divider above headline.
          Faint logo pattern texture at 5–8% opacity.
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#060606' }}>
        {/* Ultra-faint logo texture — single oversized, ~6% opacity */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <Logo
            size="watermark"
            glow="none"
            opacity={0.06}
            align="center"
            style={{ transform: 'scale(2.4)', transformOrigin: 'center' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-16">
              {/* Section divider logo — 56px, subtle glow */}
              <SectionLogo align="center" glow="subtle" />
              <p className="eyebrow mb-4">The Architecture</p>
              <h2 className="font-display font-black uppercase text-white leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Three Lanes. One Direction.
              </h2>
              <div className="w-12 h-px bg-tbf-blue mx-auto mt-5" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Artistry',   icon: '♪', desc: 'Independent artist collaborations, music-driven storytelling, and culture-centered sound development.', page: 'artistry', active: false },
              { label: 'Media',      icon: '◎', desc: 'Visual storytelling, interviews, creative content, and cinematic media expression.', page: 'media',    active: false },
              { label: 'Publishing', icon: '▣', desc: 'Books, street-rooted narratives, original storytelling, and a growing written catalog.',              page: 'publishing', active: true },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 120}>
                <div
                  className="group relative p-8 lg:p-10 cursor-pointer transition-all duration-300 h-full flex flex-col"
                  style={{
                    background: item.active ? 'rgba(30,144,255,0.09)' : 'rgba(17,17,17,0.92)',
                    border: item.active ? '1px solid rgba(30,144,255,0.55)' : '1px solid #2B2B2B',
                    boxShadow: item.active ? '0 0 36px rgba(30,144,255,0.12), inset 0 1px 0 rgba(30,144,255,0.15)' : 'none',
                  }}
                  onClick={() => go(item.page)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(30,144,255,0.7)';
                    e.currentTarget.style.boxShadow = '0 8px 48px rgba(0,0,0,0.6), 0 0 32px rgba(30,144,255,0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = item.active ? '1px solid rgba(30,144,255,0.55)' : '1px solid #2B2B2B';
                    e.currentTarget.style.boxShadow = item.active ? '0 0 36px rgba(30,144,255,0.12), inset 0 1px 0 rgba(30,144,255,0.15)' : 'none';
                  }}
                >
                  {item.active && (
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #1E90FF, transparent)' }} />
                  )}
                  <div className="font-display text-tbf-blue mb-4" style={{ fontSize: '2rem', lineHeight: 1 }}>{item.icon}</div>
                  {item.active && (
                    <div className="font-body text-tbf-blue uppercase tracking-[0.2em] mb-3" style={{ fontSize: '0.55rem', fontWeight: 700 }}>
                      Current Lead Division
                    </div>
                  )}
                  <h3 className="font-display font-black uppercase text-white mb-4 tracking-wide" style={{ fontSize: '1.8rem' }}>{item.label}</h3>
                  <p className="font-body text-tbf-silver-dim leading-relaxed text-sm flex-1">{item.desc}</p>
                  <div className="mt-6">
                    <span className="font-body text-tbf-blue text-xs uppercase tracking-[0.15em] font-semibold">Explore →</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. PUBLISHING ANCHOR
          Logo above "Featured Release" — 80px, subtle glow.
          Credibility link: brand → product → proof.
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#0A0A0A' }}>
        <div className="absolute right-0 top-0 bottom-0 w-px pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(30,144,255,0.4), transparent)' }} />
        <div className="absolute pointer-events-none" style={{ width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(30,144,255,0.06) 0%, transparent 65%)', right: '-200px', top: '50%', transform: 'translateY(-50%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            {/* Publishing anchor logo — sm (80px), centered, subtle glow */}
            <SectionLogo align="center" glow="subtle" />
            <p className="eyebrow mb-4 text-center">The Main Event</p>
            <h2 className="font-display font-black uppercase text-white leading-none mb-3 text-center" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.8rem)' }}>
              Publishing Leads<br />the First Chapter.
            </h2>
            <div className="w-14 h-px mx-auto mb-6" style={{ background: '#1E90FF' }} />
            <p className="font-body text-tbf-silver max-w-xl mx-auto leading-relaxed mb-12 text-center" style={{ fontSize: '1rem' }}>
              TBF Entertainment's current public launch begins through publishing — where the work is active, the catalog is real, and the first release is already in motion.
            </p>
          </Reveal>

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center p-10 lg:p-16"
            style={{ background: '#0D0D0D', border: '1px solid rgba(30,144,255,0.28)', boxShadow: '0 0 120px rgba(30,144,255,0.10)' }}
          >
            <Reveal delay={100}>
              <div className="flex flex-col items-center lg:items-start gap-10">
                <div className="relative">
                  <div className="absolute -inset-12 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(30,144,255,0.28) 0%, transparent 70%)' }} />
                  <div className="relative" style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 60px rgba(30,144,255,0.25)' }}>
                    <BookCover size="lg" />
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3" style={{ background: 'rgba(30,144,255,0.08)', border: '1px solid rgba(30,144,255,0.25)' }}>
                  <div className="w-2 h-2 rounded-full bg-tbf-blue animate-pulse" />
                  <span className="font-body font-semibold uppercase tracking-[0.15em] text-tbf-blue" style={{ fontSize: '0.65rem' }}>Now Available</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="inline-block px-3 py-1.5 mb-4" style={{ background: 'rgba(30,144,255,0.12)', border: '1px solid rgba(30,144,255,0.4)' }}>
                <span className="font-body font-bold uppercase tracking-[0.2em] text-tbf-blue" style={{ fontSize: '0.6rem' }}>Debut Release</span>
              </div>
              <h3 className="font-display font-black uppercase text-white leading-none mb-2" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
                Young Gs<br />vs. Old Gs
              </h3>
              <p className="font-body uppercase tracking-[0.18em] mb-4" style={{ fontSize: '0.7rem', color: '#D4A017' }}>The Takeover — Book One</p>
              <div className="w-10 h-px mb-5" style={{ background: '#1E90FF' }} />
              <p className="font-body text-tbf-silver leading-relaxed mb-3" style={{ fontSize: '0.95rem' }}>
                The debut release under TBF Entertainment Publishing. A story rooted in real culture, generational tension, and authentic street narratives — told with discipline and intent.
              </p>
              <p className="font-body text-tbf-silver-dim leading-relaxed mb-8" style={{ fontSize: '0.9rem' }}>
                This is the proof of concept. The first chapter of a growing catalog built on originality, voice, and long-term creative value.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {[
                  { label: 'Publisher', value: 'TBF Entertainment Publishing' },
                  { label: 'Status',    value: 'Active Release' },
                  { label: 'Category', value: 'Fiction / Culture / Narrative' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="font-body text-tbf-silver-dim uppercase tracking-[0.12em]" style={{ fontSize: '0.7rem', minWidth: '80px' }}>{item.label}</span>
                    <div className="w-4 h-px flex-shrink-0" style={{ background: '#2B2B2B' }} />
                    <span className="font-body text-tbf-silver text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => go('publishing')} className="btn-blue">View Publishing</button>
                <button onClick={() => go('connect')} className="btn-outline-blue">Get First Access</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. VISION / EXPANSION
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32" style={{ background: '#060606' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative p-10 lg:p-14" style={{ background: '#0D0D0D', border: '1px solid #1A1A1A' }}>
                <div className="absolute top-0 left-0 w-10 h-10 pointer-events-none" style={{ borderTop: '2px solid #1E90FF', borderLeft: '2px solid #1E90FF' }} />
                <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none" style={{ borderBottom: '2px solid #1E90FF', borderRight: '2px solid #1E90FF' }} />
                <div className="font-display font-black uppercase leading-none mb-6" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'rgba(255,255,255,0.06)' }}>TBF</div>
                <div className="flex flex-col gap-5">
                  {['Story', 'Sound', 'Screen'].map((item, i) => (
                    <div key={item} className="flex items-center gap-4">
                      <div className="font-display font-black uppercase text-tbf-blue" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', minWidth: '60px' }}>0{i + 1}</div>
                      <div className="flex-1 h-px" style={{ background: '#1A1A1A' }} />
                      <div className="font-display font-black uppercase text-white tracking-widest" style={{ fontSize: '1.3rem' }}>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <p className="eyebrow mb-4">Long-Term Vision</p>
              <h2 className="font-display font-black uppercase text-white leading-none mb-4" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                Built to Scale Across Story, Sound, and Screen
              </h2>
              <div className="blue-line" />
              <p className="font-body text-tbf-silver leading-relaxed mb-5" style={{ fontSize: '0.95rem' }}>
                Publishing is the first public lane, but TBF Entertainment is being structured as a long-term creative company with room for artist collaborations, visual media, future releases, and a broader cultural footprint.
              </p>
              <p className="font-body text-tbf-silver-dim leading-relaxed" style={{ fontSize: '0.9rem' }}>
                This is not a single-project company. The architecture is built for expansion — across catalog depth, creative formats, and cultural reach.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. ARTISTRY & MEDIA PREVIEW
      ═══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-20">
              <p className="eyebrow mb-5">In Development</p>
              <h2 className="font-display font-black uppercase text-white leading-[0.95]" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', letterSpacing: '0.01em' }}>
                The Next Lanes
              </h2>
              <div className="w-14 h-px bg-tbf-blue mx-auto mt-6" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: 'Artistry', icon: '♪', status: 'Developing',
                desc: 'TBF Entertainment is building its artistry division around independent artist collaborations and culture-centered creative development. Featured artist releases and partnerships are in the pipeline.',
                detail: 'Featured artist collaborations coming soon.',
                page: 'artistry',
              },
              {
                label: 'Media', icon: '◎', status: 'In Development',
                desc: 'The media division covers original visual content, interviews, cinematic storytelling, and culture-based creative expression. Built to complement and expand the publishing and artistry lanes.',
                detail: 'Visual storytelling and media content in development.',
                page: 'media',
              },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 150}>
                <div
                  className="group p-8 lg:p-10 cursor-pointer transition-all duration-300 h-full flex flex-col"
                  style={{ background: '#111111', border: '1px solid #2B2B2B' }}
                  onClick={() => go(item.page)}
                  onMouseEnter={(e) => { e.currentTarget.style.border = '1px solid rgba(30,144,255,0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid #2B2B2B'; }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="font-display text-tbf-blue" style={{ fontSize: '2rem', lineHeight: 1 }}>{item.icon}</div>
                    <div className="font-body text-tbf-silver-dim uppercase tracking-[0.15em] px-3 py-1" style={{ fontSize: '0.55rem', fontWeight: 600, border: '1px solid #2B2B2B' }}>
                      {item.status}
                    </div>
                  </div>
                  <h3 className="font-display font-black uppercase text-white mb-4 tracking-wide" style={{ fontSize: '1.6rem' }}>{item.label}</h3>
                  <p className="font-body text-tbf-silver leading-relaxed text-sm mb-4">{item.desc}</p>
                  <div className="font-body text-tbf-silver-dim text-sm italic mb-6 flex-1" style={{ borderLeft: '2px solid #2B2B2B', paddingLeft: '12px' }}>
                    {item.detail}
                  </div>
                  <span className="font-body text-tbf-blue text-xs uppercase tracking-[0.15em] font-semibold">Learn More →</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. FINAL CTA — Memory lock / Exit stamp
          Logo: md (110px), centered, medium glow.
          "The first chapter is live."
          CTAs: Enter Publishing | Connect
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#060606' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(30,144,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.025) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        {/* Blue glow orb */}
        <div className="absolute pointer-events-none" style={{ width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(30,144,255,0.11) 0%, transparent 70%)', top: '30%', left: '50%', transform: 'translateX(-50%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            {/* Exit stamp logo — md (160px), centered, medium glow */}
            <div className="flex justify-center mb-10">
              <Logo size="md" glow="medium" opacity={0.94} align="center" />
            </div>

            <div className="w-14 h-px bg-tbf-blue mx-auto mb-10" />

            <h2 className="font-display font-black uppercase text-white leading-[0.95] mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', letterSpacing: '0.01em' }}>
              This Is Where It Started.<br /><span style={{ color: '#C0C0C0' }}>The Rest Is Being Built.</span>
            </h2>
            <p className="font-body text-tbf-silver leading-relaxed mb-12" style={{ fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 48px' }}>
              Publishing is active. Artistry and media are in motion. Step in early and follow the build.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button onClick={() => go('publishing')} className="btn-blue">Enter Publishing</button>
              <button onClick={() => go('connect')}    className="btn-outline-blue">Connect</button>
            </div>

            <div className="max-w-lg mx-auto">
              <p className="eyebrow mb-4">Get Early Access</p>
              <ConnectForm compact />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   PUBLISHING PAGE
───────────────────────────────────────────────────────── */
function PublishingPage({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <PageHero
        eyebrow="TBF Entertainment — Publishing Division"
        title="The Written"
        titleAccent="Catalog"
        subtitle="Street-rooted narratives, original storytelling, and a growing written catalog built for cultural longevity. TBF Publishing is where the work is real and the first release is already in motion."
      />

      <section className="py-20" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '▣', title: 'Original Stories',    desc: 'Every title in the TBF catalog is built on authentic voice, cultural truth, and storytelling with purpose.' },
              { icon: '◈', title: 'Long-Term Catalog',   desc: 'We are building a library — not chasing a moment. Each release adds depth and range to the TBF Publishing catalog.' },
              { icon: '◉', title: 'Culture-First Voice', desc: 'TBF Publishing is rooted in street culture, generational stories, and voices that the mainstream often sidelines.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="p-7 h-full" style={{ background: '#111111', border: '1px solid #2B2B2B' }}>
                  <div className="text-tbf-blue text-2xl mb-4 font-display">{item.icon}</div>
                  <h3 className="font-display font-bold uppercase text-white tracking-wide text-lg mb-3">{item.title}</h3>
                  <p className="font-body text-tbf-silver-dim text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured title — full display */}
      <section className="py-24 lg:py-36" style={{ background: '#060606' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow mb-4">Debut Title — Now Available</p>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-6">
            <Reveal delay={100}>
              <div className="flex flex-col items-start gap-8">
                <div className="relative">
                  <div className="absolute -inset-8 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(30,144,255,0.18) 0%, transparent 70%)' }} />
                  <BookCover size="lg" />
                </div>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'rgba(30,144,255,0.08)', border: '1px solid rgba(30,144,255,0.25)' }}>
                    <div className="w-2 h-2 rounded-full bg-tbf-blue animate-pulse" />
                    <span className="font-body font-semibold uppercase tracking-[0.15em] text-tbf-blue" style={{ fontSize: '0.65rem' }}>Now Available</span>
                  </div>
                  <button className="btn-blue w-full">Get the Book</button>
                  <button className="btn-outline-blue w-full" onClick={() => go('connect')}>Get First Access</button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <h2 className="font-display font-black uppercase text-white leading-none mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                Young Gs<br />vs. Old Gs
              </h2>
              <p className="font-body uppercase tracking-[0.18em] mb-4" style={{ fontSize: '0.72rem', color: '#D4A017' }}>The Takeover — Book One</p>
              <div className="blue-line" />
              <p className="font-body text-tbf-silver leading-relaxed mb-5" style={{ fontSize: '1rem' }}>
                The debut release from TBF Entertainment Publishing. A story rooted in generational tension, street culture, and authentic voice — told without compromise and built to last in the catalog.
              </p>
              <p className="font-body text-tbf-silver-dim leading-relaxed mb-8" style={{ fontSize: '0.9rem' }}>
                Young Gs vs. Old Gs: The Takeover sits at the intersection of loyalty, legacy, and the cultural divide between generations raised in the same world but by different rules. This isn't nostalgia — it's a reckoning.
              </p>
              <div className="p-6 mb-8" style={{ background: '#0D0D0D', border: '1px solid #1A1A1A', borderLeft: '3px solid #1E90FF' }}>
                <p className="font-body text-tbf-silver italic leading-relaxed" style={{ fontSize: '0.95rem' }}>
                  "The first proof of what TBF Publishing is building — a catalog with voice, with grit, and with a clear point of view."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Publisher', value: 'TBF Entertainment' },
                  { label: 'Division',  value: 'Publishing' },
                  { label: 'Category', value: 'Culture / Fiction' },
                  { label: 'Status',   value: 'Active Release' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="eyebrow" style={{ fontSize: '0.6rem' }}>{item.label}</span>
                    <span className="font-body text-white text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          KDP LAUNCH CAMPAIGN — Young Gs vs. Old Gs: The Takeover
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#0A0A0A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(30,144,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.022) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

          <Reveal>
            <div className="mb-16">
              <p className="eyebrow mb-4">Active 30-Day Launch</p>
              <h2 className="font-display font-black uppercase text-white leading-none" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>
                The Campaign<br /><span style={{ color: '#1E90FF' }}>Is Live.</span>
              </h2>
              <div className="blue-line" />
              <p className="font-body text-tbf-silver leading-relaxed max-w-2xl" style={{ fontSize: '1rem' }}>
                Young G's vs. Old Gs: The Takeover is in active launch across Amazon KDP, eBook, and independent bookstores. Cincinnati doesn't forget.
              </p>
            </div>
          </Reveal>

          {/* Buy now block */}
          <Reveal delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 items-center p-8 lg:p-12" style={{ background: 'rgba(30,144,255,0.06)', border: '1px solid rgba(30,144,255,0.3)' }}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-tbf-blue animate-pulse" />
                  <span className="font-body font-semibold uppercase tracking-[0.18em] text-tbf-blue" style={{ fontSize: '0.65rem' }}>Available Now — Print &amp; eBook</span>
                </div>
                <h3 className="font-display font-black uppercase text-white leading-none mb-2" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
                  Young Gs vs. Old Gs
                </h3>
                <p className="font-body uppercase tracking-[0.16em] mb-4" style={{ fontSize: '0.68rem', color: '#D4A017' }}>The Takeover — Book One</p>
                <p className="font-body text-tbf-silver leading-relaxed mb-3" style={{ fontSize: '0.95rem' }}>
                  Book One of the series. Nine chapters. A war in Cincinnati. A young crew with nothing to lose against four OG legends with forty years of patience behind them.
                </p>
                <div className="p-5 mb-6" style={{ background: '#0D0D0D', border: '1px solid #1A1A1A', borderLeft: '3px solid #1E90FF' }}>
                  <p className="font-body text-tbf-silver italic" style={{ fontSize: '0.9rem' }}>
                    "My name is Tay. Not Timmy."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Author',    value: 'O.G. Tom Tom' },
                    { label: 'Publisher', value: 'TBF Entertainment' },
                    { label: 'Format',    value: 'Print + eBook + Kindle' },
                    { label: 'Genre',     value: 'Urban Fiction / Street Lit' },
                    { label: 'Setting',   value: 'Cincinnati, Ohio' },
                    { label: 'Series',    value: 'Book One of Series' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <span className="eyebrow" style={{ fontSize: '0.58rem' }}>{item.label}</span>
                      <span className="font-body text-white text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.amazon.com/s?k=Young+Gs+vs+Old+Gs+The+Takeover+OG+Tom+Tom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-blue text-center"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <span>Buy on Amazon KDP</span>
                    <span style={{ fontSize: '0.85em' }}>↗</span>
                  </a>
                  <button onClick={() => go('connect')} className="btn-outline-blue">Request ARC Copy</button>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="font-body text-tbf-silver-dim text-sm italic leading-loose" style={{ borderLeft: '2px solid rgba(30,144,255,0.3)', paddingLeft: '20px' }}>
                  <p className="mb-4">"When Tay pulls the trigger on the Big Fella — in broad daylight, in front of everybody, over a name — he starts a war that the whole city will feel."</p>
                  <p>"What nobody counted on was the funeral. The gold AK-47 pendants. The twenty-five million in clear duffel bags set in front of the casket."</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Paperback', price: '$14.99 – $16.99', platform: 'Amazon KDP + IngramSpark' },
                    { label: 'eBook',     price: '$4.99 – $6.99',   platform: 'Kindle + Draft2Digital' },
                    { label: 'Indie',     price: 'Consignment',      platform: 'Cincinnati Black Bookstores' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between px-5 py-4" style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
                      <div>
                        <div className="font-display font-bold uppercase text-white tracking-wide text-xs">{item.label}</div>
                        <div className="font-body text-tbf-silver-dim" style={{ fontSize: '0.72rem' }}>{item.platform}</div>
                      </div>
                      <div className="font-body text-tbf-blue font-semibold text-sm">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Campaign phases */}
          <Reveal delay={150}>
            <div className="mb-6">
              <p className="eyebrow mb-3">Launch Architecture</p>
              <h3 className="font-display font-black uppercase text-white" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                30-Day Campaign — Four Phases
              </h3>
              <div className="blue-line" />
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {[
              { phase: '01', label: 'Build', days: 'Days 1–7',  color: '#1E90FF', desc: 'Platform setup. KDP live. Cover finalized. ARC readers recruited. Social accounts armed. Infrastructure locked before anything goes public.' },
              { phase: '02', label: 'Ignite', days: 'Days 8–14', color: '#1E90FF', desc: 'Cover drops on all platforms. Pre-orders open. Excerpt campaign begins. Influencer activation. Goodreads giveaway live.' },
              { phase: '03', label: 'Strike', days: 'Days 15–21', color: '#1E90FF', desc: 'Launch day. Every platform fires at once. ARC reviews post. Author goes live. Local Cincinnati placements. Total saturation.' },
              { phase: '04', label: 'Hold',  days: 'Days 22–30', color: '#C0C0C0', desc: 'Reader spotlight content. Book 2 tease drops. Analytics reviewed. Month 2 strategy built from data. Momentum sustained.' },
            ].map((item, i) => (
              <Reveal key={item.phase} delay={i * 100}>
                <div className="p-7 h-full flex flex-col" style={{ background: '#111111', border: `1px solid ${i < 3 ? 'rgba(30,144,255,0.25)' : '#2B2B2B'}` }}>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display font-black uppercase text-tbf-blue" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>Phase {item.phase}</span>
                    <span className="font-body text-tbf-silver-dim uppercase tracking-wider px-2 py-1" style={{ fontSize: '0.55rem', border: '1px solid #2B2B2B' }}>{item.days}</span>
                  </div>
                  <h4 className="font-display font-black uppercase text-white tracking-wide mb-3" style={{ fontSize: '1.4rem', color: item.color }}>{item.label}</h4>
                  <p className="font-body text-tbf-silver-dim leading-relaxed flex-1" style={{ fontSize: '0.78rem' }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Platform targets */}
          <Reveal delay={100}>
            <div className="mb-6">
              <p className="eyebrow mb-3">Day 30 Targets</p>
              <h3 className="font-display font-black uppercase text-white" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
                The Numbers We're Chasing
              </h3>
              <div className="blue-line" />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
            {[
              { metric: '300+',  label: 'Units Sold' },
              { metric: '50+',   label: 'Amazon Reviews' },
              { metric: '1K+',   label: 'New Followers' },
              { metric: '300+',  label: 'Email Subscribers' },
              { metric: '5+',    label: 'Retail Locations' },
              { metric: '30+',   label: 'Goodreads Ratings' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 60}>
                <div className="p-6 flex flex-col items-center text-center" style={{ background: '#111111', border: '1px solid rgba(30,144,255,0.15)' }}>
                  <div className="font-display font-black text-tbf-blue mb-2" style={{ fontSize: '2rem' }}>{item.metric}</div>
                  <div className="font-body text-tbf-silver-dim uppercase tracking-[0.15em]" style={{ fontSize: '0.6rem' }}>{item.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Channel breakdown */}
          <Reveal delay={120}>
            <div className="mb-6">
              <p className="eyebrow mb-3">Distribution Channels</p>
              <h3 className="font-display font-black uppercase text-white" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
                Multi-Platform. All At Once.
              </h3>
              <div className="blue-line" />
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {[
              { platform: 'Amazon KDP', focus: 'Print (Paperback)', detail: 'Primary retail channel. Optimized listing with keywords: urban fiction, street lit, Cincinnati, gang fiction, Black fiction.', status: 'Live' },
              { platform: 'Kindle',     focus: 'eBook',             detail: 'MOBI/ePub format. Kindle Unlimited enrollment decision by Day 5. Suggested price: $4.99–$6.99.', status: 'Live' },
              { platform: 'IngramSpark', focus: 'Expanded Print',    detail: 'Barnes & Noble + independent bookstore access. Wholesale enabled for consignment outreach.', status: 'Active' },
              { platform: 'Draft2Digital', focus: 'eBook Distribution', detail: 'Expanded eBook reach beyond Amazon. Supplementary channel for non-Kindle readers.', status: 'Active' },
              { platform: 'TikTok / BookTok', focus: 'Viral Discovery', detail: 'Primary social channel. Dramatic readings, character intros, comparable title content. Daily during launch week.', status: 'Running' },
              { platform: 'Black Bookstores', focus: 'Cincinnati + Region', detail: 'Avondale, Bond Hill, Madisonville consignment. Physical copy delivery Week 2. Pop-up signing events.', status: 'Outreach' },
            ].map((item, i) => (
              <Reveal key={item.platform} delay={i * 80}>
                <div className="flex items-start gap-5 p-6" style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
                  <div className="flex-shrink-0">
                    <div className="font-body font-semibold uppercase tracking-[0.15em] text-tbf-blue px-2 py-1" style={{ fontSize: '0.55rem', border: '1px solid rgba(30,144,255,0.3)', background: 'rgba(30,144,255,0.07)', whiteSpace: 'nowrap' }}>
                      {item.status}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display font-bold uppercase text-white tracking-wide text-sm mb-1">{item.platform}</h4>
                    <div className="font-body text-tbf-blue text-xs mb-2 uppercase tracking-wider">{item.focus}</div>
                    <p className="font-body text-tbf-silver-dim leading-relaxed" style={{ fontSize: '0.78rem' }}>{item.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Book 2 tease */}
          <Reveal delay={100}>
            <div className="p-8 lg:p-10 text-center" style={{ background: 'rgba(30,144,255,0.04)', border: '1px solid rgba(30,144,255,0.2)' }}>
              <p className="eyebrow mb-4">Book 2 — Coming</p>
              <p className="font-body text-tbf-silver italic leading-relaxed mb-0" style={{ fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                "OG Sean Smith got on a plane to Jamaica. He was happy. He was already on his next play."
              </p>
            </div>
          </Reveal>

        </div>
      </section>

      {/* Vault */}
      <section className="py-24" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-14">
              <p className="eyebrow mb-4">The Catalog Grows</p>
              <h2 className="font-display font-black uppercase text-white leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                More Stories<br />In the Vault
              </h2>
              <div className="w-12 h-px bg-tbf-blue mx-auto mt-5" />
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="p-8 flex flex-col items-center gap-5" style={{ background: '#111111', border: '1px solid #1A1A1A', minHeight: '240px' }}>
                  <div className="w-16 h-20 flex items-center justify-center" style={{ border: '1px solid #2B2B2B', background: '#0D0D0D' }}>
                    <span className="text-2xl font-display font-black" style={{ color: '#2B2B2B' }}>?</span>
                  </div>
                  <div className="text-center">
                    <div className="font-display font-bold uppercase tracking-widest text-sm mb-2" style={{ color: '#2B2B2B' }}>Untitled</div>
                    <div className="font-body text-tbf-silver-dim uppercase tracking-[0.2em]" style={{ fontSize: '0.6rem' }}>Coming Soon</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="p-8 text-center" style={{ background: 'rgba(30,144,255,0.04)', border: '1px solid rgba(30,144,255,0.15)' }}>
              <p className="font-body text-tbf-silver-dim text-sm mb-4">
                Additional titles are in development. The TBF Publishing catalog is being built with intention — one release at a time.
              </p>
              <button onClick={() => go('connect')} className="btn-outline-blue text-xs">Submit a Publishing Inquiry</button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   ARTISTRY PAGE
───────────────────────────────────────────────────────── */
function ArtistryPage({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <PageHero
        eyebrow="TBF Entertainment — Artistry Division"
        title="Sound."
        titleAccent="Culture. Identity."
        subtitle="Featured independent artist collaborations and future releases under the TBF Entertainment banner. The artistry division is being developed with the same discipline and vision that guides publishing."
      />

      <section className="py-20" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <p className="eyebrow mb-4">The Artistry Lane</p>
              <h2 className="font-display font-black uppercase text-white leading-none mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Built Around<br />Independent Artists
              </h2>
              <div className="blue-line" />
              <p className="font-body text-tbf-silver leading-relaxed mb-5" style={{ fontSize: '0.95rem' }}>
                TBF Entertainment's artistry division is structured for independent artist collaborations — not major label mimicry. We are building around creative originality, cultural authenticity, and strategic long-term catalog development.
              </p>
              <p className="font-body text-tbf-silver-dim leading-relaxed" style={{ fontSize: '0.9rem' }}>
                This is a lane for artists who operate with discipline, have a clear point of view, and are building something with lasting value.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Artist Collaborations',  desc: 'Independent artist partnerships focused on creative development and release strategy.' },
                  { title: 'Culture-Centered Sound', desc: 'Music and audio content rooted in authentic cultural voice, not trend-chasing.' },
                  { title: 'Catalog Development',    desc: 'Building long-term catalog value through original releases and creative projects.' },
                  { title: 'Creative Expansion',     desc: 'Where music and storytelling intersect with the broader TBF entertainment universe.' },
                ].map((item, i) => (
                  <div key={item.title} className="flex items-start gap-4 p-5" style={{ border: '1px solid #1A1A1A' }}>
                    <div className="font-display font-black text-tbf-blue flex-shrink-0" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', paddingTop: '2px' }}>0{i + 1}</div>
                    <div>
                      <h4 className="font-display font-bold uppercase text-white tracking-wide text-sm mb-1">{item.title}</h4>
                      <p className="font-body text-tbf-silver-dim text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: '#060606' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-14">
              <p className="eyebrow mb-4">Coming Soon</p>
              <h2 className="font-display font-black uppercase text-white leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Featured<br />Collaborations
              </h2>
              <div className="w-12 h-px bg-tbf-blue mx-auto mt-5 mb-5" />
              <p className="font-body text-tbf-silver-dim text-sm max-w-md mx-auto">
                Featured artist collaborations are in development. This space will showcase TBF's artistry lane as it becomes public.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="aspect-square flex flex-col items-center justify-center gap-3" style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#1A1A1A', border: '1px solid #2B2B2B' }}>
                    <span className="font-display font-black text-xl" style={{ color: '#2B2B2B' }}>?</span>
                  </div>
                  <span className="font-body uppercase tracking-widest" style={{ fontSize: '0.6rem', color: '#2B2B2B' }}>Coming Soon</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: '#0A0A0A' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            <p className="eyebrow mb-4">Artist Inquiries</p>
            <h2 className="font-display font-black uppercase text-white leading-none mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              If Your Work is Built<br />to Last, Connect.
            </h2>
            <div className="w-12 h-px bg-tbf-blue mx-auto mb-6" />
            <p className="font-body text-tbf-silver-dim text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              TBF Entertainment is selectively building its artistry collaborations. If you are an independent artist with a clear vision and real work, submit an inquiry.
            </p>
            <button onClick={() => go('connect')} className="btn-blue">Submit Artist Inquiry</button>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   MEDIA PAGE
───────────────────────────────────────────────────────── */
function MediaPage({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <PageHero
        eyebrow="TBF Entertainment — Media Division"
        title="Visual."
        titleAccent="Story. Screen."
        subtitle="Original visual content, interviews, cinematic storytelling, and culture-based creative expression. The TBF Media division is an active creative lane — built to complement and amplify everything the brand produces."
      />

      <section className="py-20" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '◎', title: 'Visual Storytelling',        desc: 'Cinematic content that carries the TBF narrative beyond the page — documentary-style, editorial, and original formats.' },
              { icon: '◈', title: 'Interviews & Conversations', desc: 'Real conversations with real voices. TBF Media will feature artists, creators, and culture-builders in long-form format.' },
              { icon: '▦', title: 'Creative Media Expression',  desc: 'Short-form and long-form content rooted in culture, creativity, and the stories TBF is actively building across all lanes.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="p-8 h-full flex flex-col" style={{ background: '#111111', border: '1px solid #2B2B2B' }}>
                  <div className="text-tbf-blue text-2xl mb-5 font-display">{item.icon}</div>
                  <h3 className="font-display font-bold uppercase text-white tracking-wide text-lg mb-3">{item.title}</h3>
                  <p className="font-body text-tbf-silver-dim text-sm leading-relaxed flex-1">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: '#060606' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-14">
              <p className="eyebrow mb-4">In Development</p>
              <h2 className="font-display font-black uppercase text-white leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Content<br />Coming Soon
              </h2>
              <div className="w-12 h-px bg-tbf-blue mx-auto mt-5 mb-5" />
              <p className="font-body text-tbf-silver-dim text-sm max-w-md mx-auto">
                Visual storytelling and media content are in active development. This space will showcase TBF's media work as it is released.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: 'Short Film',       ratio: '56.25%' },
              { label: 'Interview Series', ratio: '56.25%' },
              { label: 'Editorial',        ratio: '75%' },
              { label: 'Visual Essay',     ratio: '75%' },
              { label: 'Behind the Build', ratio: '100%' },
              { label: 'Culture Drop',     ratio: '100%' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 70}>
                <div className="relative w-full overflow-hidden" style={{ paddingTop: item.ratio, background: '#0D0D0D', border: '1px solid #1A1A1A' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center" style={{ border: '1px solid #2B2B2B' }}>
                      <span className="font-display font-black" style={{ color: '#2B2B2B' }}>▷</span>
                    </div>
                    <span className="font-body uppercase tracking-[0.18em]" style={{ fontSize: '0.6rem', color: '#2B2B2B' }}>{item.label}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: '#0A0A0A' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            <p className="eyebrow mb-4">Media & Content</p>
            <h2 className="font-display font-black uppercase text-white leading-none mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Visual Collaboration<br />& Creative Inquiry
            </h2>
            <div className="w-12 h-px bg-tbf-blue mx-auto mb-6" />
            <p className="font-body text-tbf-silver-dim text-sm leading-relaxed mb-8 max-w-md mx-auto">
              If you are a filmmaker, editor, photographer, or visual content creator interested in working with TBF Entertainment, submit a media inquiry.
            </p>
            <button onClick={() => go('connect')} className="btn-blue">Submit Media Inquiry</button>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   CONNECT PAGE
───────────────────────────────────────────────────────── */
function ConnectPage() {
  return (
    <>
      <PageHero
        eyebrow="TBF Entertainment — Connect"
        title="Let's"
        titleAccent="Talk."
        subtitle="Business inquiries, artist collaborations, publishing submissions, media partnerships, and general contact. We read everything."
      />

      <section className="py-20 lg:py-28" style={{ background: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="font-display font-black uppercase text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                  Submit an Inquiry
                </h2>
                <div className="blue-line" />
              </Reveal>
              <Reveal delay={100}><ConnectForm /></Reveal>
            </div>

            <div className="flex flex-col gap-5">
              <Reveal delay={150}>
                <div className="p-7" style={{ background: '#111111', border: '1px solid #2B2B2B' }}>
                  <p className="eyebrow mb-4">Direct Contact</p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="font-body text-tbf-silver-dim text-xs uppercase tracking-[0.12em] mb-1">Email</div>
                      <a href="mailto:info@tbfentertainment.art" className="font-body text-white text-sm hover:text-tbf-blue transition-colors duration-200">
                        info@tbfentertainment.art
                      </a>
                    </div>
                    <div className="h-px" style={{ background: '#1A1A1A' }} />
                    <div>
                      <div className="font-body text-tbf-silver-dim text-xs uppercase tracking-[0.12em] mb-1">Domain</div>
                      <span className="font-body text-white text-sm">tbfentertainment.art</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {[
                { title: 'Publishing', desc: 'Manuscript submissions, distribution inquiries, author collaborations, and catalog questions.' },
                { title: 'Artistry',   desc: 'Artist collaboration inquiries, creative project submissions, and independent release discussions.' },
                { title: 'Media',      desc: 'Visual content, film, photography, editorial, and creative media partnership inquiries.' },
                { title: 'Business',   desc: 'Partnerships, licensing, distribution, and brand collaboration inquiries.' },
              ].map((item, i) => (
                <Reveal key={item.title} delay={200 + i * 80}>
                  <div className="p-6" style={{ background: '#111111', border: '1px solid #1A1A1A' }}>
                    <h4 className="font-display font-bold uppercase text-tbf-blue tracking-wide text-sm mb-2">{item.title}</h4>
                    <p className="font-body text-tbf-silver-dim text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'publishing': return <PublishingPage setPage={setPage} />;
      case 'artistry':   return <ArtistryPage   setPage={setPage} />;
      case 'media':      return <MediaPage       setPage={setPage} />;
      case 'connect':    return <ConnectPage />;
      default:           return <HomePage        setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen font-body" style={{ background: '#0A0A0A' }}>
      <Nav page={page} setPage={setPage} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
