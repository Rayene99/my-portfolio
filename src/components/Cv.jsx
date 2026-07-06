import { useEffect, useRef, useState } from "react";
import { cv } from "../lib/content";
import profilePic from "../assets/output-image.png";
import SecureFileViewer from "./SecureFileViewer";

const NAV_SECTIONS = [
  { id: "cv-summary",         label: "Summary"         },
  { id: "cv-experience",      label: "Experience"      },
  { id: "cv-education",       label: "Education"       },
  { id: "cv-skills",          label: "Skills"          },
  { id: "cv-languages",       label: "Languages"       },
  { id: "cv-certifications",  label: "Certifications"  },
  { id: "cv-recommendations", label: "Recommendations" },
];

// Computed once, outside the component, so the array reference passed to
// useActiveSection never changes across re-renders. Previously this was
// `NAV_SECTIONS.map(...)` done inline on every render, which created a new
// array each time and made the effect below tear down and rebuild its
// IntersectionObservers on every render instead of once.
const NAV_IDS = NAV_SECTIONS.map((s) => s.id);

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"];

function isImageSrc(src) {
  if (!src) return false;
  const clean = src.split("?")[0].split("#")[0];
  const ext = clean.split(".").pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

// Prefer an explicit "file" as the thing that opens in the viewer (it's the
// more deliberate upload), falling back to "image". The card thumbnail uses
// the image if present, or the file itself if the file happens to be an image.
function resolveMedia(item) {
  const openHref = item.file || item.image || null;
  const thumbSrc = item.image || (isImageSrc(item.file) ? item.file : null);
  return { openHref, thumbSrc };
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids]);
  return active;
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

function SectionHeading({ id, label }) {
  return (
    <h2 id={id} className="font-heading italic font-semibold text-[clamp(1.6rem,2.5vw,2.1rem)] text-[#533178] mb-6 scroll-mt-[90px]">
      {label}
    </h2>
  );
}

function Divider() {
  return <hr className="border-0 border-t border-gray-200 my-10" />;
}

function Tag({ children }) {
  return (
    <span className="inline-block font-mono text-[0.7rem] tracking-[0.07em] uppercase text-[#7c5cbf] bg-[rgba(93,68,128,0.08)] border border-[rgba(93,68,128,0.18)] rounded-full px-[10px] py-[3px]">
      {children}
    </span>
  );
}

function ScrollRow({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        overflowX: "auto",
        paddingBottom: "0.85rem",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(93,68,128,0.25) transparent",
      }}
    >
      {children}
    </div>
  );
}

/* Card used for both Certifications and Recommendations — shows an
   image/file thumbnail (or initials if neither is set), a title, a
   subtitle, and optional meta text. Clicking opens the attached
   image/file in the protected SecureFileViewer, if one is present. */
function MediaCard({ title, subtitle, meta, item, onOpen }) {
  const { openHref, thumbSrc } = resolveMedia(item);
  const initials = (title || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const clickable = Boolean(openHref);

  return (
    <div
      onClick={clickable ? () => onOpen(openHref, title) : undefined}
      style={{
        flexShrink: 0,
        width: "200px",
        background: "#fff",
        border: "1px solid rgba(93,68,128,0.14)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        cursor: clickable ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!clickable) return;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(93,68,128,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)";
      }}
    >
      <div
        style={{
          width: "100%",
          height: "120px",
          background: thumbSrc ? "#f4efe7" : "linear-gradient(135deg, #5D4480 0%, #B8709C 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {thumbSrc ? (
          <img src={thumbSrc} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span
            style={{
              fontFamily: "var(--font-heading)", fontStyle: "italic",
              fontSize: "1.8rem", color: "rgba(255,255,255,0.35)", fontWeight: 600,
            }}
          >
            {initials}
          </span>
        )}
      </div>

      <div style={{ padding: "0.85rem 1rem" }}>
        {meta && (
          <span
            style={{
              display: "block", fontFamily: "var(--font-mono)", fontSize: "0.62rem",
              color: "#7c5cbf", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px",
            }}
          >
            {meta}
          </span>
        )}
        <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.88rem", color: "#111", margin: "0 0 2px", lineHeight: 1.3 }}>
          {title}
        </p>
        {subtitle && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#B8709C", fontStyle: "italic", margin: 0 }}>
            {subtitle}
          </p>
        )}
        {clickable && (
          <span
            style={{
              display: "inline-block", marginTop: "6px", fontFamily: "var(--font-mono)",
              fontSize: "0.6rem", color: "#533178", letterSpacing: "0.06em",
              textTransform: "uppercase", fontWeight: 600,
            }}
          >
            View →
          </span>
        )}
      </div>
    </div>
  );
}

export default function Cv() {
  const active = useActiveSection(NAV_IDS);
  const [viewerSrc, setViewerSrc] = useState(null);
  const [viewerTitle, setViewerTitle] = useState("");

  if (!cv) return null;

  function openViewer(href, title) {
    setViewerSrc(href);
    setViewerTitle(title);
  }

  // skills can be a flat list of strings or a list of {category, items} objects
  const skillGroups = Array.isArray(cv.skills)
    ? cv.skills[0]?.category
      ? cv.skills
      : [{ category: "Skills", items: cv.skills }]
    : [];

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Page header */}
      <div style={{ background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)" }}>
        <div className="max-w-[1100px] mx-auto px-8 py-4 mb-6 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-heading italic font-semibold text-5xl text-white leading-tight m-0">
              {cv.name}
            </h1>
<p
  className="font-mono text-sm tracking-wide m-0"
  style={{ color: "rgba(255,255,255,0.9)" }}
>
  {cv.title}
</p>
          </div>

          <div className="flex-shrink-0 w-40 h-40 rounded-full overflow-hidden mr-16">
            <img src={profilePic} alt={cv.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-[1100px] mx-auto px-8 pb-24 grid grid-cols-[200px_1fr] gap-0 items-start">

        {/* LEFT: sticky nav */}
        <aside className="sticky top-20 pr-8 border-r border-[rgba(93,68,128,0.18)] self-start">
          <nav className="flex flex-col gap-[0.15rem]">
            {NAV_SECTIONS.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`relative bg-transparent border-none cursor-pointer text-left py-[0.45rem] font-mono text-[0.72rem] tracking-[0.1em] uppercase transition-colors duration-200
                    ${isActive ? "text-[#533178] font-bold" : "text-[#9ca3af] font-normal hover:text-[#533178]"}`}
                >
                  {isActive && (
                    <span
                      className="absolute right-[-2rem] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-sm"
                      style={{ background: "linear-gradient(180deg, #5D4480, #B8709C)" }}
                    />
                  )}
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT: content */}
        <main className="pl-12 pt-2">

          {/* Summary */}
          <section id="cv-summary">
            <SectionHeading id="cv-summary-heading" label="Summary" />
            <p className="font-body text-[0.95rem] leading-[1.8] text-[#4b5563] m-0">
              {cv.summary}
            </p>
          </section>

          <Divider />

          {/* Experience */}
          {cv.experience?.length > 0 && (
            <section id="cv-experience">
              <SectionHeading id="cv-experience-heading" label="Experience" />
              <div className="flex flex-col gap-8">
                {cv.experience.map((exp, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] gap-4">
                    <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#7c5cbf]">
                      {exp.dates}
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-base text-[#111] mb-[2px]">{exp.role}</p>
                      <p className="font-mono text-[0.72rem] text-[#B8709C] italic tracking-[0.05em] mb-[0.6rem]">{exp.company}</p>
                      <p className="font-body text-[0.88rem] leading-[1.72] text-[#4b5563] m-0">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Divider />

          {/* Education */}
          {cv.education?.length > 0 && (
            <section id="cv-education">
              <SectionHeading id="cv-education-heading" label="Education" />
              <div className="flex flex-col gap-[1.4rem]">
                {cv.education.map((edu, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] gap-4">
                    <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#7c5cbf]">
                      {edu.dates}
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-[0.97rem] text-[#111] mb-[2px]">{edu.degree}</p>
                      <p className="font-mono text-[0.72rem] text-[#B8709C] italic m-0">{edu.institution || edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Divider />

          {/* Skills */}
          {skillGroups.length > 0 && (
            <section id="cv-skills">
              <SectionHeading id="cv-skills-heading" label="Skills" />
              <div className="flex flex-col gap-[1.4rem]">
                {skillGroups.map((group, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] gap-4 items-start">
                    <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#7c5cbf] pt-[4px]">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-[0.4rem]">
                      {(group.items || []).map((skill, j) => (
                        <Tag key={j}>{skill}</Tag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Divider />

          {/* Languages */}
          {cv.languages?.length > 0 && (
            <section id="cv-languages">
              <SectionHeading id="cv-languages-heading" label="Languages" />
              <div className="flex gap-8 flex-wrap">
                {cv.languages.map((lang, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl px-[1.4rem] py-4 min-w-[120px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    <p className="font-heading font-semibold text-base text-[#533178] mb-[3px]">{lang.language}</p>
                    <p className="font-mono text-[0.68rem] text-[#B8709C] uppercase tracking-[0.08em] italic m-0">{lang.level}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Divider />

          {/* Certifications — horizontally scrollable cards, each optionally
              linking to an uploaded image/file that opens in the secure viewer */}
          {cv.certifications?.length > 0 && (
            <section id="cv-certifications">
              <SectionHeading id="cv-certifications-heading" label="Certifications" />
              <ScrollRow>
                {cv.certifications.map((cert, i) => (
                  <MediaCard
                    key={i}
                    title={cert.name}
                    subtitle={cert.issuer}
                    meta={cert.year}
                    item={cert}
                    onOpen={openViewer}
                  />
                ))}
              </ScrollRow>
            </section>
          )}

          <Divider />

          {/* Recommendations — same horizontally scrollable card pattern.
              This section previously didn't exist at all, which is why the
              sidebar's "Recommendations" link did nothing. */}
          {cv.recommendations?.length > 0 && (
            <section id="cv-recommendations">
              <SectionHeading id="cv-recommendations-heading" label="Recommendations" />
              <ScrollRow>
                {cv.recommendations.map((rec, i) => (
                  <MediaCard
                    key={i}
                    title={rec.name}
                    subtitle={rec.issuer}
                    meta={rec.title}
                    item={rec}
                    onOpen={openViewer}
                  />
                ))}
              </ScrollRow>
            </section>
          )}

        </main>
      </div>

      {viewerSrc && (
        <SecureFileViewer
          src={viewerSrc}
          title={viewerTitle}
          onClose={() => setViewerSrc(null)}
        />
      )}

      <style>{`
        @media print {
          aside { display: none; }
          main  { padding-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}