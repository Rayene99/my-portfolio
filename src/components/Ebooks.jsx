import { useEffect, useRef, useState } from "react";
import { ebooks } from "../lib/content";
import SecureFileViewer from "./SecureFileViewer";

const PREVIEW_COUNT = 4;

function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  return [ref, inView];
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

function FeaturedEbook({ item, index, onRead }) {
  const initials = item.title?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      borderRadius: "var(--radius-card)",
      overflow: "hidden",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-lg)",
      animation: "featuredIn 0.35s ease both",
    }}>
      <style>{`
        @keyframes featuredIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ebook-description p { margin: 0; }
      `}</style>

      {/* Cover */}
      <div style={{ position: "relative", width: "100%", height: "200px", flexShrink: 0, overflow: "hidden" }}>
        {item.cover ? (
          <img src={item.cover} alt={item.title} style={{
            width: "100%", height: "100%", objectFit: "cover",
            objectPosition: "top center", display: "block",
          }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #5D4480 0%, #B8709C 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-heading)", fontStyle: "italic",
            fontSize: "3.5rem", color: "rgba(255,255,255,0.25)", fontWeight: 600,
          }}>
            {initials}
          </div>
        )}

        {/* Index badge */}
        <div style={{
          position: "absolute", top: "1rem", left: "1rem",
          fontFamily: "var(--font-mono)", fontSize: "0.65rem",
          background: "rgba(255,255,255,0.92)", color: "var(--color-primary-dark)",
          padding: "4px 10px", borderRadius: "999px", letterSpacing: "0.12em", fontWeight: 600,
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "1.2rem 1.2rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "1.25rem",
          fontWeight: 600, color: "#533178", lineHeight: 1.2, margin: 0,
        }}>
          {item.title}
        </h3>

        <div
          className="ebook-description"
          style={{
            fontFamily: "var(--font-body)", fontSize: "0.78rem",
            lineHeight: 1.65, color: "var(--color-text-muted)",
            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: item.description || item.body }}
        />

        <div style={{
          marginTop: "auto", paddingTop: "0.85rem",
          borderTop: "1px solid var(--color-border)",
          display: "flex", gap: "0.65rem", flexWrap: "wrap",
        }}>
          {/* Read Ebook — opens protected in-page viewer */}
          <button
            onClick={onRead}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "var(--font-mono)", fontSize: "0.68rem",
              background: "#533178", color: "white",
              padding: "0.55rem 1.2rem", borderRadius: "999px",
              border: "none", cursor: "pointer",
              letterSpacing: "0.08em", textTransform: "uppercase",
              fontWeight: 600, transition: "background 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#8B6BAE"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#533178"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Read
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Browse All */}
           <a
            href="/EbooksPage"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "var(--font-mono)", fontSize: "0.68rem",
              border: "1.5px solid #8B6BAE", color: "#533178",
              padding: "0.55rem 1.2rem", borderRadius: "999px",
              textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
              fontWeight: 600, transition: "background 0.2s, color 0.2s, transform 0.2s",
              background: "transparent",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#533178"; e.currentTarget.style.color = "white"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#533178"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Browse All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function ThumbCard({ item, index, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const initials = item.title?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const previewText = stripHtml(item.description || item.body);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", gap: "0.85rem", alignItems: "center",
        padding: "0.65rem 0.75rem",
        borderRadius: "10px",
        cursor: "pointer",
        background: active
          ? "linear-gradient(135deg, rgba(93,68,128,0.08) 0%, rgba(184,112,156,0.08) 100%)"
          : hovered ? "rgba(0,0,0,0.03)" : "transparent",
        border: active ? "1px solid rgba(93,68,128,0.18)" : "1px solid transparent",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: "80px", height: "60px", borderRadius: "6px",
        overflow: "hidden", flexShrink: 0,
        border: active ? "2px solid #8B6BAE" : "1px solid var(--color-border)",
        transition: "border 0.2s",
      }}>
        {item.cover ? (
          <img src={item.cover} alt={item.title} style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
          }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #5D4480 0%, #B8709C 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-heading)", fontStyle: "italic",
            fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", fontWeight: 600,
          }}>{initials}</div>
        )}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.58rem",
          color: active ? "var(--color-primary)" : "var(--color-text-light)",
          letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
          display: "block", marginBottom: "3px",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <p style={{
          fontFamily: "var(--font-heading)", fontStyle: "italic",
          fontSize: "0.88rem", fontWeight: 600,
          color: active ? "#533178" : "var(--color-text)",
          lineHeight: 1.3, margin: 0,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {item.title}
        </p>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.72rem",
          color: "var(--color-text-muted)", margin: "3px 0 0",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {previewText.slice(0, 55)}
          {previewText.length > 55 ? "…" : ""}
        </p>
      </div>

      {/* Active bar */}
      {active && (
        <div style={{
          width: "3px", height: "32px", borderRadius: "2px",
          background: "linear-gradient(180deg, #5D4480, #B8709C)",
          flexShrink: 0,
        }} />
      )}
    </div>
  );
}

export default function Ebooks() {
  const [sectionRef, inView] = useInView({ threshold: 0.05 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerSrc, setViewerSrc] = useState(null);
  const [viewerTitle, setViewerTitle] = useState("");

  if (!Array.isArray(ebooks) || ebooks.length === 0) return null;

  const previewEbooks = ebooks.slice(0, PREVIEW_COUNT);
  const hasMore = ebooks.length > PREVIEW_COUNT;
  const featured = previewEbooks[activeIndex];

  function openEbook(item) {
    const href = `/ebooks/${item.html_file?.split("/").pop()}`;
    setViewerSrc(href);
    setViewerTitle(item.title);
  }

  return (
    <section
      id="ebooks"
      ref={sectionRef}
      className="max-w-[1100px] mx-auto px-8 py-14 mb-16"
    >
      {/* Header */}
      <div
        className="mb-14"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <span className="font-mono text-sm uppercase tracking-[0.18em] text-primary block mb-3">
            My Library
          </span>
          <h2
            className="text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-heading)", fontStyle: "italic",
              fontWeight: 600, color: "#533178", margin: 0,
            }}
          >
            Ebooks
          </h2>
        </div>

        {hasMore && (
           <a
            href="/EbooksPage"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "var(--font-mono)", fontSize: "0.72rem",
              border: "1.5px solid #8B6BAE", color: "#533178",
              padding: "0.55rem 1.25rem", borderRadius: "999px",
              textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
              fontWeight: 600, transition: "background 0.2s, color 0.2s, transform 0.2s",
              background: "transparent",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#533178";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#533178";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View All {ebooks.length}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        )}
      </div>

      {/* Featured + list */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "1.75rem",
          alignItems: "start",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
        }}
      >
        {/* LEFT: featured — sticky */}
        <div style={{ position: "sticky", top: "2rem" }}>
          <FeaturedEbook
            key={activeIndex}
            item={featured}
            index={activeIndex}
            onRead={() => openEbook(featured)}
          />
        </div>

        {/* RIGHT: scrollable thumb list */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
          maxHeight: "580px",
          overflowY: "auto",
          paddingRight: "0.25rem",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(93,68,128,0.2) transparent",
        }}>
          {previewEbooks.map((eb, i) => (
            <ThumbCard
              key={i}
              item={eb}
              index={i}
              active={i === activeIndex}
              onClick={() => setActiveIndex(i)}
            />
          ))}

          {hasMore && (
            <a
              href="/EbooksPage"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                marginTop: "0.5rem", padding: "0.7rem",
                borderRadius: "10px",
                border: "1px dashed rgba(93,68,128,0.25)",
                fontFamily: "var(--font-mono)", fontSize: "0.65rem",
                color: "#8B6BAE", textDecoration: "none",
                letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(93,68,128,0.05)";
                e.currentTarget.style.borderColor = "rgba(93,68,128,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(93,68,128,0.25)";
              }}
            >
              +{ebooks.length - PREVIEW_COUNT} more ebooks
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {viewerSrc && (
        <SecureFileViewer
          src={viewerSrc}
          title={viewerTitle}
          onClose={() => setViewerSrc(null)}
        />
      )}
    </section>
  );
}