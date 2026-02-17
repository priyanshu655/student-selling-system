"use client";

import React, { useState, useEffect } from "react";

// Lucide icons inlined to avoid import issues in preview
const ArrowLeft = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
  </svg>
);
const Zap = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const Tag = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const IndianRupee = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M15 21L6 8M6 13h3a4 4 0 000-8"/>
  </svg>
);
const AlignLeft = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="13" y1="18" x2="3" y2="18"/>
  </svg>
);
const UploadCloud = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
);
const X = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// Mock router to avoid "Could not resolve next/navigation" in certain environments
const useRouter = () => ({
  push: (path) => {
    console.log("Navigating to:", path);
    if (typeof window !== "undefined") {
      // Small delay to let user see success state
      setTimeout(() => { window.location.href = path; }, 500);
    }
  },
  back: () => { if (typeof window !== "undefined") window.history.back(); },
});

export default function App() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser || savedUser === "undefined") {
      // In production, you would redirect to login. 
      // Setting mock user for preview/Canvas environment consistency.
      setUser({ _id: "preview_user_123", name: "Alex" });
      return;
    }
    setUser(JSON.parse(savedUser));
  }, []);

  // ✅ Fixed Image Upload: Logic restored to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImage(data.secure_url);
      } else {
        console.error("Image Upload Failed:", data.error?.message);
        alert("Upload failed. Check Cloudinary credentials.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Fixed Submit: Logic restored to actual API call
  const handleSell = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      alert("Please fill all fields and upload an image! ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          category,
          description,
          image,
          sellerId: user._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product Listed Successfully ✅");
        router.push("/products");
      } else {
        alert(data.message || "Error listing product ❌");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("System error. Check connection ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F4F5" }}>
      <div style={{ width: 36, height: 36, border: "4px solid #F97316", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        :root {
          --orange: #F97316;
          --orange-dark: #EA6A0A;
          --orange-light: #FFF7ED;
          --black: #111111;
          --white: #FFFFFF;
          --gray-bg: #F4F4F5;
          --gray-border: #E4E4E7;
          --gray-light: #F9FAFB;
          --label-color: #44403C;
          --input-text: #111111;
          --placeholder: #A8A29E;
          --icon-color: #78716C;
          --hint-text: #57534E;
          --font-display: 'Syne', sans-serif;
          --font-body: 'Nunito', sans-serif;
        }

        body { font-family: var(--font-body); background: var(--gray-bg); }

        .page {
          min-height: 100vh;
          background: var(--gray-bg);
          display: flex;
          justify-content: center;
          padding: 32px 16px 48px;
        }

        .wrapper {
          width: 100%;
          max-width: 1100px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeUp 0.5s ease both;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          background: var(--black);
          color: var(--white);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          flex-shrink: 0;
        }

        .brand-name {
          font-family: var(--font-display);
          font-size: clamp(18px, 4vw, 24px);
          font-weight: 800;
          color: var(--black);
          letter-spacing: -0.5px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 800;
          color: var(--hint-text);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          padding: 8px 0;
        }
        .back-btn:hover { color: var(--black); }

        .card {
          background: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 28px;
          box-shadow: 6px 6px 0px var(--black);
          overflow: hidden;
        }

        .banner {
          background: var(--orange);
          padding: clamp(32px, 6vw, 56px) clamp(24px, 6vw, 48px);
          position: relative;
          overflow: hidden;
        }

        .banner::before, .banner::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.1);
        }
        .banner::before { width: 200px; height: 200px; top: -60px; right: -40px; }
        .banner::after  { width: 120px; height: 120px; bottom: -40px; right: 80px; }

        .banner-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 7vw, 68px);
          font-weight: 800;
          color: var(--white);
          line-height: 1.05;
          letter-spacing: -1px;
          position: relative;
          z-index: 1;
        }

        .banner-title span {
          color: var(--black);
        }

        .banner-sub {
          margin-top: 10px;
          font-family: var(--font-body);
          font-size: clamp(10px, 2vw, 12px);
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.55);
          position: relative;
          z-index: 1;
        }

        .form-body {
          padding: clamp(24px, 5vw, 40px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(24px, 4vw, 40px);
        }

        @media (max-width: 768px) {
          .form-body { grid-template-columns: 1fr; }
          .submit-row { grid-column: 1 / -1; }
        }

        .left-col, .right-col {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .f-label {
          display: block;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--label-color);
          margin-bottom: 7px;
        }

        .input-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          border: 2px solid var(--black);
          border-radius: 14px;
          background: var(--gray-light);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-box:focus-within {
          border-color: var(--orange);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.15);
          background: var(--white);
        }

        .input-box .icon { color: var(--icon-color); flex-shrink: 0; }

        .input-box input,
        .input-box select {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 700;
          color: var(--input-text);
          min-width: 0;
        }

        .input-box input::placeholder { color: var(--placeholder); font-weight: 600; }

        .input-box select {
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
        }

        .textarea-box {
          display: flex;
          gap: 10px;
          padding: 13px 16px;
          border: 2px solid var(--black);
          border-radius: 14px;
          background: var(--gray-light);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .textarea-box:focus-within {
          border-color: var(--orange);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.15);
          background: var(--white);
        }

        .textarea-box .icon { color: var(--icon-color); flex-shrink: 0; margin-top: 2px; }

        .textarea-box textarea {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 700;
          color: var(--input-text);
          resize: none;
          height: 120px;
          line-height: 1.6;
        }
        .textarea-box textarea::placeholder { color: var(--placeholder); font-weight: 600; }

        .two-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 480px) {
          .two-mini { grid-template-columns: 1fr; }
        }

        .upload-label {
          height: clamp(230px, 35vw, 320px);
          border: 2.5px dashed var(--black);
          border-radius: 18px;
          background: var(--gray-light);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-align: center;
          padding: 24px;
          gap: 10px;
        }
        .upload-label:hover {
          background: var(--orange-light);
          border-color: var(--orange);
        }

        .upload-icon-wrap {
          color: var(--icon-color);
          transition: color 0.2s;
        }
        .upload-label:hover .upload-icon-wrap { color: var(--orange); }

        .upload-title {
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 800;
          color: var(--black);
        }

        .upload-hint {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          color: var(--hint-text);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--orange);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .img-preview-wrap {
          position: relative;
          width: 100%;
          height: clamp(230px, 35vw, 320px);
          border-radius: 18px;
          overflow: hidden;
          border: 2.5px solid var(--black);
        }
        .img-preview-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .img-remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: var(--white);
          border: 2px solid var(--black);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          color: var(--black);
        }
        .img-remove-btn:hover { background: #FEE2E2; }

        .submit-row {
          grid-column: 1 / -1;
          padding-top: 24px;
          border-top: 2px solid var(--gray-border);
          display: flex;
          justify-content: center;
        }

        .submit-btn {
          width: 100%;
          max-width: 440px;
          padding: 16px 32px;
          background: var(--black);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          font-family: var(--font-display);
          font-size: clamp(14px, 2.5vw, 16px);
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.22s, color 0.22s, transform 0.15s, box-shadow 0.22s;
          box-shadow: 4px 4px 0 var(--orange);
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--orange);
          border-color: var(--orange);
          color: var(--white);
          box-shadow: 4px 4px 0 var(--black);
          transform: translateY(-2px);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>

      <div className="page">
        <div className="wrapper">

          {/* ── HEADER ── */}
          <header className="header">
            <div className="brand">
              <div className="brand-icon"><Zap size={22} /></div>
              <span className="brand-name">CampusMart</span>
            </div>
            <button className="back-btn" onClick={() => router.back()}>
              <ArrowLeft size={16} /> Back
            </button>
          </header>

          {/* ── CARD ── */}
          <div className="card">

            {/* Banner */}
            <div className="banner">
              <h2 className="banner-title">
                Sell your <span>Gear</span>
              </h2>
              <p className="banner-sub">Merchant Listing Portal</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSell} className="form-body">

              {/* ── LEFT COL ── */}
              <div className="left-col">

                {/* Product Name */}
                <div>
                  <label className="f-label">Product Name</label>
                  <div className="input-box">
                    <span className="icon"><Tag size={18} /></span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Engineering Kit"
                    />
                  </div>
                </div>

                {/* Price + Category */}
                <div className="two-mini">
                  <div>
                    <label className="f-label">Price</label>
                    <div className="input-box">
                      <span className="icon"><IndianRupee size={18} /></span>
                      <input
                        required
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="f-label">Category</label>
                    <div className="input-box">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Furniture</option>
                        <option>Sports</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="f-label">Description</label>
                  <div className="textarea-box">
                    <span className="icon"><AlignLeft size={18} /></span>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Condition, age, usage..."
                    />
                  </div>
                </div>
              </div>

              {/* ── RIGHT COL ── */}
              <div className="right-col">
                <label className="f-label">Upload Image</label>

                {!image ? (
                  <label className="upload-label">
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {uploading ? (
                      <div className="spinner" />
                    ) : (
                      <>
                        <span className="upload-icon-wrap">
                          <UploadCloud size={44} />
                        </span>
                        <p className="upload-title">Click to Upload</p>
                        <p className="upload-hint">PNG · JPG · High Quality</p>
                      </>
                    )}
                  </label>
                ) : (
                  <div className="img-preview-wrap">
                    <img src={image} alt="Preview" />
                    <button
                      type="button"
                      className="img-remove-btn"
                      onClick={() => setImage("")}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* ── SUBMIT ── */}
              <div className="submit-row">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || uploading}
                >
                  {loading ? "Publishing..." : uploading ? "Uploading..." : "Launch Listing"}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  );
}