import { useState, useEffect, useRef } from "react";
import { testimonials } from "../lib/content";

const W   = { color: "rgba(255,255,255,1)"    };
const W80 = { color: "rgba(255,255,255,0.80)" };

const CARDS_VISIBLE = 3;

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function TestimonialCard({ item, index }) {
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        background: "rgba(255,255,255,0.96)",
        boxShadow: "var(--shadow-lg)",
        animation: `slideIn 0.4s ease ${index * 0.07}s both`,
        position: "relative",
      }}
    >
      {/* Quote badge */}
      <div style={{
        padding: "1.4rem 1.2rem 0",
      }}>
        <div
          aria-hidden="true"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          <span style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontSize: "2rem",
            color: "white",
            lineHeight: 1,
            paddingTop: "8px",
            paddingRight: "4px",
            userSelect: "none",
            display: "block",
          }}>
            &ldquo;
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{
        padding: "1rem 1.2rem 1.3rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
        flex: 1,
      }}>
        <div
          className="testimonial-quote"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.84rem",
            lineHeight: 1.68,
            color: "var(--color-text-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 7,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: item.body || item.quote }}
        />

        <div style={{ marginTop: "auto" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.92rem",
            color: "var(--color-text)",
            margin: "0 0 3px",
          }}>
            {item.author}
          </p>
          {(item.role || item.company) && (
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--color-primary)",
              margin: 0,
              letterSpacing: "0.02em",
              fontStyle: "italic",
            }}>
              {[item.role, item.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .testimonial-quote p { margin: 0; }
      `}</style>
    </div>
  );
}

export default function Testimonials() {
  const [start, setStart] = useState(0);
  const [anim, setAnim]   = useState(false);
  const timerRef = useRef(null);

  if (!Array.isArray(testimonials) || testimonials.length === 0) return null;

  const total     = testimonials.length;
  const dots      = Math.max(1, Math.ceil(total / CARDS_VISIBLE));
  const activeDot = Math.floor(start / CARDS_VISIBLE);

  function goTo(next) {
    if (anim) return;
    setAnim(true);
    setTimeout(() => { setStart(next); setAnim(false); }, 280);
  }

  function go(dir) {
    const next =
      dir === "next"
        ? (start + CARDS_VISIBLE) % total
        : ((start - CARDS_VISIBLE) % total + total) % total;
    goTo(next);
  }

  function resetTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setStart((prev) => (prev + CARDS_VISIBLE) % total);
    }, 5000);
  }

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [total]);

  const slice = Array.from({ length: CARDS_VISIBLE }, (_, i) =>
    testimonials[(start + i) % total]
  );

  const arrowStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1.5px solid rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
    flexShrink: 0,
    padding: 0,
  };

  return (
    <section
      id="testimonials"
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={resetTimer}
      style={{
        background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)",
        padding: "clamp(3.5rem,7vw,5.5rem) 0 clamp(4rem,8vw,7rem)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-3rem",
          left: "clamp(1rem,3vw,2.5rem)",
          width: "clamp(140px,17vw,200px)",
          height: "clamp(140px,17vw,200px)",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <span style={{
          fontFamily: "var(--font-heading)",
          fontStyle: "italic",
          fontSize: "clamp(15rem,20vw,19rem)",
          lineHeight: 1,
          color: "rgba(255,255,255,0.80)",
          paddingTop: "0.4em",
          paddingRight: "0.1em",
          userSelect: "none",
          display: "block",
        }}>
          &ldquo;
        </span>
      </div>

      <div
        className="max-w-[1100px] mx-auto px-8"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(160px,220px) 1fr",
          gap: "clamp(2.5rem,5vw,5rem)",
          alignItems: "center",
        }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <h2 style={{
              ...W,
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(2.5rem,3.5vw,3rem)",
              lineHeight: 1.2,
              paddingTop: "5rem",
              margin: 0,
            }}>
              Testimonials
            </h2>

            <p style={{
              ...W80,
              fontFamily: "var(--font-body)",
              fontSize: "0.83rem",
              lineHeight: 1.65,
              margin: 0,
            }}>
              Kind words, thoughtful feedback, and reflections from the people I've had the pleasure of collaborating and working with throughout my professional journey.
            </p>

            <div style={{ display: "flex", gap: "0.45rem", marginTop: "1.25rem" }}>
              {[
                { icon: <ChevronLeft />,  dir: "prev", label: "Previous" },
                { icon: <ChevronRight />, dir: "next", label: "Next"     },
              ].map(({ icon, dir, label }) => (
                <button
                  key={dir}
                  onClick={() => { go(dir); resetTimer(); }}
                  aria-label={label}
                  style={arrowStyle}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              {Array.from({ length: dots }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { if (!anim) { goTo(i * CARDS_VISIBLE); resetTimer(); } }}
                  aria-label={`Page ${i + 1}`}
                  style={{
                    height: "7px",
                    width: i === activeDot ? "20px" : "7px",
                    borderRadius: "4px",
                    border: "none",
                    background: i === activeDot ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "1rem",
            alignItems: "stretch",
            opacity: anim ? 0 : 1,
            transform: anim ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}>
            {slice.map((item, i) => (
              <TestimonialCard key={`${start}-${i}`} item={item} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}