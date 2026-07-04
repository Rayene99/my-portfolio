import { hero } from "../lib/content";


const education = [
  {
    period: "2017–2020",
    location: "Algeria",
    degree: "Bachelor's",
    field: "English Language & Literature",
    institution: "Mostefa Benboulaid University",
    above: false,
  },
  {
    period: "2020–2021",
    location: "New York, USA",
    degree: "220h TESOL",
    field: "Certificate",
    institution: "International TEFL Training Institute",
    above: true,
  },
  {
    period: "2020–2021",
    location: "Perth, UK",
    degree: "230h Diploma",
    field: "Professional Teaching",
    institution: "ELTA Virtual University",
    above: false,
  },
  {
    period: "2020–2022",
    location: "Algeria",
    degree: "Master's",
    field: "Didactics / ELT",
    institution: "Mostefa Benboulaid University",
    above: true,
  },
];

const W   = { color: "rgba(255,255,255,1)" };
const W80 = { color: "rgba(255,255,255,0.80)" };
const W60 = { color: "rgba(255,255,255,0.60)" };
const W50 = { color: "rgba(255,255,255,0.50)" };

const TOTAL_H = 380;
const SPINE_Y = 190;
const DOT_R   = 7;
const CONN    = 30;

export default function Hero() {
  if (!hero) return null;

  const introParagraphs = hero.intro?.split("\n\n").filter(Boolean) || [];

  return (
    <section
      id="hero"
      className="w-full py-2 text-left"
      style={{
        background:
          "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)",
      }}
    >
      {/* ── Main hero content ── */}
      <div className="max-w-[1100px] mx-auto px-8 py-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        <div className="flex-1 basis-1/2 min-w-0 flex gap-6">
          <div className="hidden md:block w-px bg-white/40 flex-shrink-0 self-stretch" />
          <div className="flex flex-col items-start gap-6 min-w-0">
            <span className="font-mono text-s uppercase tracking-[0.18em]" style={W}>
              About me
            </span>
            <h1 className="font-heading italic text-3xl md:text-6xl font-normal" style={W}>
              {hero.name}
            </h1>
            <p className="font-body text-md max-w-[60ch] leading-snug" style={W}>
              {hero.tagline}
            </p>
            <div className="w-16 h-px bg-white/60" />
            <p className="max-w-[65ch] text-sm leading-relaxed" style={W80}>
              {introParagraphs[0]}
            </p>
          </div>
        </div>

        <div className="flex-1 basis-1/2 flex items-center justify-center pt-10 md:pt-16">
          <div className="relative w-64 h-64 md:w-90 md:h-90">
            <div className="absolute -top-4 -left-4 w-16 h-px bg-white/50" />
            <div className="absolute -top-4 -left-4 w-px h-16 bg-white/50" />
            <div className="absolute -bottom-4 -right-4 w-16 h-px bg-white/50" />
            <div className="absolute -bottom-4 -right-4 w-px h-16 bg-white/50" />
            <img src={hero.photo} alt={hero.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* ── Education timeline ── */}
      <div className="max-w-[1100px] mx-auto px-8 mb-10 mt-8 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-6 h-px bg-white/50" />
          <span className="font-mono uppercase tracking-[0.18em] text-md !text-white/90" style={W60}>
            Education
          </span>
          <div className="flex-1 h-px bg-white/50" />
        </div>

        {/* ── Desktop timeline ── */}
        <div className="hidden md:block">
          <div className="relative" style={{ height: `${TOTAL_H}px` }}>

            {/* Spine */}
            <div
              className="absolute left-0 right-0"
              style={{
                top: `${SPINE_Y}px`,
                height: "1.5px",
                background: "rgba(255,255,255,0.4)",
              }}
            />

            {education.map((item, i) => {
              const colW = 25;
              const colCenter = colW * i + colW / 2;

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${colCenter}%`,
                    transform: "translateX(-50%)",
                    top: 0,
                    height: `${TOTAL_H}px`,
                    width: "23%",
                  }}
                >
                  {item.above ? (
                    <>
                      {/* Text block — top half, flush to connector */}
                      <div
                        className="absolute w-full text-center"
                        style={{
                          top: 0,
                          height: `${SPINE_Y - DOT_R - CONN}px`,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        <p
                          style={{
                            ...W60,
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            marginBottom: "8px",
                            fontWeight: 500,
                          }}
                        >
                          {item.period}
                        </p>
                        <p
                          style={{
                            ...W,
                            fontFamily: "var(--font-heading)",
                            fontStyle: "italic",
                            fontSize: "22px",
                            lineHeight: 1.2,
                            fontWeight:600,
                          }}
                        >
                          {item.degree}
                        </p>
                        <p
                          style={{
                            ...W80,
                            fontSize: "14px",
                            fontWeight: 500,
                            marginTop: "6px",
                          }}
                        >
                          {item.field}
                        </p>
                        <p
                          style={{
                            ...W60,
                            fontSize: "13px",
                            fontWeight: 400,
                            marginTop: "5px",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.institution}
                        </p>
                      </div>

                      {/* Connector down to dot */}
                      <div
                        className="absolute left-1/2"
                        style={{
                          transform: "translateX(-50%)",
                          top: `${SPINE_Y - DOT_R - CONN}px`,
                          width: "1.5px",
                          height: `${CONN}px`,
                          background: "rgba(255,255,255,0.55)",
                        }}
                      />

                      {/* Dot */}
                      <div
                        className="absolute left-1/2 rounded-full"
                        style={{
                          transform: "translateX(-50%)",
                          top: `${SPINE_Y - DOT_R}px`,
                          width: `${DOT_R * 2}px`,
                          height: `${DOT_R * 2}px`,
                          background: "white",
                          boxShadow: "0 0 0 4px rgba(255,255,255,0.2)",
                        }}
                      />

                      {/* Location below spine */}
                      <div
                        className="absolute w-full text-center"
                        style={{ top: `${SPINE_Y + DOT_R + 18}px` }}
                      >
                        <p
                          style={{
                            ...W50,
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            fontWeight: 400,
                          }}
                        >
                          {item.location}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Location above spine */}
                      <div
                        className="absolute w-full text-center"
                        style={{ top: `${SPINE_Y - DOT_R - 34}px` }}
                      >
                        <p
                          style={{
                            ...W50,
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            fontWeight: 400,
                          }}
                        >
                          {item.location}
                        </p>
                      </div>

                      {/* Dot */}
                      <div
                        className="absolute left-1/2 rounded-full"
                        style={{
                          transform: "translateX(-50%)",
                          top: `${SPINE_Y - DOT_R}px`,
                          width: `${DOT_R * 2}px`,
                          height: `${DOT_R * 2}px`,
                          background: "white",
                          boxShadow: "0 0 0 4px rgba(255,255,255,0.2)",
                        }}
                      />

                      {/* Connector down to text */}
                      <div
                        className="absolute left-1/2"
                        style={{
                          transform: "translateX(-50%)",
                          top: `${SPINE_Y + DOT_R}px`,
                          width: "1.5px",
                          height: `${CONN}px`,
                          background: "rgba(255,255,255,0.55)",
                        }}
                      />

                      {/* Text block — bottom half, flush to connector */}
                      <div
                        className="absolute w-full text-center"
                        style={{
                          top: `${SPINE_Y + DOT_R + CONN}px`,
                          height: `${TOTAL_H - SPINE_Y - DOT_R - CONN}px`,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                        }}
                      >
                        <p
                          style={{
                            ...W60,
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            marginBottom: "8px",
                            fontWeight: 500,
                          }}
                        >
                          {item.period}
                        </p>
                        <p
                          style={{
                            ...W,
                            fontFamily: "var(--font-heading)",
                            fontStyle: "italic",
                            fontSize: "22px",
                            lineHeight: 1.2,
                            fontWeight: 600,
                          }}
                        >
                          {item.degree}
                        </p>
                        <p
                          style={{
                            ...W80,
                            fontSize: "14px",
                            fontWeight: 500,
                            marginTop: "6px",
                          }}
                        >
                          {item.field}
                        </p>
                        <p
                          style={{
                            ...W60,
                            fontSize: "13px",
                            fontWeight: 400,
                            marginTop: "5px",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.institution}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: stacked list ── */}
        <div className="md:hidden flex flex-col">
          {education.map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center pt-1 flex-shrink-0">
                <div
                  className="rounded-full flex-shrink-0"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "white",
                    boxShadow: "0 0 0 3px rgba(255,255,255,0.2)",
                  }}
                />
                {i < education.length - 1 && (
                  <div
                    className="mt-1"
                    style={{
                      width: "1.5px",
                      minHeight: "52px",
                      background: "rgba(255,255,255,0.3)",
                    }}
                  />
                )}
              </div>
              <div className="pb-7">
                <p style={{ ...W60, fontFamily: "var(--font-mono)", fontSize: "13px", marginBottom: "4px" }}>
                  {item.period} · {item.location}
                </p>
                <p style={{ ...W, fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "22px", lineHeight: 1.2, fontWeight: 600 }}>
                  {item.degree}
                </p>
                <p style={{ ...W80, fontSize: "14px", fontWeight: 500, marginTop: "4px" }}>{item.field}</p>
                <p style={{ ...W60, fontSize: "13px", marginTop: "5px" }}>{item.institution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}