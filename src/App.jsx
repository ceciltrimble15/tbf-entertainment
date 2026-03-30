import React, { useState, useEffect } from 'react';

const CALENDLY_URL = 'https://calendly.com/YOUR-LINK';

/* ─────────────────────────────────────────────────────────────
   SVG ICON LIBRARY  (inline, zero-dependency)
───────────────────────────────────────────────────────────── */
const Icon = {
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  PhoneMissed: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="23" y1="1" x2="17" y2="7"/>
      <line x1="17" y1="1" x2="23" y2="7"/>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  MessageSquare: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  DollarSign: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  ArrowRight: ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Flame: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Wrench: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Droplets: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
      <path d="M12.56 6.6A10.97 10.97 0 0014 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 01-11.91 4.97"/>
    </svg>
  ),
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Roof: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 12L12 3l9 9"/>
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/>
    </svg>
  ),
  Truck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Key: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  Tool: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────
   HELPER: open Calendly in a new tab
───────────────────────────────────────────────────────────── */
const openCalendly = () => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');

/* ─────────────────────────────────────────────────────────────
   1 ─ HEADER
───────────────────────────────────────────────────────────── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Emergency', href: '#emergency' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Who We Help', href: '#who' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-[0_2px_16px_rgba(26,58,143,0.10)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          <a href="#" className="flex items-center gap-3 no-underline group flex-shrink-0">
            <div
              className="flex items-center justify-center rounded-[10px] w-10 h-10"
              style={{ background: '#1A3A8F' }}
            >
              <span className="text-white font-black text-sm tracking-tight leading-none">A/1</span>
            </div>
            <span
              className={`font-extrabold text-[18px] tracking-tight leading-none transition-colors ${
                scrolled ? 'text-brand-blue' : 'text-white'
              }`}
            >
              A1 Creative
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`text-[14px] font-semibold transition-colors no-underline hover:text-brand-blue ${
                  scrolled ? 'text-brand-slate' : 'text-white/80 hover:text-white'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={openCalendly}
              className={`hidden md:inline-flex btn-primary text-[13px] px-5 py-3 ${
                scrolled ? '' : 'bg-white text-brand-blue border-white hover:bg-brand-surface hover:border-brand-surface'
              }`}
            >
              Book a Demo
            </button>
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-brand-text' : 'text-white'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <Icon.X /> : <Icon.Menu />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-brand-silver-light rounded-b-card shadow-card pb-5">
            <nav className="flex flex-col gap-1 pt-3 px-4">
              {navLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[15px] font-semibold text-brand-slate py-2 no-underline hover:text-brand-blue"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="px-4 pt-4">
              <button onClick={openCalendly} className="btn-primary w-full">Book Your Free Demo</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   2 ─ HERO
───────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F2460 0%, #1A3A8F 55%, #2A4EAF 100%)' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #2A4EAF 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28 w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Copy */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-7">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="section-label text-white/70 text-[11px]">Missed Call Revenue Recovery</span>
            </div>

            <h1 className="text-[36px] md:text-[54px] lg:text-[60px] font-extrabold text-white leading-[1.08] tracking-[-1.5px] mb-6 text-balance">
              Stop Losing Revenue From{' '}
              <span style={{ color: '#93B4FF' }}>Missed Calls</span>
            </h1>

            <p className="text-[18px] text-white/85 leading-[1.65] mb-8 max-w-[530px]">
              A1 Creative helps HVAC, plumbing, electrical, roofing, and home service companies turn missed calls into booked jobs — with instant automated text response and smart follow-up.
            </p>

            <div className="flex flex-wrap gap-4 mb-7">
              <button onClick={openCalendly} className="btn-white text-[14px]">
                Book Your Free Demo
                <Icon.ArrowRight />
              </button>
              <a href="#how-it-works" className="btn-outline-white text-[14px]">
                See How It Works
              </a>
            </div>

            <p className="text-[14px] text-white/55 leading-relaxed">
              If you're missing even a few calls a day, you're leaving real money on the table.
            </p>

            {/* Trust stats */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/15">
              {[
                { num: '< 60s', label: 'Response Time' },
                { num: '3×', label: 'More Leads Recovered' },
                { num: '24/7', label: 'Always Active' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-[26px] font-extrabold text-white leading-none">{num}</p>
                  <p className="text-[12px] font-semibold uppercase tracking-label text-white/50 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center animate-fade-in-up animation-delay-200">
            <PhoneMockupHero />
          </div>

        </div>
      </div>
    </section>
  );
}

function RevenueLeakage() {
  return (
    <section style={{ background: '#0D1B36' }} className="py-16 px-4">
      <div
        className="max-w-xl mx-auto text-center rounded-2xl"
        style={{
          background: '#111F3A',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          padding: '56px 40px',
        }}
      >
        <p className="text-base font-semibold mb-7" style={{ color: '#94A3B8', lineHeight: 1.6 }}>
          Most service businesses miss{' '}
          <span style={{ color: '#F59E0B', fontWeight: 800 }}>20–40%</span> of calls.
        </p>

        <div className="mb-7">
          <p style={{ fontSize: 16, color: '#94A3B8', margin: '0 0 8px', fontWeight: 500 }}>
            Average job: <strong style={{ color: '#E2E8F0' }}>$500</strong>
          </p>
          <p style={{ fontSize: 16, color: '#94A3B8', margin: 0, fontWeight: 500 }}>
            Miss just <strong style={{ color: '#E2E8F0' }}>10 calls per week:</strong>
          </p>
        </div>

        <div
          className="rounded-2xl mb-8"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)', padding: '28px 32px' }}
        >
          <p style={{ fontSize: 20, fontWeight: 700, color: '#FDA4AF', margin: '0 0 12px', letterSpacing: '-0.5px', opacity: 0.8 }}>$5,000/week</p>
          <p style={{ fontSize: 'clamp(48px,8vw,72px)', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-2px', lineHeight: 1, textShadow: '0 0 40px rgba(248,113,113,.6)' }}>
            $20,000<span style={{ fontSize: '0.55em', verticalAlign: 'middle', color: '#F87171' }}>/mo</span>
          </p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#EF4444', margin: '10px 0 0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>LOST EVERY MONTH.</p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 28, marginTop: 4 }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#F1F5F9', margin: '0 0 10px', lineHeight: 1.4 }}>This is happening whether you track it or not.</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1.4 }}>Every missed call is a job going to someone else.</p>
        </div>
      </div>

      {/* Pre-CTA conviction block */}
      <div style={{ maxWidth: 600, margin: '32px auto 0', textAlign: 'center', padding: '0 20px' }}>
        <h3 style={{ fontSize: 'clamp(20px,3vw,24px)', fontWeight: 800, color: '#F1F5F9', margin: '0 0 24px', lineHeight: 1.3 }}>You're already paying for this — whether you fix it or not</h3>
        <p style={{ fontSize: 16, color: '#CBD5E1', margin: '0 0 20px', lineHeight: 1.7 }}>Every missed call is lost revenue.</p>
        <p style={{ fontSize: 15, color: '#94A3B8', margin: '0 0 20px', lineHeight: 1.7 }}>If you miss just 5–10 calls a week,<br />that's <strong style={{ color: '#F1F5F9' }}>$2,000–$10,000</strong> walking out the door every month.</p>
        <p style={{ fontSize: 15, color: '#94A3B8', margin: '0 0 8px', lineHeight: 1.7 }}>This isn't about getting more leads.</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#CBD5E1', margin: 0, lineHeight: 1.7 }}>It's about capturing the ones you're already paying for.</p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: '2px solid rgba(147,180,255,.35)', color: '#93B4FF', fontSize: 14, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '13px 28px', borderRadius: 10, textDecoration: 'none' }}>
          Stop Losing Jobs Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        <p style={{ fontSize: 14, color: '#94A3B8', margin: '14px auto 0', maxWidth: 440, lineHeight: 1.6 }}>See exactly how many jobs you're missing in the next 5 minutes.</p>
        <p style={{ fontSize: 13, fontStyle: 'italic', color: '#64748B', margin: '10px auto 0', maxWidth: 400, lineHeight: 1.6 }}>Most clients recover their first missed job within the first few days.</p>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 20, marginTop: 20 }}>
          {['20-minute walkthrough', 'No obligation', 'See your missed revenue instantly'].map(text => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize: 13, color: '#64748B' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofBullets() {
  const bullets = [
    { title: 'Missed calls get a response in under 60 seconds', sub: 'Before they dial the next contractor on the list' },
    { title: 'Leads are qualified before you even pick up the phone', sub: 'You only deal with real, ready-to-book customers' },
    { title: 'Jobs get booked automatically while you\'re working', sub: 'No interruptions, no missed opportunities' },
  ];
  return (
    <section style={{ background: '#0A1628', padding: '64px 20px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 800, color: '#F1F5F9', margin: '0 0 36px', lineHeight: 1.3 }}>
          Here's what happens when missed calls are handled instantly
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left', marginBottom: 28 }}>
          {bullets.map(b => (
            <div key={b.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(74,222,128,.12)', border: '1px solid rgba(74,222,128,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0', margin: '0 0 4px' }}>{b.title}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, fontStyle: 'italic', color: '#64748B', margin: 0 }}>This isn't theory. This is happening every day for service businesses.</p>
      </div>
    </section>
  );
}

function PhoneMockupHero() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[50px] opacity-30 blur-xl"
        style={{ background: 'radial-gradient(ellipse, #2A4EAF, transparent 70%)' }} />

      <div className="relative rounded-[40px] p-3 shadow-phone"
        style={{ background: '#0A1628', width: 280 }}>

        <div className="rounded-t-[30px] h-7 flex items-center justify-center" style={{ background: '#0A1628' }}>
          <div className="w-20 h-[5px] rounded-full" style={{ background: '#1A2540' }} />
        </div>

        <div className="rounded-[24px] overflow-hidden" style={{ background: '#F0F2F7', minHeight: 440 }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#1A3A8F' }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">A1</span>
            </div>
            <div>
              <p className="text-white text-[13px] font-bold leading-none">A1 Service Team</p>
              <p className="text-white/60 text-[10px] mt-0.5">Automated Response</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-400 text-[10px] font-semibold">Active</span>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 text-red-500 text-[11px] font-semibold my-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="23" y1="1" x2="17" y2="7"/><line x1="17" y1="1" x2="23" y2="7"/>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Missed Call — Today 2:14 PM
            </div>

            <div>
              <div className="rounded-[16px_16px_16px_4px] p-3 text-[12px] leading-relaxed"
                style={{ background: '#FFFFFF', color: '#1A1A2E', maxWidth: '90%', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                Hey, sorry we missed your call. Are you needing emergency service or a standard appointment? Reply <strong>EMERGENCY</strong> or <strong>APPOINTMENT</strong> and we'll get right with you.
              </div>
              <p className="text-[10px] text-gray-400 mt-1 ml-1">A1 Service Team · 2:14 PM ✓✓</p>
            </div>

            <div className="flex flex-col items-end">
              <div className="rounded-[16px_16px_4px_16px] p-3 text-[12px] font-semibold leading-none"
                style={{ background: '#1A3A8F', color: '#FFFFFF' }}>
                APPOINTMENT
              </div>
              <p className="text-[10px] text-gray-400 mt-1 mr-1">Customer · 2:15 PM</p>
            </div>

            <div>
              <div className="rounded-[16px_16px_16px_4px] p-3 text-[12px] leading-relaxed"
                style={{ background: '#FFFFFF', color: '#1A1A2E', maxWidth: '90%', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                Perfect — click here to pick a time: <span style={{ color: '#1A3A8F', fontWeight: 600 }}>book.a1creative.com</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 ml-1">A1 Service Team · 2:15 PM ✓✓</p>
            </div>

            <div className="rounded-xl p-3 flex items-center gap-2 mt-1"
              style={{ background: '#E8F5EE', border: '1px solid #1B7A3D33' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#1B7A3D' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold" style={{ color: '#1B7A3D' }}>Booking Confirmed</p>
                <p className="text-[10px]" style={{ color: '#4A5068' }}>Lead recovered successfully</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-5 flex items-center justify-center mt-1">
          <div className="w-24 h-[4px] rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3 ─ PAIN SECTION
───────────────────────────────────────────────────────────── */
function Pain() {
  const pains = [
    {
      icon: <Icon.TrendingUp />,
      color: '#C4421A',
      bg: '#FEF2ED',
      title: 'Your competitors answer faster',
      body: 'If you don\'t respond immediately, the next company on the list does. Most leads have already moved on before your voicemail even plays.',
    },
    {
      icon: <Icon.MessageSquare />,
      color: '#1A3A8F',
      bg: '#EEF2FB',
      title: 'Most callers will not leave a voicemail',
      body: 'Today\'s customers hang up and dial someone else. They don\'t wait. They don\'t leave a message. You never know the job was yours to lose.',
    },
    {
      icon: <Icon.DollarSign />,
      color: '#C4421A',
      bg: '#FEF2ED',
      title: 'One missed job can be worth hundreds',
      body: 'A single HVAC call, plumbing emergency, or roofing quote is often $300–$1,000 or more. Miss two or three a week and the math gets ugly fast.',
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div className="text-center mb-14">
          <p className="section-label mb-3">The Problem</p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-brand-text tracking-tight leading-tight mb-5">
            Every Missed Call Costs Real Money
          </h2>
          <p className="text-[18px] text-brand-slate max-w-2xl mx-auto leading-relaxed">
            If a lead calls and nobody answers, they usually call the next company. No voicemail. No second chance. No recovered revenue.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map(({ icon, color, bg, title, body }) => (
            <div key={title} className="card-hover">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                style={{ background: bg, color }}>
                {icon}
              </div>
              <h3 className="text-[17px] font-bold text-brand-text mb-3">{title}</h3>
              <p className="text-brand-slate leading-relaxed text-[15px]">{body}</p>
            </div>
          ))}
        </div>

        {/* Stat bar */}
        <div className="mt-10 rounded-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-brand-silver-light"
          style={{ background: '#0F2460' }}>
          {[
            { stat: '62%', desc: 'of customers will not leave a voicemail' },
            { stat: '78%', desc: 'will call the next business within 5 minutes' },
            { stat: '$500+', desc: 'average value of a single lost service job' },
          ].map(({ stat, desc }) => (
            <div key={stat} className="text-center md:px-8">
              <p className="text-[44px] font-extrabold text-white leading-none mb-2">{stat}</p>
              <p className="text-[14px] text-white/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4 ─ HOW IT WORKS
───────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: 1,
      icon: <Icon.Phone />,
      title: 'Customer Calls',
      body: 'A potential customer calls your business. You\'re on a job, between tasks, or simply unavailable to answer.',
    },
    {
      num: 2,
      icon: <Icon.Zap />,
      title: 'Instant Text Goes Out',
      body: 'The moment the call is missed, an automated text fires back to the caller within seconds — before they\'ve even thought about calling someone else.',
    },
    {
      num: 3,
      icon: <Icon.MessageSquare />,
      title: 'Lead Replies and Stays Engaged',
      body: 'The customer replies with their need. The conversation is open. They\'re engaged with your business instead of calling a competitor.',
    },
    {
      num: 4,
      icon: <Icon.CheckCircle />,
      title: 'Your Team Books the Job',
      body: 'The lead is routed toward booking — either automatically or handed off to your team. The job gets scheduled. Revenue recovered.',
    },
  ];

  return (
    <section id="how-it-works" className="bg-brand-surface py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div className="text-center mb-14">
          <p className="section-label mb-3">How It Works</p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-brand-text tracking-tight leading-tight mb-5">
            Simple for You. Fast for the Customer.
          </h2>
          <p className="text-[17px] text-brand-slate max-w-xl mx-auto leading-relaxed">
            The system runs in the background automatically. No changes to how your business operates. No extra work for your team.
          </p>
        </div>

        {/* Step flow — vertical on mobile, horizontal on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3 mb-10">
          {steps.map(({ num, icon, title, body }, i) => (
            <div key={num} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[28px] left-[calc(50%+28px)] right-[-8px] h-[2px]"
                  style={{ background: 'linear-gradient(to right, #1A3A8F40, #1A3A8F20)' }} />
              )}
              <div className="card text-center h-full flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 relative z-10"
                  style={{ background: i === steps.length - 1 ? '#1B7A3D' : '#1A3A8F' }}>
                  {icon}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-label mb-2"
                  style={{ color: i === steps.length - 1 ? '#1B7A3D' : '#1A3A8F' }}>
                  Step {num}
                </div>
                <h3 className="font-bold text-[15px] text-brand-text mb-2">{title}</h3>
                <p className="text-[13px] text-brand-slate leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={openCalendly} className="btn-primary">
            See It in Action
            <Icon.ArrowRight />
          </button>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5 ─ EMERGENCY / URGENT RESPONSE
───────────────────────────────────────────────────────────── */
function EmergencyFlow() {
  return (
    <section id="emergency" className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F2460 0%, #1A3A8F 100%)' }}>

      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#C4421A]/20 border border-[#C4421A]/35 rounded-full px-4 py-2 mb-5">
            <Icon.Flame />
            <span className="section-label text-[#FF8A70] text-[11px]">Priority Response</span>
          </div>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-white tracking-tight leading-tight mb-5">
            Urgent Calls Need Faster Response
          </h2>
          <p className="text-[17px] text-white/65 max-w-2xl mx-auto leading-relaxed">
            For emergency service businesses, our system can prioritize urgent call situations so hot leads do not cool off while your team is on another job.
          </p>
        </div>

        {/* Priority call visual */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* Emergency path */}
          <div className="rounded-card p-7 border relative overflow-hidden"
            style={{ background: 'rgba(196,66,26,0.12)', borderColor: 'rgba(196,66,26,0.35)' }}>
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                style={{ background: '#C4421A', color: 'white' }}>High Priority</span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: '#C4421A' }}>
                <Icon.Zap />
              </div>
              <div>
                <p className="text-white font-bold text-[17px] leading-none">Emergency Path</p>
                <p className="text-white/50 text-[13px] mt-1">Immediate priority alert</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {['EMERGENCY', 'ASAP', 'URGENT', 'NOW'].map(kw => (
                <span key={kw} className="px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider"
                  style={{ background: 'rgba(196,66,26,0.25)', color: '#FF8A70', border: '1px solid rgba(196,66,26,0.45)' }}>
                  {kw}
                </span>
              ))}
            </div>
            <ul className="space-y-3">
              {[
                'Lead flagged as urgent the moment they reply',
                'Your team receives an immediate priority alert',
                'Fast-tracked for callback before any standard queue',
                'No hot lead sits waiting while you\'re on another job',
              ].map(t => (
                <li key={t} className="flex items-start gap-2 text-[14px] text-white/80">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#FF8A70" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Standard path */}
          <div className="rounded-card p-7 border"
            style={{ background: 'rgba(27,122,61,0.12)', borderColor: 'rgba(27,122,61,0.35)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: '#1B7A3D' }}>
                <Icon.Calendar />
              </div>
              <div>
                <p className="text-white font-bold text-[17px] leading-none">Standard Booking Path</p>
                <p className="text-white/50 text-[13px] mt-1">Guided toward scheduling</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {['APPOINTMENT', 'SERVICE', 'QUOTE', 'ESTIMATE'].map(kw => (
                <span key={kw} className="px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider"
                  style={{ background: 'rgba(27,122,61,0.25)', color: '#6DEBA8', border: '1px solid rgba(27,122,61,0.4)' }}>
                  {kw}
                </span>
              ))}
            </div>
            <ul className="space-y-3">
              {[
                'Customer is guided directly to your booking flow',
                'Lead information is captured for follow-up',
                'Moves toward a confirmed appointment automatically',
                'No admin work required from your end',
              ].map(t => (
                <li key={t} className="flex items-start gap-2 text-[14px] text-white/80">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6DEBA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button onClick={openCalendly} className="btn-white">
            Book a Demo to See This Live
            <Icon.ArrowRight />
          </button>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6 ─ BENEFITS / OUTCOMES
───────────────────────────────────────────────────────────── */
function Benefits() {
  const benefits = [
    {
      icon: <Icon.Zap />,
      title: 'Faster Lead Response',
      body: 'Every missed call gets a reply in seconds — not minutes, not hours. You\'re in the conversation before the lead has a chance to move on.',
    },
    {
      icon: <Icon.TrendingUp />,
      title: 'More Booked Jobs',
      body: 'Leads that would have disappeared are now converting. More conversations started means more jobs scheduled and more revenue closed.',
    },
    {
      icon: <Icon.DollarSign />,
      title: 'Less Revenue Left on the Table',
      body: 'Stop bleeding money through the cracks of missed calls. The system is built to recover revenue you\'re already earning — just not capturing.',
    },
    {
      icon: <Icon.Clock />,
      title: 'No Extra Admin Workload',
      body: 'This runs automatically alongside your existing phone process. No new hires. No extra tasks. No disruption to how you already work.',
    },
  ];

  return (
    <section id="benefits" className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div className="text-center mb-14">
          <p className="section-label mb-3">Built for Revenue</p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-brand-text tracking-tight leading-tight mb-5">
            Built to Recover Revenue,<br />Not Just Send Texts
          </h2>
          <p className="text-[17px] text-brand-slate max-w-2xl mx-auto leading-relaxed">
            Most tools send a text and stop. This system captures the lead, keeps the conversation going, and moves them toward a booked job.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {benefits.map(({ icon, title, body }) => (
            <div key={title} className="card-hover group flex gap-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white"
                style={{ background: '#EEF2FB' }}>
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-[17px] text-brand-text mb-2">{title}</h3>
                <p className="text-brand-slate text-[15px] leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mid CTA inline */}
        <div className="rounded-[20px] p-8 md:p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #0F2460 0%, #1A3A8F 100%)' }}>
          <p className="text-white/55 text-[13px] uppercase tracking-label mb-3">See It Working</p>
          <h3 className="text-[22px] md:text-[28px] font-extrabold text-white tracking-tight mb-3">
            Stop Losing Jobs From Missed Calls
          </h3>
          <p className="text-white/60 text-[15px] mb-6 max-w-md mx-auto leading-relaxed">
            Book a free 20-minute demo. See what it looks like for your business and how fast it can be live.
          </p>
          <button onClick={openCalendly} className="btn-white text-[14px]">
            Book My Free Demo
            <Icon.ArrowRight />
          </button>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7 ─ WHO IT HELPS
───────────────────────────────────────────────────────────── */
function WhoItsFor() {
  const businesses = [
    { icon: <Icon.Droplets />, name: 'HVAC' },
    { icon: <Icon.Droplets />, name: 'Plumbing' },
    { icon: <Icon.Bolt />, name: 'Electrical' },
    { icon: <Icon.Roof />, name: 'Roofing' },
    { icon: <Icon.Home />, name: 'Restoration' },
    { icon: <Icon.Key />, name: 'Locksmith' },
    { icon: <Icon.Wrench />, name: 'Garage Door' },
    { icon: <Icon.Truck />, name: 'Towing' },
    { icon: <Icon.Tool />, name: 'Appliance Repair' },
    { icon: <Icon.Home />, name: 'Home Services' },
  ];

  return (
    <section id="who" className="bg-brand-surface py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div className="text-center mb-14">
          <p className="section-label mb-3">Who It's Built For</p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-brand-text tracking-tight leading-tight mb-5">
            Built for Service Businesses<br />That Can't Afford to Miss Calls
          </h2>
          <p className="text-[17px] text-brand-slate max-w-xl mx-auto leading-relaxed">
            If your phone rings throughout the day and you can't always answer, this system was built for you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
          {businesses.map(({ icon, name }) => (
            <div key={name} className="card-hover text-center py-6">
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 text-brand-blue"
                style={{ background: '#EEF2FB' }}>
                {icon}
              </div>
              <h3 className="font-bold text-[14px] text-brand-text">{name}</h3>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-brand-slate text-[15px] leading-relaxed max-w-2xl mx-auto">
            Any service business that runs on inbound calls is losing jobs to missed calls. This system stops that.
          </p>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   8 ─ TRUST / PROOF
───────────────────────────────────────────────────────────── */
function Trust() {
  const trustPoints = [
    {
      icon: <Icon.Zap />,
      title: 'Fast Setup',
      body: 'Most businesses are live within days. No technical work required on your end.',
    },
    {
      icon: <Icon.Wrench />,
      title: 'Built for Real Service Workflows',
      body: 'This was designed around how field service businesses actually operate — not how a software team imagines they do.',
    },
    {
      icon: <Icon.Phone />,
      title: 'Works Alongside Your Current Phone Process',
      body: 'Nothing about your existing setup changes. The system plugs in and runs in the background automatically.',
    },
    {
      icon: <Icon.MessageSquare />,
      title: 'Captures Leads Automatically',
      body: 'Every missed call gets a response and the lead is captured — whether they book immediately or need follow-up.',
    },
    {
      icon: <Icon.DollarSign />,
      title: 'Designed to Support Revenue',
      body: 'The goal is recovered jobs and booked revenue. Not dashboards. Not engagement metrics. Real money back in your business.',
    },
    {
      icon: <Icon.Clock />,
      title: 'No Extra Admin Work',
      body: 'Your team doesn\'t need to manage it. It runs, responds, and routes — without adding anything to your plate.',
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div className="text-center mb-14">
          <p className="section-label mb-3">Why Service Businesses Choose A1</p>
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-brand-text tracking-tight leading-tight mb-5">
            Why Service Businesses<br />Choose A1 Creative
          </h2>
          <p className="text-[17px] text-brand-slate max-w-xl mx-auto leading-relaxed">
            Built for the realities of running a service business — not a boardroom pitch deck.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {trustPoints.map(({ icon, title, body }) => (
            <div key={title} className="card flex gap-4 items-start">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-blue"
                style={{ background: '#EEF2FB' }}>
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-brand-text mb-1">{title}</h3>
                <p className="text-[13px] text-brand-slate leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recovery stat callout */}
        <div className="rounded-card p-8 md:p-10 flex flex-col md:flex-row items-center gap-8"
          style={{ background: '#0F2460' }}>
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-bold text-[20px] mb-2">The bottom line</p>
            <p className="text-white/60 text-[16px] leading-relaxed max-w-lg">
              Service businesses that implement a missed call recovery system stop losing leads they were already earning. The calls are coming in. The question is whether you're catching them.
            </p>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <div className="rounded-card p-8 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <p className="text-white/50 text-[11px] uppercase tracking-label mb-2">Leads Recovered</p>
              <p className="text-[56px] font-extrabold text-white leading-none mb-1">67%</p>
              <p className="text-white/50 text-[13px]">of missed calls turned into<br />engaged conversations</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   9 ─ FINAL CTA
───────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section id="booking" className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0F2460 0%, #1A3A8F 60%, #2A4EAF 100%)' }}>

      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #2A4EAF 0%, transparent 70%)' }}
      />

      <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-7">
          <Icon.Calendar />
          <span className="section-label text-white/70 text-[11px]">Free 20-Minute Demo</span>
        </div>

        <h2 className="text-[38px] md:text-[54px] lg:text-[62px] font-extrabold text-white tracking-tight leading-[1.08] mb-6 text-balance">
          Book a Free<br />20-Minute Demo
        </h2>

        <p className="text-[18px] md:text-[20px] text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
          See exactly how the system works, what it would look like for your business, and how quickly it can start recovering missed revenue.
        </p>

        <button
          onClick={openCalendly}
          className="btn-white text-[15px] px-10 py-5 shadow-cta"
        >
          Book My Demo
          <Icon.ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-white/40 text-[14px] mt-5">
          No pressure. No fluff. Just a clear walkthrough of the system.
        </p>

        {/* Value props row */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-12">
          {[
            { icon: <Icon.Clock />, label: '20 Minutes', sub: 'Quick, clear, no pressure' },
            { icon: <Icon.Shield />, label: 'No Contracts', sub: 'Month-to-month, cancel anytime' },
            { icon: <Icon.Zap />, label: 'Fast Setup', sub: 'Live within days, not weeks' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-1"
                style={{ background: 'rgba(255,255,255,0.10)' }}>
                {icon}
              </div>
              <p className="text-white font-bold text-[15px]">{label}</p>
              <p className="text-white/50 text-[13px]">{sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: '#080F1F' }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-10 pb-10 border-b border-white/10">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center rounded-[10px] w-9 h-9"
                style={{ background: '#1A3A8F' }}>
                <span className="text-white font-black text-[11px] tracking-tight">A/1</span>
              </div>
              <span className="text-white font-extrabold text-[17px] tracking-tight">A1 Creative</span>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-xs">
              Missed Call Revenue Recovery System for HVAC, plumbing, electrical, roofing, and home service businesses.
            </p>
          </div>

          <div>
            <p className="section-label text-white/30 mb-4">Navigate</p>
            <ul className="space-y-2">
              {[
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Emergency Response', href: '#emergency' },
                { label: 'Benefits', href: '#benefits' },
                { label: 'Who We Help', href: '#who' },
                { label: 'Book a Demo', href: CALENDLY_URL },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/45 text-[14px] no-underline hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label text-white/30 mb-4">Ready to Start?</p>
            <p className="text-white/45 text-[14px] leading-relaxed mb-5">
              Book a free 20-minute demo and see the system in action for your business.
            </p>
            <button onClick={openCalendly} className="btn-primary text-[13px] px-6 py-3">
              Book a Demo
              <Icon.ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-[13px]">
            © {new Date().getFullYear()} A1 Creative Agency. All rights reserved.
          </p>
          <p className="text-white/25 text-[13px]">
            Missed Call Revenue Recovery for Service Businesses
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="font-outfit antialiased">
      <Header />
      <main>
        <Hero />
        <RevenueLeakage />
        <ProofBullets />
        <Pain />
        <HowItWorks />
        <EmergencyFlow />
        <Benefits />
        <WhoItsFor />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
