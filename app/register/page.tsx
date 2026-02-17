"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    collegeId: "",
    password: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Added 'auto' property to each field to prevent browser autofill
  const inputFields = [
    { id: "name",      label: "Full Name",          type: "text",     placeholder: "Alex Johnson",          icon: "user", auto: "off" },
    { id: "email",     label: "College Email",       type: "email",    placeholder: "you@college.edu",       icon: "mail", auto: "off" },
    { id: "collegeId", label: "College ID Number",   type: "text",     placeholder: "CS2024001",             icon: "id",   auto: "off" },
    { id: "password",  label: "Password",            type: "password", placeholder: "Min. 6 characters",     icon: "lock", auto: "new-password" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.collegeId || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed."); setLoading(false); return; }
      setFormData({ name: "", email: "", collegeId: "", password: "" });
      router.push("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const icons: Record<string, JSX.Element> = {
    user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    mail: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    id:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/></svg>,
    lock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
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

        .reg-page {
          min-height: 100vh;
          background: var(--gray-bg);
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: var(--font-body);
        }

        @media (max-width: 768px) {
          .reg-page { grid-template-columns: 1fr; }
          .reg-left  { display: none; }
        }

        /* ─── LEFT PANEL ─── */
        .reg-left {
          background: var(--black);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(36px, 5vw, 56px);
          position: relative;
          overflow: hidden;
        }

        .reg-left::before {
          content: '';
          position: absolute;
          width: 360px; height: 360px;
          background: var(--orange);
          border-radius: 50%;
          bottom: -100px; right: -80px;
          opacity: 0.13;
        }
        .reg-left::after {
          content: '';
          position: absolute;
          width: 180px; height: 180px;
          background: var(--orange);
          border-radius: 50%;
          top: 80px; left: -50px;
          opacity: 0.07;
        }

        .left-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .brand-icon {
          background: var(--orange);
          width: 40px; height: 40px;
          border-radius: 10px;
          border: 2px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -0.5px;
        }

        .left-middle {
          position: relative;
          z-index: 1;
        }
        .left-eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 14px;
        }
        .left-title {
          font-family: var(--font-display);
          font-size: clamp(38px, 5vw, 60px);
          font-weight: 800;
          color: var(--white);
          line-height: 1;
          letter-spacing: -2px;
          margin-bottom: 20px;
        }
        .left-title span { color: var(--orange); }
        .left-desc {
          font-size: 14px;
          font-weight: 600;
          color: #555;
          line-height: 1.7;
          max-width: 300px;
        }

        /* Steps */
        .left-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .step-num {
          width: 30px; height: 30px;
          background: rgba(249,115,22,0.15);
          border: 1.5px solid rgba(249,115,22,0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          color: var(--orange);
          flex-shrink: 0;
        }
        .step-text {
          font-size: 13px;
          font-weight: 700;
          color: #555;
        }

        /* ─── RIGHT PANEL ─── */
        .reg-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(24px, 5vw, 56px) clamp(20px, 5vw, 64px);
        }

        .reg-card {
          width: 100%;
          max-width: 420px;
          animation: fadeUp 0.45s ease both;
        }

        /* Mobile brand */
        .mobile-brand {
          display: none;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        @media (max-width: 768px) {
          .mobile-brand { display: flex; }
        }
        .mobile-brand-icon {
          background: var(--black);
          color: var(--white);
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 2px 0 var(--orange);
        }
        .mobile-brand-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--black);
        }

        .card-eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 10px;
        }
        .card-title {
          font-family: var(--font-display);
          font-size: clamp(30px, 5.5vw, 44px);
          font-weight: 800;
          color: var(--black);
          line-height: 1;
          letter-spacing: -1.5px;
          margin-bottom: 6px;
        }
        .card-title span { color: var(--orange); }
        .card-sub {
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 28px;
          line-height: 1.5;
        }

        /* ─── FORM ─── */
        .reg-form { display: flex; flex-direction: column; gap: 12px; }

        .f-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--label);
          margin-bottom: 7px;
        }

        .input-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          border: 2px solid var(--black);
          border-radius: 14px;
          background: #FAFAFA;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 3px 3px 0 var(--black);
        }
        .input-box:focus-within {
          border-color: var(--orange);
          box-shadow: 3px 3px 0 var(--orange);
          background: var(--white);
        }
        .input-box .i-icon {
          color: var(--muted);
          flex-shrink: 0;
          display: flex;
          transition: color 0.2s;
        }
        .input-box:focus-within .i-icon { color: var(--orange); }

        .input-box input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 700;
          color: var(--black);
          min-width: 0;
        }
        .input-box input::placeholder {
          color: var(--placeholder);
          font-weight: 600;
        }

        /* Error */
        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #FEF2F2;
          border: 2px solid #FECACA;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #DC2626;
          animation: shake 0.4s ease;
        }

        /* Submit */
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 6px 6px 24px;
          background: var(--black);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
          box-shadow: 4px 4px 0 var(--orange);
          margin-top: 6px;
          width: 100%;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--orange);
          border-color: var(--orange);
          box-shadow: 4px 4px 0 var(--black);
          transform: translate(-2px, -2px);
        }
        .submit-btn:active:not(:disabled) {
          transform: translate(0,0);
          box-shadow: 2px 2px 0 var(--orange);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .submit-text {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--white);
        }
        .submit-arrow {
          width: 44px; height: 44px;
          background: var(--white);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .submit-btn:hover .submit-arrow { transform: rotate(45deg); }

        /* Divider + login link */
        .form-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 2px 0;
        }
        .form-divider-line {
          flex: 1;
          height: 1.5px;
          background: var(--gray-border);
          border-radius: 2px;
        }
        .form-divider-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--placeholder);
        }

        .login-row { text-align: center; }
        .login-hint {
          font-size: 12px;
          font-weight: 700;
          color: var(--muted);
        }
        .login-link {
          font-size: 12px;
          font-weight: 900;
          color: var(--black);
          text-decoration: none;
          border-bottom: 2px solid var(--orange);
          padding-bottom: 1px;
          transition: color 0.15s;
          margin-left: 4px;
        }
        .login-link:hover { color: var(--orange); }

        /* Progress bar */
        .progress-wrap {
          margin-bottom: 24px;
        }
        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .progress-text {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .progress-count {
          font-size: 10px;
          font-weight: 800;
          color: var(--orange);
        }
        .progress-track {
          height: 4px;
          background: var(--gray-border);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--orange);
          border-radius: 4px;
          transition: width 0.4s ease;
        }
      `}</style>

      <div className="reg-page">

        {/* ── LEFT PANEL ── */}
        <aside className="reg-left">
          <div className="left-brand">
            <div className="brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="brand-name">CampusMart</span>
          </div>

          <div className="left-middle">
            <p className="left-eyebrow">Create Account</p>
            <h2 className="left-title">
              Join the<br /><span>Campus</span><br />Community.
            </h2>
            <p className="left-desc">
              Buy and sell within your campus — textbooks, electronics, furniture and more. Fast, safe, student-first.
            </p>
          </div>

          <div className="left-steps">
            {[
              "Fill in your details",
              "Verify your college email",
              "Start buying & selling",
            ].map((s, i) => (
              <div className="step" key={i}>
                <span className="step-num">{i + 1}</span>
                <span className="step-text">{s}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="reg-right">
          <div className="reg-card">

            {/* Mobile brand */}
            <div className="mobile-brand">
              <div className="mobile-brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <span className="mobile-brand-name">CampusMart</span>
            </div>

            <p className="card-eyebrow">New Account</p>
            <h1 className="card-title">Student<br />Register<span>.</span></h1>
            <p className="card-sub">Join the academic revolution today</p>

            {/* Progress bar */}
            {(() => {
              const filled = Object.values(formData).filter(v => v.length > 0).length;
              return (
                <div className="progress-wrap">
                  <div className="progress-label">
                    <span className="progress-text">Profile Completion</span>
                    <span className="progress-count">{filled}/4 fields</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(filled / 4) * 100}%` }} />
                  </div>
                </div>
              );
            })()}

            <form className="reg-form" onSubmit={handleRegister} autoComplete="off">

              {inputFields.map((field) => (
                <div key={field.id}>
                  <label className="f-label" htmlFor={field.id}>{field.label}</label>
                  <div className="input-box">
                    <span className="i-icon">{icons[field.icon]}</span>
                    <input
                      type={field.type}
                      id={field.id}
                      value={(formData as any)[field.id]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      autoComplete={field.auto}
                      required
                    />
                  </div>
                </div>
              ))}

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
                <span className="submit-text">
                  {loading ? "Creating Account…" : "Start Journey"}
                </span>
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
                <span className="form-divider-text">Have an account?</span>
                <div className="form-divider-line" />
              </div>

              <div className="login-row">
                <span className="login-hint">Already registered?</span>
                <Link href="/login" className="login-link">Sign In →</Link>
              </div>

            </form>
          </div>
        </main>

      </div>
    </>
  );
}