import { useState } from "react";
import { ebooks } from "../lib/content";
import SecureFileViewer from "./SecureFileViewer";

/* ── Sidebar nav button ── */
function EbookNavButton({ item, index, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative bg-transparent border-none cursor-pointer text-left py-[0.45rem] w-full transition-colors duration-200"
    >
      {active && (
        <span
          className="absolute right-[-2rem] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-sm"
          style={{ background: "linear-gradient(180deg, #5D4480, #B8709C)" }}
        />
      )}
      <span className={`block font-mono text-[0.62rem] tracking-[0.14em] uppercase mb-[2px] transition-colors duration-200
        ${active ? "text-[#B8709C] font-bold" : "text-[#c4b5d0]"}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={`block font-mono text-[0.72rem] tracking-[0.08em] uppercase leading-snug transition-colors duration-200
        ${active ? "text-[#533178] font-bold" : "text-[#9ca3af] font-normal hover:text-[#533178]"}`}>
        {item.title}
      </span>
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-mono)", fontSize: "0.7rem",
      letterSpacing: "0.12em", textTransform: "uppercase",
      color: "#533178", fontWeight: 700, marginBottom: "0.6rem",
    }}>
      {children}
    </h3>
  );
}

/* ── Main viewer panel ── */
function EbookViewer({ item, index, onRead }) {
  if (!item) return (
    <div className="flex items-center justify-center h-[300px] text-[#9ca3af] font-mono text-[0.8rem] tracking-[0.1em] uppercase">
      Select an ebook
    </div>
  );

  const initials = item.title?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ animation: "ebookFadeIn 0.3s ease both" }}>
      <style>{`
        @keyframes ebookFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ebook-desc p, .ebook-summary p { margin: 0; }
      `}</style>

      {/* ── TOP: cover left / title+author+tagline+button+summary right ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: "2.5rem",
        alignItems: "start",
        marginBottom: "2.5rem",
      }}>
        {/* Cover */}
        <div style={{
          borderRadius: "12px", overflow: "hidden",
          border: "1px solid rgba(93,68,128,0.18)",
          boxShadow: "0 8px 32px rgba(93,68,128,0.12)",
          aspectRatio: "2/3", background: "#f4efe7",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {item.cover ? (
            <img src={item.cover} alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #5D4480 0%, #B8709C 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-heading)", fontStyle: "italic",
              fontSize: "4rem", color: "rgba(255,255,255,0.25)", fontWeight: 600,
            }}>
              {initials}
            </div>
          )}
        </div>

        {/* Title / author / tagline / button / summary */}
        <div>
          <span style={{
            display: "inline-block", fontFamily: "var(--font-mono)", fontSize: "0.65rem",
            color: "#B8709C", letterSpacing: "0.14em", textTransform: "uppercase",
            fontWeight: 600, marginBottom: "0.75rem",
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>

          <h1 className="font-heading italic font-semibold leading-tight m-0 mb-2"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#533178" }}>
            {item.title}
          </h1>

          {item.author && (
            <p className="font-mono text-[0.72rem] tracking-[0.08em] text-[#9ca3af] mb-3">
              by {item.author}
            </p>
          )}

          {item.tagline && (
            <p style={{
              fontFamily: "var(--font-heading)", fontStyle: "italic",
              fontSize: "1.1rem", color: "#8B6BAE", margin: "0 0 1.25rem",
            }}>
              {item.tagline}
            </p>
          )}

          <button
            onClick={onRead}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "var(--font-mono)", fontSize: "0.72rem",
              background: "#533178", color: "white",
              padding: "0.7rem 1.6rem", borderRadius: "999px",
              border: "none", cursor: "pointer",
              letterSpacing: "0.08em", textTransform: "uppercase",
              fontWeight: 600, transition: "background 0.2s, transform 0.2s",
              marginBottom: "1.5rem",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#8B6BAE"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#533178"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Read Book
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {item.summary && (
            <div
              className="ebook-summary"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.75, color: "#4b4b4b" }}
              dangerouslySetInnerHTML={{ __html: item.summary }}
            />
          )}
        </div>
      </div>

      {/* ── BOTTOM: full width — tags, problem, takeaways, audience, description ── */}
      <div>
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag) => (
              <span key={tag} style={{
                fontFamily: "var(--font-mono)", fontSize: "0.63rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#7c5cbf", background: "rgba(93,68,128,0.07)",
                padding: "4px 10px", borderRadius: "999px",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.problem && (
          <div style={{ marginBottom: "1.75rem" }}>
            <SectionLabel>The Problem</SectionLabel>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.75, color: "#4b4b4b", margin: 0 }}>
              {item.problem}
            </p>
          </div>
        )}

        {item.takeaways?.length > 0 && (
          <div style={{ marginBottom: "1.75rem" }}>
            <SectionLabel>What You'll Learn</SectionLabel>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {item.takeaways.map((t, i) => (
                <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "#4b4b4b", lineHeight: 1.6 }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.audience && (
          <div style={{ marginBottom: "1.75rem" }}>
            <SectionLabel>Who It's For</SectionLabel>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.75, color: "#4b4b4b", margin: 0 }}>
              {item.audience}
            </p>
          </div>
        )}

        {(item.description || item.body) && (
          <div style={{ marginBottom: "1rem" }}>
            <SectionLabel>Description</SectionLabel>
            <div
              className="font-body ebook-desc"
              style={{
                fontSize: "0.95rem", lineHeight: 1.8, color: "#533178",
                borderLeft: "3px solid #B8709C", paddingLeft: "1rem", fontStyle: "italic",
              }}
              dangerouslySetInnerHTML={{ __html: item.description || item.body }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function EbookPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerSrc, setViewerSrc] = useState(null);
  const [viewerTitle, setViewerTitle] = useState("");

  if (!Array.isArray(ebooks) || ebooks.length === 0) return null;

  const activeEbook = ebooks[activeIndex];

  function openEbook(item) {
    setViewerSrc(item.html_file);
    setViewerTitle(item.title);
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div style={{ background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)" }}>
        <div className="max-w-[1100px] mx-auto px-8 py-4 mb-6 flex items-center">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">My Library</span>
            <h1 className="font-heading italic font-semibold text-5xl text-white leading-tight m-0 py-2">Ebooks</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-8 pb-24 grid grid-cols-[200px_1fr] gap-0 items-start">
        <aside className="sticky top-20 pr-8 border-r border-[rgba(93,68,128,0.18)] self-start">
          <nav className="flex flex-col gap-[0.15rem]">
            <p className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-[#9ca3af] mb-3 m-0">
              {ebooks.length} ebook{ebooks.length !== 1 ? "s" : ""}
            </p>
            {ebooks.map((eb, i) => (
              <EbookNavButton key={i} item={eb} index={i} active={i === activeIndex} onClick={() => setActiveIndex(i)} />
            ))}
          </nav>
        </aside>

        <main className="pl-10 pt-8">
          <EbookViewer key={activeIndex} item={activeEbook} index={activeIndex} onRead={() => openEbook(activeEbook)} />
        </main>
      </div>

      {viewerSrc && (
        <SecureFileViewer src={viewerSrc} title={viewerTitle} onClose={() => setViewerSrc(null)} />
      )}
    </div>
  );
}