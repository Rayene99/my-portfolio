import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BLOG_BLURB =
  "A space where I write about language teaching, design thinking, " +
  "and the ideas I keep returning to. Equal parts reflection and craft.";

const GRID_ITEMS = [
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
];

// ── GridMotion ───────────────────────────────────────────────────────────────
function GridMotion({ items = [], gradientColor = "black" }) {
  const rowRefs = useRef([]);
  const mouseXRef = useRef(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0
  );

  const totalItems = 28;
  const combined =
    items.length > 0
      ? items.slice(0, totalItems)
      : Array.from({ length: totalItems }, (_, i) => `Item ${i + 1}`);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    const handleMouseMove = (e) => { mouseXRef.current = e.clientX; };
    const updateMotion = () => {
      const maxMove = 300;
      const baseDur = 0.8;
      const inertia = [0.6, 0.4, 0.3, 0.2];
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const dir = i % 2 === 0 ? 1 : -1;
        const move = ((mouseXRef.current / window.innerWidth) * maxMove - maxMove / 2) * dir;
        gsap.to(row, { x: move, duration: baseDur + inertia[i % inertia.length], ease: "power3.out", overwrite: "auto" });
      });
    };
    const ticker = gsap.ticker.add(updateMotion);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    /*
      Key fix: width & height both 100% so the grid fills the
      entire parent section, not just 80% of it.
    */
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <section
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            /* overshoot in both axes so rotation gaps never show */
            width: "160vw",
            height: "160%",
            top: "-30%",
            left: "-30vw",
            display: "grid",
            gridTemplateRows: "repeat(4, 1fr)",
            gridTemplateColumns: "1fr",
            gap: "0.75rem",
            transform: "rotate(-15deg)",
            transformOrigin: "center",
            zIndex: 2,
          }}
        >
          {[...Array(4)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              ref={(el) => (rowRefs.current[rowIndex] = el)}
              style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.75rem", willChange: "transform" }}
            >
              {[...Array(7)].map((_, colIndex) => {
                const content = combined[rowIndex * 7 + colIndex];
                return (
                  <div key={colIndex} style={{ position: "relative", width: "100%", paddingBottom: "120%" }}>
                    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "10px", backgroundColor: "#2a1050", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem" }}>
                      {typeof content === "string" && content.startsWith("http") ? (
                        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${content})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                      ) : (
                        <div style={{ padding: "1rem", textAlign: "center", zIndex: 1 }}>{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── AdvertiseBlogs ───────────────────────────────────────────────────────────
export default function AdvertiseBlogs({ onNavigate }) {
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 36,
        opacity: 0,
        duration: 0.75,
        stagger: 0.13,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "370px",
        overflow: "hidden",
        background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)",
      }}
    >
      {/* GridMotion — now fills the full 500px */}
      <div style={{ position: "absolute", inset: 0 }}>
        <GridMotion items={GRID_ITEMS} gradientColor="#3D2060" />
      </div>

      {/*
        Dark overlay — strong enough to keep text readable,
        but not so heavy that images disappear.
        Uses a radial darkening at center so text zone is always readable.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(30,10,60,0.72) 0%, rgba(30,10,60,0.30) 100%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      {/* Edge fade — blends cleanly with adjacent sections */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(93,68,128,0.60) 0%, transparent 20%, transparent 80%, rgba(184,112,156,0.60) 100%)",
          pointerEvents: "none",
          zIndex: 11,
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 2rem",
        }}
      >
        <div
          ref={overlayRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          {/* Label */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.80)",
            }}
          >
            From the blog
          </span>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(2.6rem, 5vw, 3.8rem)",
              lineHeight: 1.1,
              color: "#ffffff",
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            }}
          >
            Blog
          </h2>

          {/* Divider */}
          <div style={{ width: "4rem", height: "1px", background: "rgba(255,255,255,0.60)" }} />

          {/* Tagline */}
          <p
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: "1rem",
              lineHeight: 1.65,
              color: "#ffffff",
              maxWidth: "50ch",
              margin: 0,
              fontWeight: 500,
              textShadow: "0 1px 12px rgba(0,0,0,0.5)",
            }}
          >
            {BLOG_BLURB}
          </p>

          {/* Casual nudge */}
          <p
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: "0.88rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.82)",
              maxWidth: "44ch",
              margin: 0,
              fontStyle: "italic",
              textShadow: "0 1px 10px rgba(0,0,0,0.45)",
            }}
          >
            Oh, and — make sure to check out the blog. You might find something that sticks.
          </p>

          {/* CTA */}
          <button
            onClick={() => onNavigate?.("blogs")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector(".cta-label").style.opacity = "0.6";
              e.currentTarget.querySelector(".cta-arrow").style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector(".cta-label").style.opacity = "1";
              e.currentTarget.querySelector(".cta-arrow").style.transform = "translateX(0)";
            }}
            style={{
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
              border: "none",
              background: "transparent",
              padding: 0,
            }}
          >
            <span
              className="cta-label"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#ffffff",
                transition: "opacity 0.2s",
                textShadow: "0 1px 8px rgba(0,0,0,0.4)",
              }}
            >
              Read all blog
            </span>
            <span
              className="cta-arrow"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.60)",
                color: "#ffffff",
                transition: "transform 0.2s",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}