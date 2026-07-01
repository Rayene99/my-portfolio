import { useState, useEffect } from "react";
import profilePic from "../assets/profile-pic.jpg";

const cv = {
  name: "Your Name",
  title: "Instructional Designer",
  summary:
    "A short paragraph about who you are, what you do, and what you're looking for. Keep it punchy and personal.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "Acme Corp",
      period: "2022 – Present",
      description:
        "Led the redesign of the core product, resulting in a 40% increase in user retention. Collaborated cross-functionally with engineering and product teams.",
    },
    {
      role: "UX Designer",
      company: "Studio XYZ",
      period: "2019 – 2022",
      description:
        "Designed end-to-end experiences for mobile and web applications. Ran user research, created prototypes, and iterated based on usability testing.",
    },
  ],
  education: [
    { degree: "M.Sc. Human-Computer Interaction", institution: "University of Example", year: "2019" },
    { degree: "B.Sc. Computer Science", institution: "State University", year: "2017" },
  ],
  skills: [
    { category: "Design", items: ["Figma", "Prototyping", "Design Systems", "User Research"] },
    { category: "Development", items: ["React", "TypeScript", "CSS", "Node.js"] },
    { category: "Soft Skills", items: ["Team Leadership", "Stakeholder Management", "Communication"] },
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "French", level: "Professional" },
    { language: "Arabic", level: "Native" },
  ],
  certifications: [
    { name: "Google UX Design Certificate", issuer: "Google", year: "2021" },
    { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2023" },
  ],
};

const NAV_SECTIONS = [
  { id: "cv-summary",        label: "Summary"        },
  { id: "cv-experience",     label: "Experience"     },
  { id: "cv-education",      label: "Education"      },
  { id: "cv-skills",         label: "Skills"         },
  { id: "cv-languages",      label: "Languages"      },
  { id: "cv-certifications", label: "Certifications" },
   { id: "cv-recommendations", label: "Recommendations" }, 
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
    <h2
      id={id}
      className="font-heading italic font-semibold text-[clamp(1.6rem,2.5vw,2.1rem)] text-[#533178] mb-6 scroll-mt-[90px]"
    >
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

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ── Page header ── */}
      <div style={{ background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)" }}>
        <div className="max-w-[1100px] mx-auto px-8 py-4 mb-6 flex items-center justify-between">

          {/* Left: text */}
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
              Download PDF
            </button>
          </div>

          {/* Right: profile photo */}
          <div className="flex-shrink-0 w-40 h-40 rounded-full overflow-hidden mr-16">
            <img src={profilePic} alt={cv.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
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
          <section id="cv-experience">
            <SectionHeading id="" label="Experience" />
            <div className="flex flex-col gap-8">
              {cv.experience.map((exp, i) => (
                <div key={i} className="grid grid-cols-[160px_1fr] gap-4">
                  <div>
                    <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#7c5cbf]">
                      {exp.period}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-base text-[#111] mb-[2px]">
                      {exp.role}
                    </p>
                    <p className="font-mono text-[0.72rem] text-[#B8709C] italic tracking-[0.05em] mb-[0.6rem]">
                      {exp.company}
                    </p>
                    <p className="font-body text-[0.88rem] leading-[1.72] text-[#4b5563] m-0">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Education */}
          <section id="cv-education">
            <SectionHeading id="" label="Education" />
            <div className="flex flex-col gap-[1.4rem]">
              {cv.education.map((edu, i) => (
                <div key={i} className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#7c5cbf]">
                    {edu.year}
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-[0.97rem] text-[#111] mb-[2px]">
                      {edu.degree}
                    </p>
                    <p className="font-mono text-[0.72rem] text-[#B8709C] italic m-0">
                      {edu.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Skills */}
          <section id="cv-skills">
            <SectionHeading id="" label="Skills" />
            <div className="flex flex-col gap-[1.4rem]">
              {cv.skills.map((group, i) => (
                <div key={i} className="grid grid-cols-[160px_1fr] gap-4 items-start">
                  <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#7c5cbf] pt-[4px]">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-[0.4rem]">
                    {group.items.map((skill, j) => (
                      <Tag key={j}>{skill}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Languages */}
          <section id="cv-languages">
            <SectionHeading id="" label="Languages" />
            <div className="flex gap-8 flex-wrap">
              {cv.languages.map((lang, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl px-[1.4rem] py-4 min-w-[120px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <p className="font-heading font-semibold text-base text-[#533178] mb-[3px]">
                    {lang.language}
                  </p>
                  <p className="font-mono text-[0.68rem] text-[#B8709C] uppercase tracking-[0.08em] italic m-0">
                    {lang.level}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Certifications */}
          <section id="cv-certifications">
            <SectionHeading id="" label="Certifications" />
            <div className="flex flex-col gap-4">
              {cv.certifications.map((cert, i) => (
                <div key={i} className="grid grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="font-mono text-[0.68rem] tracking-[0.08em] uppercase text-[#7c5cbf]">
                    {cert.year}
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-[0.95rem] text-[#111] mb-[2px]">
                      {cert.name}
                    </p>
                    <p className="font-mono text-[0.7rem] text-[#B8709C] italic m-0">
                      {cert.issuer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

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