import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }

        :root {
          --orange: #F97316;
          --orange-light: #FFF7ED;
          --black: #111111;
          --white: #FFFFFF;
          --gray-bg: #F4F4F5;
          --gray-border: #E4E4E7;
          --label: #44403C;
          --muted: #78716C;
          --font-display: 'Syne', sans-serif;
          --font-body: 'Nunito', sans-serif;
        }

        .landing {
          min-height: 100vh;
          background: var(--gray-bg);
          font-family: var(--font-body);
          display: flex;
          flex-direction: column;
        }

        /* ─── HERO ─── */
        .hero {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: clamp(32px, 6vw, 64px) clamp(16px, 5vw, 48px);
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: clamp(24px, 4vw, 48px);
          align-items: center;
        }

        @media (max-width: 860px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { display: none; }
        }

        /* ── HERO LEFT ── */
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 28px;
          animation: fadeUp 0.5s ease both;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--white);
          border: 2px solid var(--black);
          border-radius: 100px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--label);
          box-shadow: 2px 2px 0 var(--black);
          width: fit-content;
        }
        .eyebrow-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 1.8s ease-in-out infinite;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(48px, 8vw, 88px);
          font-weight: 800;
          color: var(--black);
          line-height: 0.95;
          letter-spacing: -3px;
        }
        .hero-title .orange { color: var(--orange); }
        .hero-title .outline {
          -webkit-text-stroke: 2.5px var(--black);
          color: transparent;
        }

        .hero-desc {
          font-size: clamp(14px, 2vw, 17px);
          font-weight: 600;
          color: var(--muted);
          line-height: 1.7;
          max-width: 480px;
        }

        .hero-cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 6px 6px 24px;
          background: var(--black);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 4px 4px 0 var(--orange);
          transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
        }
        .btn-primary:hover {
          background: var(--orange);
          border-color: var(--orange);
          box-shadow: 4px 4px 0 var(--black);
          transform: translate(-2px, -2px);
        }
        .btn-primary:active { transform: translate(0,0); box-shadow: 2px 2px 0 var(--orange); }

        .btn-arrow {
          width: 40px; height: 40px;
          background: var(--white);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .btn-primary:hover .btn-arrow { transform: rotate(45deg); }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          background: var(--white);
          color: var(--black);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 3px 3px 0 var(--black);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-secondary:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--black); }
        .btn-secondary:active { transform: translate(0,0); box-shadow: 2px 2px 0 var(--black); }

        /* Stats strip */
        .stats-strip {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-left: 16px;
          border-left: 3px solid var(--orange);
        }
        .stat-num {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: var(--black);
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .stat-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ── HERO RIGHT ── */
        .hero-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeUp 0.55s 0.1s ease both;
        }

        /* Big black hero card */
        .hero-main-card {
          background: var(--black);
          border: 2.5px solid var(--black);
          border-radius: 24px;
          padding: 32px 28px;
          box-shadow: 6px 6px 0 var(--orange);
          position: relative;
          overflow: hidden;
        }
        .hero-main-card::before {
          content: '';
          position: absolute;
          width: 220px; height: 220px;
          background: var(--orange);
          border-radius: 50%;
          top: -80px; right: -60px;
          opacity: 0.12;
        }

        .hmc-eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .hmc-title {
          font-family: var(--font-display);
          font-size: 34px;
          font-weight: 800;
          color: var(--white);
          line-height: 1;
          letter-spacing: -1px;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .hmc-title span { color: var(--orange); }

        .category-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .chip {
          padding: 7px 14px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: #aaa;
        }
        .chip.active {
          background: var(--orange);
          border-color: var(--orange);
          color: var(--white);
        }

        /* Two small cards */
        .small-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .small-card {
          background: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 4px 4px 0 var(--black);
        }
        .sc-icon {
          width: 40px; height: 40px;
          background: var(--orange-light);
          border: 2px solid var(--gray-border);
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .sc-num {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 800;
          color: var(--black);
          line-height: 1;
          letter-spacing: -0.5px;
          display: block;
          margin-bottom: 3px;
        }
        .sc-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          display: block;
        }

        /* ─── FEATURE ROW ─── */
        .features {
          background: var(--black);
          border-top: 2.5px solid var(--black);
          padding: clamp(28px, 4vw, 48px) clamp(16px, 5vw, 48px);
        }
        .features-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0;
        }

        .feature {
          padding: 28px 32px;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .feature:last-child { border-right: none; }

        @media (max-width: 600px) {
          .feature { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .feature:last-child { border-bottom: none; }
        }

        .feat-icon {
          width: 38px; height: 38px;
          background: rgba(249,115,22,0.15);
          border: 1.5px solid rgba(249,115,22,0.25);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--orange);
        }
        .feat-title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -0.3px;
        }
        .feat-desc {
          font-size: 12px;
          font-weight: 600;
          color: #555;
          line-height: 1.6;
        }
      `}</style>

      <div className="landing">
        <Navbar />

        {/* ── HERO ── */}
        <section className="hero">

          {/* Left */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Student Marketplace · India
            </div>

            <h1 className="hero-title">
              Buy.<br />
              <span className="orange">Sell.</span><br />
              <span className="outline">Campus.</span>
            </h1>

            <p className="hero-desc">
              CampusMart is the fastest way to trade textbooks, electronics, furniture and more — exclusively within your campus community. No middlemen, no hassle.
            </p>

            <div className="hero-cta-row">
              <Link href="/products" className="btn-primary">
                Browse Listings
                <span className="btn-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                  </svg>
                </span>
              </Link>
              <Link href="/sell-product" className="btn-secondary">
                + List an Item
              </Link>
            </div>

            <div className="stats-strip">
              <div className="stat">
                <span className="stat-num">2.4k</span>
                <span className="stat-label">Listings</span>
              </div>
              <div className="stat">
                <span className="stat-num">800+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat">
                <span className="stat-num">4</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat">
                <span className="stat-num">Free</span>
                <span className="stat-label">To Join</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="hero-right">
            <div className="hero-main-card">
              <p className="hmc-eyebrow">What's on the market</p>
              <h2 className="hmc-title">Campus<br /><span>Gear.</span></h2>
              <div className="category-chips">
                {["Electronics", "Books", "Furniture", "Sports"].map((c, i) => (
                  <span key={c} className={`chip${i === 0 ? " active" : ""}`}>{c}</span>
                ))}
              </div>
            </div>

            <div className="small-cards">
              <div className="small-card">
                <div className="sc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                  </svg>
                </div>
                <span className="sc-num">₹500</span>
                <span className="sc-label">Avg. Listing</span>
              </div>

              <div className="small-card">
                <div className="sc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <span className="sc-num">800+</span>
                <span className="sc-label">Students</span>
              </div>
            </div>
          </div>

        </section>

        {/* ── FEATURES STRIP ── */}
        <div className="features">
          <div className="features-inner">
            {[
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: "Student-Only",
                desc: "Every user is verified with a college ID. Trade only within your campus.",
              },
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                title: "List in 60 Seconds",
                desc: "Upload a photo, set a price and publish. Your listing goes live instantly.",
              },
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
                title: "Zero Commission",
                desc: "We take nothing. Every rupee from your sale goes directly to you.",
              },
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
                title: "Direct Contact",
                desc: "Message sellers directly. No bots, no delays — real students, real deals.",
              },
            ].map((f) => (
              <div className="feature" key={f.title}>
                <div className="feat-icon">{f.icon}</div>
                <p className="feat-title">{f.title}</p>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}