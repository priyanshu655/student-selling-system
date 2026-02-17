"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      console.log("LOGIN FRONTEND ERROR:", err);
      setError("Unexpected error occurred. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
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
          --placeholder: #A8A29E;
          --font-display: 'Syne', sans-serif;
          --font-body: 'Nunito', sans-serif;
        }

        .login-page {
          min-height: 100vh;
          background: var(--gray-bg);
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: var(--font-body);
        }

        @media (max-width: 768px) {
          .login-page { grid-template-columns: 1fr; }
          .login-left  { display: none; }
        }

        /* ─── LEFT PANEL ─── */
        .login-left {
          background: var(--black);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(36px, 5vw, 56px);
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          width: 360px; height: 360px;
          background: var(--orange);
          border-radius: 50%;
          top: -120px; left: -80px;
          opacity: 0.15;
        }
        .login-left::after {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          background: var(--orange);
          border-radius: 50%;
          bottom: 60px; right: -60px;
          opacity: 0.1;
        }
        .left-brand {
          display: flex; align-items: center; gap: 10px;
          position: relative; z-index: 1;
        }
        .brand-icon {
          background: var(--orange); width: 40px; height: 40px;
          border-radius: 10px; border: 2px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .brand-name {
          font-family: var(--font-display); font-size: 20px;
          font-weight: 800; color: var(--white); letter-spacing: -0.5px;
        }
        .left-hero { position: relative; z-index: 1; }
        .left-eyebrow {
          font-size: 10px; font-weight: 800; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--orange); margin-bottom: 14px;
        }
        .left-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 5vw, 64px); font-weight: 800;
          color: var(--white); line-height: 1; letter-spacing: -2px; margin-bottom: 20px;
        }
        .left-title span { color: var(--orange); }
        .left-desc { font-size: 14px; font-weight: 600; color: #666; line-height: 1.7; max-width: 300px; }
        .left-stats { display: flex; gap: 20px; position: relative; z-index: 1; flex-wrap: wrap; }
        .stat-box {
          background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 14px 20px;
        }
        .stat-num { font-family: var(--font-display); font-size: 26px; font-weight: 800; color: var(--white); line-height: 1; display: block; }
        .stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #555; display: block; margin-top: 4px; }

        /* ─── RIGHT PANEL ─── */
        .login-right {
          display: flex; align-items: center; justify-content: center;
          padding: clamp(24px, 5vw, 56px) clamp(20px, 5vw, 64px);
        }
        .login-card { width: 100%; max-width: 400px; animation: fadeUp 0.45s ease both; }

        .mobile-brand { display: none; align-items: center; gap: 10px; margin-bottom: 32px; }
        @media (max-width: 768px) { .mobile-brand { display: flex; } }
        .mobile-brand-icon {
          background: var(--black); color: var(--white); width: 38px; height: 38px;
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          box-shadow: 2px 2px 0 var(--orange);
        }
        .mobile-brand-name { font-family: var(--font-display); font-size: 18px; font-weight: 800; color: var(--black); }

        .card-eyebrow { font-size: 10px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; color: var(--orange); margin-bottom: 10px; }
        .card-title { font-family: var(--font-display); font-size: clamp(32px, 6vw, 46px); font-weight: 800; color: var(--black); line-height: 1; letter-spacing: -1.5px; margin-bottom: 6px; }
        .card-sub { font-size: 13px; font-weight: 600; color: var(--muted); margin-bottom: 32px; line-height: 1.5; }

        /* ─── FORM ─── */
        .login-form { display: flex; flex-direction: column; gap: 14px; }

        .f-label { display: block; font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--label); margin-bottom: 7px; }

        .input-box {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px;
          border: 2px solid var(--black); border-radius: 14px;
          background: #FAFAFA;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 3px 3px 0 var(--black);
        }
        .input-box:focus-within {
          border-color: var(--orange); box-shadow: 3px 3px 0 var(--orange); background: var(--white);
        }
        .input-box .i-icon { color: var(--muted); flex-shrink: 0; display: flex; transition: color 0.2s; }
        .input-box:focus-within .i-icon { color: var(--orange); }

        /* KEY FIX: inputs start readonly, readOnly removed on focus — kills autofill */
        .input-box input {
          flex: 1; border: none; outline: none; background: transparent;
          font-family: var(--font-body); font-size: 15px; font-weight: 700;
          color: var(--black); min-width: 0;
        }
        .input-box input::placeholder { color: var(--placeholder); font-weight: 600; }

        /* Kill Chrome yellow autofill background */
        .input-box input:-webkit-autofill,
        .input-box input:-webkit-autofill:hover,
        .input-box input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #FAFAFA inset !important;
          -webkit-text-fill-color: var(--black) !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .error-box {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px;
          background: #FEF2F2; border: 2px solid #FCA5A5; border-radius: 12px;
          font-size: 13px; font-weight: 700; color: #DC2626;
          animation: shake 0.4s ease;
        }

        .submit-btn {
          display: flex; align-items: center; justify-content: space-between;
          padding: 6px 6px 6px 24px;
          background: var(--black); border: 2.5px solid var(--black); border-radius: 14px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
          box-shadow: 4px 4px 0 var(--orange);
          margin-top: 6px; width: 100%;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--orange); border-color: var(--orange);
          box-shadow: 4px 4px 0 var(--black); transform: translate(-2px, -2px);
        }
        .submit-btn:active:not(:disabled) { transform: translate(0,0); box-shadow: 2px 2px 0 var(--orange); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .submit-text { font-family: var(--font-display); font-size: 14px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--white); }
        .submit-arrow {
          width: 44px; height: 44px; background: var(--white); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: transform 0.2s;
        }
        .submit-btn:hover .submit-arrow { transform: rotate(45deg); }

        .form-divider { display: flex; align-items: center; gap: 12px; margin: 4px 0; }
        .form-divider-line { flex: 1; height: 1.5px; background: var(--gray-border); border-radius: 2px; }
        .form-divider-text { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--placeholder); }

        .register-row { text-align: center; margin-top: 4px; }
        .register-hint { font-size: 12px; font-weight: 700; color: var(--muted); }
        .register-link {
          font-size: 12px; font-weight: 900; color: var(--black); text-decoration: none;
          border-bottom: 2px solid var(--orange); padding-bottom: 1px;
          transition: color 0.15s; margin-left: 4px;
        }
        .register-link:hover { color: var(--orange); }
      `}</style>

      <div className="login-page">

        {/* ── LEFT PANEL ── */}
        <aside className="login-left">
          <div className="left-brand">
            <div className="brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="brand-name">CampusMart</span>
          </div>

          <div className="left-hero">
            <p className="left-eyebrow">Student Marketplace</p>
            <h2 className="left-title">Buy &amp; Sell<br /><span>Campus</span><br />Gear.</h2>
            <p className="left-desc">The fastest way to trade everything from textbooks to tech — all within your campus community.</p>
          </div>

          <div className="left-stats">
            <div className="stat-box"><span className="stat-num">2.4k</span><span className="stat-label">Listings</span></div>
            <div className="stat-box"><span className="stat-num">800+</span><span className="stat-label">Students</span></div>
            <div className="stat-box"><span className="stat-num">4</span><span className="stat-label">Categories</span></div>
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="login-right">
          <div className="login-card">

            {/* Mobile brand */}
            <div className="mobile-brand">
              <div className="mobile-brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <span className="mobile-brand-name">CampusMart</span>
            </div>

            <p className="card-eyebrow">Member Login</p>
            <h1 className="card-title">Welcome<br />Back.</h1>
            <p className="card-sub">Enter your credentials to access your account</p>

            {/*
              AUTOFILL FIX:
              1. Hidden dummy inputs at the top absorb browser autofill targeting
              2. Real inputs start as readOnly — browsers skip readOnly fields
              3. readOnly is removed on first focus (onFocus) so user can type normally
              4. autoComplete="new-password" on password tells browsers it's NOT a login field
              5. Chrome autofill yellow bg neutralised via -webkit-autofill CSS
            */}
            <div style={{ display: "none" }} aria-hidden="true">
              <input type="text" tabIndex={-1} />
              <input type="password" tabIndex={-1} />
            </div>

            <form className="login-form" onSubmit={handleLogin} autoComplete="off">

              {/* Email */}
              <div>
                <label className="f-label" htmlFor="cm-email">Email Address</label>
                <div className="input-box">
                  <span className="i-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="cm-email"
                    type="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => (e.target as HTMLInputElement).removeAttribute("readOnly")}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="f-label" htmlFor="cm-password">Password</label>
                <div className="input-box">
                  <span className="i-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="cm-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => (e.target as HTMLInputElement).removeAttribute("readOnly")}
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="error-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={loading}>
                <span className="submit-text">{loading ? "Signing in…" : "Sign In"}</span>
                <span className="submit-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 17 7 17 17"/>
                  </svg>
                </span>
              </button>

              {/* Divider */}
              <div className="form-divider">
                <div className="form-divider-line" />
                <span className="form-divider-text">New here?</span>
                <div className="form-divider-line" />
              </div>

              <div className="register-row">
                <span className="register-hint">Don't have an account?</span>
                <Link href="/register" className="register-link">Create One →</Link>
              </div>

            </form>
          </div>
        </main>

      </div>
    </>
  );
}