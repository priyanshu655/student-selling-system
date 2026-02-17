"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- ICONS ---
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ZapIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const SchoolIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const CATEGORIES = ["All", "Electronics", "Books", "Furniture", "Sports"];
const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"];

export default function ProductsPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  
  const [collegeOnly, setCollegeOnly] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const uRes = await fetch("/api/auth/me");
      if (uRes.ok) {
        const uData = await uRes.json();
        setUser(uData.user);
      }
      const pRes = await fetch("/api/products/all", { cache: "no-store" });
      if (!pRes.ok) throw new Error("Failed to fetch products");
      const pData = await pRes.json();
      setItems(pData);
    } catch (error) {
      console.error("❌ Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const processedItems = useMemo(() => {
    let result = [...items].filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesCollege = !collegeOnly || (user && item.sellerDomain === user.emailDomain);
      return matchesSearch && matchesCategory && matchesCollege;
    });

    if (sortBy === "Price: Low to High") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "Price: High to Low") result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [searchQuery, items, activeCategory, sortBy, collegeOnly, user]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        :root {
          --orange: #F97316;
          --black: #000000;
          --white: #FFFFFF;
          --gray-bg: #F4F4F5;
          --text-main: #000000;
          --text-muted: #18181B; /* Darker Zinc-900 for descriptions */
          --font-display: 'Syne', sans-serif;
          --font-body: 'Nunito', sans-serif;
        }

        .mp-page { min-height: 100vh; background: var(--gray-bg); font-family: var(--font-body); padding: clamp(20px, 4vw, 40px) clamp(16px, 5vw, 48px); }
        .mp-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }

        .mp-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; animation: fadeUp 0.4s ease both; }
        
        .toggle-container {
          display: flex;
          background: var(--white);
          border: 2.5px solid var(--black);
          padding: 4px;
          border-radius: 14px;
          box-shadow: 4px 4px 0 var(--black);
        }
        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          color: #52525B; /* Darker Zinc-600 */
          background: transparent;
        }
        .toggle-btn.active {
          background: var(--black);
          color: var(--white);
        }
        .toggle-btn.college.active {
          background: var(--orange);
          box-shadow: 2px 2px 0 var(--black);
          color: var(--white);
        }
        .toggle-locked {
          opacity: 0.8;
          cursor: not-allowed;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 12px;
          color: var(--black);
        }

        .mp-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .mp-brand-icon { background: var(--black); color: var(--white); width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0 var(--orange); }
        .mp-brand-name { font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--black); letter-spacing: -0.5px; }

        .mp-hero { background: var(--black); border: 2.5px solid var(--black); border-radius: 24px; padding: 40px; position: relative; overflow: hidden; color: var(--white); box-shadow: 6px 6px 0 var(--orange); animation: fadeUp 0.45s ease both; }
        .mp-hero-eyebrow { font-size: 10px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; color: var(--orange); margin-bottom: 8px; }
        .mp-hero-title { font-family: var(--font-display); font-size: clamp(32px, 5vw, 64px); font-weight: 800; line-height: 1; letter-spacing: -2px; }
        .mp-hero-title span { color: var(--orange); }

        .search-wrap { position: relative; flex: 1; }
        .search-input { 
          width: 100%; 
          padding: 14px 14px 14px 44px; 
          border: 2.5px solid var(--black); 
          border-radius: 14px; 
          background: var(--white); 
          font-weight: 800; 
          color: var(--black);
          box-shadow: 4px 4px 0 var(--black); 
          outline: none; 
          transition: 0.2s; 
        }
        .search-input::placeholder { color: #3F3F46; } /* Darker placeholder */
        .search-input:focus { box-shadow: 4px 4px 0 var(--orange); transform: translate(-1px,-1px); }
        .search-icon-pos { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--black); }

        .mp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; animation: fadeUp 0.5s 0.1s ease both; }
        .prod-card { background: var(--white); border: 2.5px solid var(--black); border-radius: 20px; overflow: hidden; box-shadow: 5px 5px 0 var(--black); transition: 0.2s; display: flex; flex-direction: column; }
        .prod-card:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 var(--black); }
        .card-img-wrap { position: relative; height: 180px; border-bottom: 2.5px solid var(--black); }
        .card-img { width: 100%; height: 100%; object-fit: cover; }
        .card-price { position: absolute; top: 10px; right: 10px; background: var(--orange); color: var(--white); border: 2px solid var(--black); border-radius: 10px; padding: 4px 10px; font-family: var(--font-display); font-weight: 800; box-shadow: 2px 2px 0 var(--black); }
        .card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .card-name { font-family: var(--font-display); font-size: 18px; font-weight: 900; color: var(--black); letter-spacing: -0.5px; }
        
        .card-inspect { 
          width: 100%; 
          padding: 12px; 
          background: var(--gray-bg); 
          border: 2.5px solid var(--black); 
          border-radius: 12px; 
          font-family: var(--font-display); 
          font-size: 11px; 
          font-weight: 900; 
          text-transform: uppercase; 
          color: var(--black); 
          text-decoration: none; 
          text-align: center; 
          box-shadow: 3px 3px 0 var(--black); 
          transition: 0.2s; 
        }
        .card-inspect:hover { background: var(--black); color: var(--white); }

        .cat-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
        .cat-tab { padding: 8px 16px; border: 2px solid var(--black); border-radius: 100px; font-weight: 900; font-size: 11px; background: var(--white); cursor: pointer; box-shadow: 2px 2px 0 var(--black); color: var(--black); }
        .cat-tab.active { background: var(--black); color: var(--white); box-shadow: 2px 2px 0 var(--orange); }

        .empty-text { color: var(--black); font-weight: 900; }
        .skel { height: 320px; border-radius: 20px; border: 2.5px solid var(--black); background: #E4E4E7; animation: shimmer 1.5s infinite linear; }
      `}</style>

      <div className="mp-page">
        <div className="mp-inner">

          {/* ── HEADER ── */}
          <header className="mp-header">
            <Link href="/dashboard" className="mp-brand">
              <div className="mp-brand-icon"><ZapIcon size={20} /></div>
              <span className="mp-brand-name">CampusMart</span>
            </Link>

            {user ? (
              <div className="toggle-container">
                <button 
                  className={`toggle-btn ${!collegeOnly ? 'active' : ''}`}
                  onClick={() => setCollegeOnly(false)}
                >
                  <GlobeIcon /> Global
                </button>
                <button 
                  className={`toggle-btn college ${collegeOnly ? 'active' : ''}`}
                  onClick={() => setCollegeOnly(true)}
                >
                  <SchoolIcon /> My College
                </button>
              </div>
            ) : (
              <div className="toggle-locked">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Login for College Filter
              </div>
            )}

            <Link href="/sell-product" className="mp-brand-name" style={{fontSize: '11px', textTransform: 'uppercase', background: 'var(--black)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: '2.5px solid black', boxShadow: '4px 4px 0 var(--orange)', textDecoration: 'none'}}>
              + Start Selling
            </Link>
          </header>

          {/* ── HERO ── */}
          <section className="mp-hero">
             <p className="mp-hero-eyebrow" style={{color: 'var(--orange)', fontWeight: 900}}>{collegeOnly ? `Exclusively @${user?.emailDomain}` : 'Student Marketplace'}</p>
             <h1 className="mp-hero-title">
               {collegeOnly ? 'Campus ' : 'The Global '}
               <span style={{color: 'var(--orange)'}}>Vault.</span>
             </h1>
          </section>

          {/* ── TOOLBAR ── */}
          <div className="toolbar-row" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div className="search-wrap">
              <span className="search-icon-pos"><SearchIcon /></span>
              <input 
                className="search-input" 
                type="text" 
                placeholder={collegeOnly ? `Searching in ${user?.emailDomain}...` : "Search all listings..."} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            
            <div className="cat-tabs">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat} 
                  className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── GRID ── */}
          <div className="mp-grid">
            {loading ? (
              Array(8).fill(0).map((_, i) => <div key={i} className="skel" />)
            ) : processedItems.length > 0 ? (
              processedItems.map((item) => (
                <div key={item._id} className="prod-card">
                  <div className="card-img-wrap">
                    <img src={item.image} alt={item.name} className="card-img" />
                    <span className="card-price">₹{item.price}</span>
                  </div>
                  <div className="card-body">
                    <div style={{fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--orange)', letterSpacing: '0.15em'}}>
                      {item.category}
                    </div>
                    <h3 className="card-name">{item.name}</h3>
                    <p style={{fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, lineHeight: '1.4'}}>
                      {item.description}
                    </p>
                    <Link href={`/item/${item._id}`} className="card-inspect">
                      Inspect Item
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px'}}>
                <h2 className="empty-text" style={{fontSize: '32px', marginBottom: '8px'}}>Empty Vault 📦</h2>
                <p style={{color: 'var(--text-muted)', fontWeight: 800}}>No results found. Try changing your filters or toggling Global mode.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}