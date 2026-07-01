import { useEffect, useRef, useState } from "react";
import { experience } from "../lib/content";

/** "2024-03-01" -> "Mar 2024". Built from numeric parts to avoid timezone drift. */
function formatDate(dateStr) {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

/** Turns a markdown-style "- bullet" body into an array of bullet strings. */
function parseHighlights(body) {
  if (typeof body !== "string") return [];
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace(/^-\s*/, ""));
}

/** Reveals an element once it scrolls into view, then stops watching. */
function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}

function ExperienceItem({ item, index, isLast }) {
  const [ref, inView] = useInView({ threshold: 0.1, rootMargin: "0px 0px -80px 0px" });
  const delay = `${index * 0.06}s`;

  // Accept either a `highlights` array (older data shape) or a markdown `body` (current shape).
  const highlights = Array.isArray(item.highlights)
    ? item.highlights
    : parseHighlights(item.body);

  return (
    <div ref={ref} className="flex gap-5 px-20 md:gap-8 items-stretch w-full">
      {/* Spine column: dot + connector, mirrors the hero timeline */}
      <div className="flex flex-col items-center flex-shrink-0 pt-2">
        <div
          className="rounded-full flex-shrink-0 transition-all duration-500 ease-out"
          style={{
            width: "12px",
            height: "12px",
            background: "var(--color-primary)",
            boxShadow: inView
              ? "0 0 0 5px var(--color-primary-light)"
              : "0 0 0 0px var(--color-primary-light)",
            opacity: inView ? 1 : 0,
            transform: inView ? "scale(1)" : "scale(0.4)",
            transitionDelay: delay,
          }}
        />
        {!isLast && (
          <div
            className="mt-1 flex-1"
            style={{
              width: "1.5px",
              minHeight: "40px",
              background: "var(--color-border)",
            }}
          />
        )}
      </div>

      {/* Content block */}
      <div
        className=" items-stretch w-full pb-16 min-w-0 transition-all duration-700 ease-out"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(28px)",
          transitionDelay: delay,
        }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2 items-stretch w-full">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary items-stretch w-full">
            {formatDate(item.start_date)} — {formatDate(item.end_date)}
          </p>
          {item.location && (
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-light items-stretch w-full">
              {item.location}
            </p>
          )}
        </div>

        <h3 className="font-heading italic text-2xl md:text-3xl font-semibold text-text leading-tight mb-1 items-stretch w-full" style={{ color: "#533178" }}>
          {item.role}
        </h3>
        <p className="font-mono text-sm text-primary-dark mb-4 items-stretch w-full">{item.company}</p>

        {highlights.length > 0 && (
          <ul className="flex flex-col gap-2">
            {highlights.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-text-muted leading-relaxed items-stretch w-full">
                <span
                  className="flex-shrink-0 mt-[9px] rounded-full"
                  style={{ width: "5px", height: "5px", background: "var(--color-accent-dark)" }}
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  if (!Array.isArray(experience) || experience.length === 0) return null;

  return (
    <section id="experience" className="max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 py-18">
      <div className="mb-14">
        <span className="font-mono text-sm uppercase tracking-[0.18em] text-primary block mb-3">
          Career
        </span>
        <h2 className="text-4xl md:text-5xl" style={{ color: "#533178" }}>Experience</h2> 
      </div>

      <div className="flex flex-col">
        {experience.map((item, i) => (
          <ExperienceItem
            key={i}
            item={item}
            index={i}
            isLast={i === experience.length - 1}
          />
        ))}
      </div>
    </section>
  );
}