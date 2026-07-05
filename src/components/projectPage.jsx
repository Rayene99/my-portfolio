import { useState } from "react";
import { projects } from "../lib/content";
import SecureFileViewer from "./SecureFileViewer";

function isInternalFile(link) {
  if (!link) return false;
  return !link.startsWith("http://") && !link.startsWith("https://");
}

/* ── Sidebar nav button ── */
function ProjectNavButton({ item, index, active, onClick }) {
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

      <span
        className={`block font-mono text-[0.62rem] tracking-[0.14em] uppercase mb-[2px] transition-colors duration-200
          ${active ? "text-[#B8709C] font-bold" : "text-[#c4b5d0]"}`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span
        className={`block font-mono text-[0.72rem] tracking-[0.08em] uppercase leading-snug transition-colors duration-200
          ${active ? "text-[#533178] font-bold" : "text-[#9ca3af] font-normal hover:text-[#533178]"}`}
      >
        {item.title}
      </span>
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-mono)", fontSize: "0.68rem",
      letterSpacing: "0.12em", textTransform: "uppercase",
      color: "#533178", fontWeight: 700, marginBottom: "0.55rem",
    }}>
      {children}
    </h3>
  );
}

/* ── Main viewer panel ── */
function ProjectViewer({ item, index, onOpenInternal }) {
  if (!item) return (
    <div className="flex items-center justify-center h-[300px] text-[#9ca3af] font-mono text-[0.8rem] tracking-[0.1em] uppercase">
      Select a project
    </div>
  );

  const initials = item.title?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const internal = isInternalFile(item.link);

  return (
    <div style={{ animation: "projectFadeIn 0.3s ease both" }}>
      <style>{`
        @keyframes projectFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: "2.5rem",
        alignItems: "start",
      }}>
        {/* Cover image — objectFit: contain so nothing gets cropped */}
        <div style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(93,68,128,0.18)",
          boxShadow: "0 8px 32px rgba(93,68,128,0.12)",
          aspectRatio: "4/3",
          background: "#f4efe7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
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

        {/* Details */}
        <div>
          <span style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)", fontSize: "0.65rem",
            color: "#B8709C", letterSpacing: "0.14em", textTransform: "uppercase",
            fontWeight: 600, marginBottom: "0.75rem",
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>

          <h1 className="font-heading italic font-semibold leading-tight m-0 mb-2"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#533178" }}>
            {item.title}
          </h1>

          {/* Tagline */}
          {item.tagline && (
            <p style={{
              fontFamily: "var(--font-heading)", fontStyle: "italic",
              fontSize: "1.1rem", color: "#8B6BAE", margin: "0 0 1.5rem",
            }}>
              {item.tagline}
            </p>
          )}

          {/* The Problem */}
          {item.problem && (
            <div style={{ marginBottom: "1.5rem" }}>
              <SectionLabel>The Problem</SectionLabel>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.7, color: "#4b4b4b", margin: 0 }}>
                {item.problem}
              </p>
            </div>
          )}

          {/* The Approach */}
          {item.approach && (
            <div style={{ marginBottom: "1.5rem" }}>
              <SectionLabel>My Approach</SectionLabel>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.7, color: "#4b4b4b", margin: 0 }}>
                {item.approach}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          {item.techStack?.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <SectionLabel>Tech Stack</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span key={tech} style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.68rem",
                    letterSpacing: "0.06em",
                    color: "#533178", background: "rgba(93,68,128,0.07)",
                    padding: "4px 10px", borderRadius: "6px",
                    border: "1px solid rgba(93,68,128,0.15)",
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Outcome */}
          {item.outcome && (
            <div style={{ marginBottom: "1.5rem" }}>
              <SectionLabel>Outcome</SectionLabel>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.7, color: "#4b4b4b", margin: 0 }}>
                {item.outcome}
              </p>
            </div>
          )}

          {/* Fallback / general description */}
          {(item.description || item.body) && (
            <p className="font-body text-base leading-[1.75] italic text-[#533178] border-l-[3px] border-[#B8709C] pl-4"
              style={{ margin: "0 0 1.5rem" }}>
              {item.description || item.body}
            </p>
          )}

          <hr className="border-0 border-t border-gray-200 my-6" />

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

          {/* CTA */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {item.link ? (
              internal ? (
                <button
                  onClick={() => onOpenInternal(item)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                    background: "#533178", color: "white",
                    padding: "0.7rem 1.6rem", borderRadius: "999px",
                    border: "none", cursor: "pointer",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    fontWeight: 600, transition: "background 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#8B6BAE"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#533178"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  View Project
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              ) : (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                    background: "#533178", color: "white",
                    padding: "0.7rem 1.6rem", borderRadius: "999px",
                    textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
                    fontWeight: 600, transition: "background 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#8B6BAE"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#533178"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  View Project
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              )
            ) : (
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.72rem",
                color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "0.7rem 0", fontWeight: 600,
              }}>
                In Progress
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerSrc, setViewerSrc] = useState(null);
  const [viewerTitle, setViewerTitle] = useState("");

  if (!Array.isArray(projects) || projects.length === 0) return null;

  const activeProject = projects[activeIndex];

  function openInternal(item) {
    setViewerSrc(item.link);
    setViewerTitle(item.title);
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Page header */}
      <div style={{ background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)" }}>
        <div className="max-w-[1100px] mx-auto px-8 py-4 mb-6 flex items-center">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">
              Things I've Built
            </span>
            <h1 className="font-heading italic font-semibold text-5xl text-white leading-tight m-0 py-2">
              Projects
            </h1>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-[1100px] mx-auto px-8 pb-24 grid grid-cols-[200px_1fr] gap-0 items-start">

        {/* LEFT: sticky sidebar nav */}
        <aside className="sticky top-20 pr-8 border-r border-[rgba(93,68,128,0.18)] self-start">
          <nav className="flex flex-col gap-[0.15rem]">
            <p className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-[#9ca3af] mb-3 m-0">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
            {projects.map((p, i) => (
              <ProjectNavButton
                key={i}
                item={p}
                index={i}
                active={i === activeIndex}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </nav>
        </aside>

        {/* RIGHT: project viewer */}
        <main className="pl-10 pt-8">
          <ProjectViewer key={activeIndex} item={activeProject} index={activeIndex} onOpenInternal={openInternal} />
        </main>
      </div>

      {viewerSrc && (
        <SecureFileViewer
          src={viewerSrc}
          title={viewerTitle}
          onClose={() => setViewerSrc(null)}
        />
      )}
    </div>
  );
}