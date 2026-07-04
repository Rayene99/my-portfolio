import { useEffect, useRef, useState } from "react";
import { cv } from "../lib/content";
import profilePic from "../assets/profile-pic.jpg";

const NAV_SECTIONS = [
  { id: "cv-summary",         label: "Summary"         },
  { id: "cv-experience",      label: "Experience"      },
  { id: "cv-education",       label: "Education"       },
  { id: "cv-skills",          label: "Skills"          },
  { id: "cv-languages",       label: "Languages"       },
  { id: "cv-certifications",  label: "Certifications"  },
  { id: "cv-recommendations",  label: "Recommendations"  },
];

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

export default function CvPage() {
  const active = useActiveSection(NAV_SECTIONS.map((s) => s.id));

  if (!cv) return null;

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
            <p className="font-mono text-sm text-white/70 tracking-wide m-0">
              {cv.title}
            </p>
            <button
              onClick={() => window.print()}
              className="mt-3 w-fit font-mono text-xs uppercase tracking-widest text-[#5D4480] bg-white rounded-full px-5 py-2 inline-flex items-center gap-2 shadow-md border-none cursor-pointer hover:shadow-lg transition-shadow"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </button>
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
            <SectionHeading id="" label="Summary" />
            <p className="font-body text-[0.95rem] leading-[1.8] text-[#4b5563] m-0">
              {cv.summary}
            </p>
          </section>

          <Divider />

          {/* Experience */}
          {cv.experience?.length > 0 && (
            <section id="cv-experience">
              <SectionHeading id="" label="Experience" />
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
              <SectionHeading id="" label="Education" />
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
              <SectionHeading id="" label="Skills" />
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
              <SectionHeading id="" label="Languages" />
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

          {/* Certifications */}
          {cv.certifications?.length > 0 && (
            <section id="cv-certifications">
              <SectionHeading id="" label="Certifications" />
              <div className="flex flex-col gap-4">
                {cv.certifications.map((cert, i) => (
                  <div key={i} className="grid grid-cols-[160px_1fr] gap-4 items-center">
                    <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#7c5cbf]">{cert.year}</span>
                    <div>
                      <p className="font-heading font-semibold text-[0.95rem] text-[#111] mb-[2px]">{cert.name}</p>
                      <p className="font-mono text-[0.7rem] text-[#B8709C] italic m-0">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>

      <style>{`
        @media print {
          aside { display: none; }
          main  { padding-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}