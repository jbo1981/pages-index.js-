import { useState, useRef } from "react";

const PLATFORMS = ["Amazon", "eBay", "Craigslist", "Facebook Marketplace", "OfferUp", "Mercari", "Poshmark"];

const TagBadge = ({ label, color }) => (
  <span style={{
    background: color, color: "#fff", fontSize: "11px", fontWeight: 700,
    padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.04em", textTransform: "uppercase",
  }}>{label}</span>
);

const DealCard = ({ deal, index }) => {
  const badgeColor = deal.badge === "Best Deal" ? "#16a34a" : deal.badge === "Lowest Price" ? "#2563eb" : deal.badge === "Used" ? "#d97706" : "#7c3aed";
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px",
      padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{deal.platform}</span>
            {deal.badge && <TagBadge label={deal.badge} color={badgeColor} />}
          </div>
          <div style={{ fontWeight: 700, fontSize: "16px", color: "#111827", lineHeight: 1.3 }}>{deal.title}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#111827" }}>{deal.price}</div>
          {deal.originalPrice && <div style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through" }}>{deal.originalPrice}</div>}
        </div>
      </div>
      {deal.condition && <div style={{ fontSize: "13px", color: "#6b7280" }}><span style={{ fontWeight: 600, color: "#374151" }}>Condition:</span> {deal.condition}</div>}
      {deal.description && <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>{deal.description}</div>}
      {deal.shipping && <div style={{ fontSize: "12px", color: deal.shipping.toLowerCase().includes("free") ? "#16a34a" : "#6b7280", fontWeight: deal.shipping.toLowerCase().includes("free") ? 600 : 400 }}>🚚 {deal.shipping}</div>}
      {deal.location && <div style={{ fontSize: "12px", color: "#6b7280" }}>📍 {deal.location}</div>}
    </div>
  );
};

export default function DealFinder() {
  const [query, setQuery] = useState("");
  const [deals, setDeals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  const searchDeals = async () => {
    if (!query.trim()) return;
    setLoading(true); setDeals(null); setError(null); setSummary(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setDeals(data.deals || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; } input:focus { outline: none; }`}</style>
      <div style={{ background: "#111827", padding: "28px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Marketplace Deal Finder</div>
        <h1 style={{ margin: 0, fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Find the best price.<br /><span style={{ color: "#facc15" }}>Anywhere it's sold.</span>
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "10px", marginBottom: "24px" }}>Searches Amazon, eBay, Craigslist, Facebook Marketplace, OfferUp & more</p>
        <div style={{ display: "flex", maxWidth: "560px", margin: "0 auto", background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchDeals()}
            placeholder='Try "iPhone 15", "road bike", "PS5"…'
            style={{ flex: 1, border: "none", padding: "16px 18px", fontSize: "15px", color: "#111827", background: "transparent" }}
          />
          <button onClick={searchDeals} disabled={loading || !query.trim()}
            style={{ background: "#facc15", color: "#111827", border: "none", padding: "16px 22px", fontWeight: 800, fontSize: "14px", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Searching…" : "Find Deals"}
          </button>
        </div>
      </div>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px 48px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #e5e7eb", borderTop: "3px solid #111827", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>Scouring marketplaces…</div>
          </div>
        )}
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "16px", color: "#b91c1c", fontSize: "14px" }}>{error}</div>}
        {summary && !loading && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", fontSize: "14px", color: "#78350f", lineHeight: 1.6 }}>
            💡 <strong>Market snapshot:</strong> {summary}
          </div>
        )}
        {deals && !loading && (
          <>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px", fontWeight: 600 }}>{deals.length} deals found for <span style={{ color: "#111827" }}>"{query}"</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {deals.map((deal, i) => <DealCard key={i} deal={deal} index={i} />)}
            </div>
          </>
        )}
        {!loading && !deals && !error && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#6b7280" }}>Search anything above to find deals</div>
            <div style={{ fontSize: "13px", marginTop: "6px" }}>Electronics, furniture, clothes, cars, tools — anything</div>
          </div>
        )}
      </div>
    </div>
  );
}
