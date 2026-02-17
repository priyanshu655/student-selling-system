import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
// ✅ Import the Client Button we created
import ContactButton from "@/components/ContactButton";

export default async function ItemDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  const item = await Product.findById(id);

  if (!item) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
            --orange: #F97316;
            --black: #111111;
            --white: #FFFFFF;
            --gray-bg: #F4F4F5;
            --font-display: 'Syne', sans-serif;
            --font-body: 'Nunito', sans-serif;
          }
          .not-found {
            min-height: 100vh;
            background: var(--gray-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 16px;
            font-family: var(--font-body);
          }
          .nf-box {
            background: var(--white);
            border: 2.5px solid var(--black);
            border-radius: 20px;
            padding: 48px 56px;
            text-align: center;
            box-shadow: 5px 5px 0 var(--black);
          }
          .nf-emoji { font-size: 56px; margin-bottom: 16px; display: block; }
          .nf-title {
            font-family: var(--font-display);
            font-size: 28px;
            font-weight: 800;
            color: var(--black);
            letter-spacing: -0.5px;
            margin-bottom: 8px;
          }
          .nf-sub {
            font-size: 14px;
            font-weight: 700;
            color: #78716C;
          }
          .nf-btn {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 28px;
            background: var(--black);
            color: var(--white);
            border: 2.5px solid var(--black);
            border-radius: 10px;
            font-family: var(--font-display);
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            text-decoration: none;
            box-shadow: 3px 3px 0 var(--orange);
          }
        `}</style>
        <div className="not-found">
          <div className="nf-box">
            <span className="nf-emoji">📦</span>
            <p className="nf-title">Item Not Found</p>
            <p className="nf-sub">This listing may have been removed or never existed.</p>
            <a href="/products" className="nf-btn">← Back to Marketplace</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
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

        .detail-page {
          min-height: 100vh;
          background: var(--gray-bg);
          font-family: var(--font-body);
          padding: clamp(24px, 5vw, 48px) clamp(16px, 5vw, 48px);
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-icon {
          background: var(--black);
          color: var(--white);
          width: 42px;
          height: 42px;
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
        .back-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: var(--white);
          color: var(--black);
          border: 2px solid var(--black);
          border-radius: 10px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 3px 3px 0 var(--black);
          transition: transform 0.15s, box-shadow 0.15s;
          letter-spacing: 0.03em;
        }
        .back-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 var(--black);
        }

        .detail-layout {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: clamp(20px, 3vw, 36px);
          align-items: start;
          animation: fadeUp 0.45s ease both;
        }

        @media (max-width: 820px) {
          .detail-layout { grid-template-columns: 1fr; }
        }

        .image-card {
          background: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 5px 5px 0 var(--black);
          position: relative;
        }

        .item-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
        }

        .image-category-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--orange);
          color: var(--white);
          border: 2px solid var(--black);
          border-radius: 100px;
          padding: 5px 14px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          box-shadow: 2px 2px 0 var(--black);
        }

        .info-card {
          background: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 22px;
          box-shadow: 5px 5px 0 var(--black);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .info-strip {
          background: var(--black);
          padding: 20px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .info-strip-label {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--orange);
        }
        .listing-id {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 700;
          color: #555;
          letter-spacing: 0.1em;
        }

        .info-body {
          padding: clamp(20px, 4vw, 32px);
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .item-name {
          font-family: var(--font-display);
          font-size: clamp(26px, 5vw, 42px);
          font-weight: 800;
          color: var(--black);
          line-height: 1.05;
          letter-spacing: -1px;
        }

        .price-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .price-tag {
          background: var(--orange);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          padding: 12px 22px;
          display: flex;
          align-items: baseline;
          gap: 4px;
          box-shadow: 3px 3px 0 var(--black);
        }
        .price-symbol {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: rgba(255,255,255,0.8);
        }
        .price-value {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 800;
          color: var(--white);
          letter-spacing: -1px;
          line-height: 1;
        }

        .divider {
          height: 2px;
          background: var(--gray-border);
          border-radius: 2px;
        }

        .desc-label {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .desc-text {
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          color: var(--label);
          line-height: 1.75;
        }

        .meta-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .meta-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: var(--gray-bg);
          border: 2px solid var(--gray-border);
          border-radius: 100px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 700;
          color: var(--label);
        }
        .meta-pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--orange);
          flex-shrink: 0;
        }

        .cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 28px;
          background: var(--orange);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          font-family: var(--font-display);
          font-size: clamp(13px, 2.5vw, 15px);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--black);
          transition: transform 0.15s, box-shadow 0.15s;
          width: 100%;
          text-decoration: none;
        }
        .cta-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--black);
        }

        .cta-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          background: var(--white);
          color: var(--black);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--black);
          transition: transform 0.15s, box-shadow 0.15s;
          width: 100%;
          text-decoration: none;
        }
        .cta-secondary:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--black);
        }

        .btn-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      `}</style>

      <div className="detail-page">
        <header className="page-header">
          <div className="brand">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="brand-name">CampusMart</span>
          </div>
          <a href="/products" className="back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
            </svg>
            Back to Listings
          </a>
        </header>

        <div className="detail-layout">
          <div className="image-card">
            <img src={item.image} alt={item.name} className="item-image" />
            <span className="image-category-badge">{item.category}</span>
          </div>

          <div className="info-card">
            <div className="info-strip">
              <span className="info-strip-label">Product Detail</span>
              <span className="listing-id">ID: {item._id.toString().slice(-8).toUpperCase()}</span>
            </div>

            <div className="info-body">
              <h1 className="item-name">{item.name}</h1>

              <div className="price-block">
                <div className="price-tag">
                  <span className="price-symbol">₹</span>
                  <span className="price-value">{item.price.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="divider" />

              <div>
                <p className="desc-label">About this item</p>
                <p className="desc-text">{item.description || "No description provided by the seller."}</p>
              </div>

              <div className="meta-row">
                <div className="meta-pill">
                  <span className="meta-pill-dot" />
                  {item.category}
                </div>
                <div className="meta-pill">
                  <span className="meta-pill-dot" style={{ background: "#22c55e" }} />
                  Available
                </div>
              </div>

              <div className="divider" />

              <div className="btn-row">
                {/* ✅ Replace <a> tag with Logic-enabled Component */}
                <ContactButton 
                  productId={item._id.toString()} 
                  sellerId={item.sellerId.toString()} 
                />
                
                <a href="/products" className="cta-secondary">
                  ← Browse More Listings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}