"use client";

import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home",        href: "/" },
    { name: "Marketplace", href: "/products" },
    { name: "Dashboard",   href: "/dashboard" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        :root {
          --orange: #F97316;
          --black: #111111;
          --white: #FFFFFF;
          --gray-bg: #F4F4F5;
          --gray-border: #E4E4E7;
          --muted: #78716C;
          --font-display: 'Syne', sans-serif;
          --font-body: 'Nunito', sans-serif;
          /* ✅ Variable for consistent spacing */
          --nav-height: clamp(60px, 8vw, 72px);
          --nav-margin: 24px; 
        }

        /* ─── SPACER ─── */
        /* This pushes the page content down so it doesn't hide behind the fixed navbar */
        .nav-spacer {
          height: calc(var(--nav-height) + var(--nav-margin));
          width: 100%;
        }

        /* ─── NAV SHELL ─── */
        .cm-nav {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          z-index: 50;
          transition: all 0.3s ease;
          animation: slideDown 0.5s ease both;
          font-family: var(--font-body);
        }

        .cm-nav.scrolled {
          background: rgba(244, 244, 245, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 2px solid var(--black);
          box-shadow: 0 4px 0 var(--orange);
        }

        .cm-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 5vw, 48px);
          height: var(--nav-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* ─── LOGO ─── */
        .cm-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .cm-logo-icon {
          width: 38px; height: 38px;
          background: var(--black);
          color: var(--white);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--black);
          box-shadow: 2px 2px 0 var(--orange);
          transition: box-shadow 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .cm-logo:hover .cm-logo-icon {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 var(--orange);
        }

        .cm-logo-text {
          display: flex;
          flex-direction: column;
          gap: 0;
          line-height: 1;
        }
        .cm-logo-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--black);
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .cm-logo-name span { color: var(--orange); }
        .cm-logo-sub {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 1px;
        }

        /* ─── DESKTOP LINKS ─── */
        .cm-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 768px) { .cm-links { display: none; } }

        .cm-link {
          position: relative;
          padding: 8px 14px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .cm-link::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 14px;
          width: 0; height: 2px;
          background: var(--orange);
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .cm-link:hover {
          color: var(--black);
          background: rgba(249, 115, 22, 0.07);
        }
        .cm-link:hover::after { width: calc(100% - 28px); }

        /* ─── DESKTOP ACTIONS ─── */
        .cm-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) { .cm-actions { display: none; } }

        .cm-login {
          padding: 9px 18px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--black);
          text-decoration: none;
          border: 2px solid transparent;
          border-radius: 10px;
          transition: color 0.2s, border-color 0.2s;
        }
        .cm-login:hover {
          color: var(--orange);
          border-color: rgba(249,115,22,0.2);
        }

        .cm-register {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 8px 8px 18px;
          background: var(--black);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 10px;
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 3px 3px 0 var(--orange);
          transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
        }
        .cm-register:hover {
          background: var(--orange);
          border-color: var(--orange);
          box-shadow: 3px 3px 0 var(--black);
          transform: translate(-1px, -1px);
        }
        .cm-register:active {
          transform: translate(0,0);
          box-shadow: 1px 1px 0 var(--orange);
        }
        .cm-reg-dot {
          width: 28px; height: 28px;
          background: var(--white);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .cm-register:hover .cm-reg-dot { transform: rotate(45deg); }

        /* ─── MOBILE TOGGLE ─── */
        .cm-mobile-toggle {
          display: none;
          width: 40px; height: 40px;
          background: var(--white);
          border: 2px solid var(--black);
          border-radius: 10px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 2px 2px 0 var(--black);
          color: var(--black);
          transition: transform 0.15s, box-shadow 0.15s;
          flex-shrink: 0;
        }
        .cm-mobile-toggle:hover {
          transform: translate(-1px,-1px);
          box-shadow: 3px 3px 0 var(--black);
        }
        @media (max-width: 768px) { .cm-mobile-toggle { display: flex; } }

        /* ─── MOBILE MENU ─── */
        .cm-mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 40;
          background: var(--black);
          display: flex;
          flex-direction: column;
          padding: clamp(80px, 15vw, 100px) clamp(24px, 6vw, 48px) clamp(40px, 8vw, 56px);
          animation: menuIn 0.3s ease both;
          overflow: hidden;
        }

        .cm-mobile-menu::before {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: var(--orange);
          border-radius: 50%;
          bottom: -80px; right: -80px;
          opacity: 0.1;
          pointer-events: none;
        }

        .mob-links {
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
        }

        .mob-link {
          font-family: var(--font-display);
          font-size: clamp(36px, 10vw, 56px);
          font-weight: 800;
          color: rgba(255,255,255,0.15);
          text-decoration: none;
          letter-spacing: -1px;
          line-height: 1.1;
          padding: 14px 0;
          border-bottom: 1.5px solid rgba(255,255,255,0.06);
          transition: color 0.2s;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mob-link:hover { color: var(--white); }
        .mob-link:first-child { color: var(--white); }

        .mob-link-arrow {
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .mob-link:hover .mob-link-arrow {
          background: var(--orange);
          border-color: var(--orange);
        }

        .mob-actions {
          display: flex;
          gap: 12px;
          padding-top: 28px;
          position: relative;
          z-index: 1;
        }

        .mob-login {
          flex: 1;
          padding: 14px;
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
          text-decoration: none;
          text-align: center;
          transition: background 0.2s, color 0.2s;
        }
        .mob-login:hover { background: rgba(255,255,255,0.1); color: var(--white); }

        .mob-register {
          flex: 1;
          padding: 14px;
          background: var(--orange);
          border: 2.5px solid var(--orange);
          border-radius: 12px;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--white);
          text-decoration: none;
          text-align: center;
          box-shadow: 3px 3px 0 rgba(255,255,255,0.15);
          transition: background 0.2s;
        }
        .mob-register:hover { background: #EA6A0A; }

        .mob-sell-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(249,115,22,0.12);
          border: 1.5px solid rgba(249,115,22,0.25);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--orange);
          text-decoration: none;
          width: fit-content;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`cm-nav${isScrolled ? " scrolled" : ""}`}>
        <div className="cm-nav-inner">
          <a href="/" className="cm-logo">
            <div className="cm-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div className="cm-logo-text">
              <span className="cm-logo-name">Campus<span>.</span></span>
              <span className="cm-logo-sub">Mart</span>
            </div>
          </a>

          <div className="cm-links">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="cm-link">
                {link.name}
              </a>
            ))}
          </div>

          <div className="cm-actions">
            <a href="/login" className="cm-login">Log In</a>
            <a href="/register" className="cm-register">
              Register
              <span className="cm-reg-dot">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                </svg>
              </span>
            </a>
          </div>

          <button
            className="cm-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ✅ Nav Spacer: ensures content starts after the navbar margin */}
      {!isMobileMenuOpen && <div className="nav-spacer" />}

      {/* ── MOBILE MENU ── */}
      {isMobileMenuOpen && (
        <div className="cm-mobile-menu">
          <a href="/sell-product" className="mob-sell-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            List an Item
          </a>

          <div className="mob-links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="mob-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                <span className="mob-link-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                  </svg>
                </span>
              </a>
            ))}
          </div>

          <div className="mob-actions">
            <a href="/login" className="mob-login">Log In</a>
            <a href="/register" className="mob-register">Register</a>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;