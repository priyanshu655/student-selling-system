"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SellerInventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const fetchSellerData = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();

      if (!authRes.ok || !authData.user) { router.push("/login"); return; }
      if (!authData.user.isSeller) { router.push("/become-seller"); return; }

      setUser(authData.user);

      const invRes = await fetch("/api/products/seller");
      const invData = await invRes.json();
      setInventory(invData);
    } catch (err) {
      console.error("Seller Page Error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchSellerData(); }, [fetchSellerData]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Remove this listing from the vault?")) return;
    try {
      const res = await fetch("/api/products/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok) {
        setInventory((prev) => prev.filter((item: any) => item._id !== productId));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete call failed:", err);
      alert("Connection error");
    }
  };

  const totalValue = inventory.reduce((sum: number, item: any) => sum + Number(item.price || 0), 0);

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        body { font-family: 'Nunito', sans-serif; background: #F4F4F5; }
        .loader-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .loader { width: 44px; height: 44px; border: 4px solid #F97316; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
      `}</style>
      <div className="loader-page"><div className="loader" /></div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
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
          --font-display: 'Syne', sans-serif;
          --font-body: 'Nunito', sans-serif;
        }

        body { font-family: var(--font-body); background: var(--gray-bg); }

        .inv-page {
          min-height: 100vh;
          background: var(--gray-bg);
          padding: clamp(24px, 5vw, 48px) clamp(16px, 5vw, 48px);
          font-family: var(--font-body);
        }

        .inv-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ─── TOP BAR ─── */
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          animation: fadeUp 0.4s ease both;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .brand-icon {
          background: var(--black);
          color: var(--white);
          width: 42px; height: 42px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 3px 3px 0 var(--orange);
          flex-shrink: 0;
        }
        .brand-name {
          font-family: var(--font-display);
          font-size: clamp(17px, 3.5vw, 22px);
          font-weight: 800;
          color: var(--black);
          letter-spacing: -0.5px;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          background: var(--white);
          color: var(--black);
          border: 2px solid var(--black);
          border-radius: 10px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 3px 3px 0 var(--black);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .back-btn:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--black); }
        .back-btn:active { transform: translate(0,0); box-shadow: 2px 2px 0 var(--black); }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 8px 8px 18px;
          background: var(--black);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 10px;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 4px 4px 0 var(--orange);
          transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
        }
        .add-btn:hover {
          background: var(--orange);
          border-color: var(--orange);
          box-shadow: 4px 4px 0 var(--black);
          transform: translate(-2px,-2px);
        }
        .add-btn:active { transform: translate(0,0); box-shadow: 2px 2px 0 var(--orange); }

        .add-btn-dot {
          width: 32px; height: 32px;
          background: var(--white);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .add-btn:hover .add-btn-dot { transform: rotate(45deg); }

        /* ─── HERO BANNER ─── */
        .hero-banner {
          background: var(--black);
          border: 2.5px solid var(--black);
          border-radius: 24px;
          padding: clamp(28px, 5vw, 44px) clamp(24px, 5vw, 44px);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          box-shadow: 5px 5px 0 var(--orange);
          animation: fadeUp 0.45s ease both;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          width: 260px; height: 260px;
          background: var(--orange);
          border-radius: 50%;
          top: -90px; right: -60px;
          opacity: 0.12;
        }
        .hero-banner::after {
          content: '';
          position: absolute;
          width: 120px; height: 120px;
          background: var(--orange);
          border-radius: 50%;
          bottom: -40px; left: 200px;
          opacity: 0.07;
        }

        .hero-text { position: relative; z-index: 1; }
        .hero-eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 10px;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(34px, 6vw, 60px);
          font-weight: 800;
          color: var(--white);
          line-height: 1;
          letter-spacing: -2px;
        }
        .hero-title span { color: var(--orange); }
        .hero-sub {
          margin-top: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #555;
        }

        .hero-stats {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .h-stat {
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 16px;
          padding: 14px 20px;
          min-width: 90px;
        }
        .h-stat-num {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 800;
          color: var(--white);
          line-height: 1;
          display: block;
        }
        .h-stat-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #555;
          display: block;
          margin-top: 4px;
        }

        /* ─── TABLE CARD ─── */
        .table-card {
          background: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 5px 5px 0 var(--black);
          animation: fadeUp 0.5s 0.1s ease both;
        }

        /* Table header strip */
        .table-header-strip {
          background: var(--black);
          padding: 18px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .ths-left { display: flex; flex-direction: column; gap: 2px; }
        .ths-eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--orange);
        }
        .ths-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -0.5px;
        }
        .item-count-badge {
          background: var(--orange);
          color: var(--white);
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* Col headers */
        .col-headers {
          display: grid;
          grid-template-columns: 2.5fr 1fr 1fr 80px;
          gap: 8px;
          padding: 11px 28px;
          background: #FAFAFA;
          border-bottom: 2px solid var(--gray-border);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .col-r { text-align: right; }

        @media (max-width: 640px) {
          .col-headers { grid-template-columns: 1fr 80px 60px; }
          .col-cat { display: none; }
        }

        /* Rows */
        .inv-rows { max-height: 520px; overflow-y: auto; }
        .inv-rows::-webkit-scrollbar { width: 4px; }
        .inv-rows::-webkit-scrollbar-thumb { background: var(--gray-border); border-radius: 4px; }

        .inv-row {
          display: grid;
          grid-template-columns: 2.5fr 1fr 1fr 80px;
          gap: 8px;
          align-items: center;
          padding: 14px 28px;
          border-bottom: 1.5px solid var(--gray-border);
          transition: background 0.15s;
        }
        .inv-row:last-child { border-bottom: none; }
        .inv-row:hover { background: var(--orange-light); }

        @media (max-width: 640px) {
          .inv-row { grid-template-columns: 1fr 80px 60px; }
          .inv-row .row-cat { display: none; }
        }

        .row-product { display: flex; align-items: center; gap: 12px; }

        .row-img {
          width: 48px; height: 48px;
          border-radius: 12px;
          border: 2px solid var(--gray-border);
          object-fit: cover;
          flex-shrink: 0;
          background: var(--gray-bg);
        }
        .row-img-placeholder {
          width: 48px; height: 48px;
          border-radius: 12px;
          border: 2px solid var(--gray-border);
          background: var(--gray-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          flex-shrink: 0;
        }

        .row-name {
          font-size: 14px;
          font-weight: 800;
          color: var(--black);
          line-height: 1.2;
        }
        .row-id {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--muted);
          text-transform: uppercase;
          margin-top: 2px;
        }

        .row-cat {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .row-cat-pill {
          display: inline-flex;
          padding: 4px 10px;
          background: var(--gray-bg);
          border: 1.5px solid var(--gray-border);
          border-radius: 100px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--label);
        }

        .row-price {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 800;
          color: var(--orange);
          letter-spacing: -0.3px;
        }

        .row-actions { display: flex; justify-content: flex-end; }

        .del-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: #FEF2F2;
          border: 2px solid #FECACA;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #EF4444;
          transition: background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 2px 2px 0 #FECACA;
        }
        .del-btn:hover {
          background: #EF4444;
          border-color: var(--black);
          color: var(--white);
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 var(--black);
        }
        .del-btn:active { transform: translate(0,0); box-shadow: 1px 1px 0 var(--black); }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          gap: 12px;
          text-align: center;
        }
        .empty-emoji { font-size: 52px; margin-bottom: 8px; }
        .empty-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          color: var(--black);
          letter-spacing: -0.5px;
        }
        .empty-sub {
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          max-width: 280px;
          line-height: 1.6;
        }
        .empty-cta {
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--orange);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 12px;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 3px 3px 0 var(--black);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .empty-cta:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--black); }
      `}</style>

      <div className="inv-page">
        <div className="inv-inner">

          {/* ── TOP BAR ── */}
          <div className="top-bar">
            <Link href="/" className="brand">
              <div className="brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <span className="brand-name">CampusMart</span>
            </Link>

            <div className="top-actions">
              <Link href="/dashboard" className="back-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
                </svg>
                Dashboard
              </Link>

              <Link href="/sell-product" className="add-btn">
                + New Listing
                <span className="add-btn-dot">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* ── HERO BANNER ── */}
          <div className="hero-banner">
            <div className="hero-text">
              <p className="hero-eyebrow">Seller Portal</p>
              <h1 className="hero-title">Your <span>Inventory.</span></h1>
              <p className="hero-sub">Manage, track and remove your active listings</p>
            </div>
            <div className="hero-stats">
              <div className="h-stat">
                <span className="h-stat-num">{inventory.length}</span>
                <span className="h-stat-label">Listed</span>
              </div>
              <div className="h-stat">
                <span className="h-stat-num">₹{totalValue.toLocaleString("en-IN")}</span>
                <span className="h-stat-label">Est. Value</span>
              </div>
            </div>
          </div>

          {/* ── TABLE CARD ── */}
          <div className="table-card">

            {/* Strip header */}
            <div className="table-header-strip">
              <div className="ths-left">
                <span className="ths-eyebrow">Stock</span>
                <span className="ths-title">Listings</span>
              </div>
              <span className="item-count-badge">{inventory.length} item{inventory.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Col labels */}
            {inventory.length > 0 && (
              <div className="col-headers">
                <div>Product</div>
                <div className="col-cat">Category</div>
                <div>Price</div>
                <div className="col-r">Remove</div>
              </div>
            )}

            {/* Rows */}
            <div className="inv-rows">
              {inventory.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-emoji">📦</div>
                  <p className="empty-title">The vault is empty</p>
                  <p className="empty-sub">You haven't listed anything yet. Add your first product to start selling.</p>
                  <Link href="/sell-product" className="empty-cta">+ List First Product</Link>
                </div>
              ) : (
                inventory.map((item: any) => (
                  <div key={item._id} className="inv-row">

                    {/* Product */}
                    <div className="row-product">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="row-img" />
                      ) : (
                        <div className="row-img-placeholder">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="row-name">{item.name}</p>
                        <p className="row-id">#{item._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="row-cat">
                      <span className="row-cat-pill">{item.category}</span>
                    </div>

                    {/* Price */}
                    <div className="row-price">₹{Number(item.price).toLocaleString("en-IN")}</div>

                    {/* Delete */}
                    <div className="row-actions">
                      <button className="del-btn" onClick={() => handleDelete(item._id)} title="Remove listing">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}