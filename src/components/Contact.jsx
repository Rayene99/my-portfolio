export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)",
        padding: "clamp(3.5rem,7vw,5.5rem) 0 clamp(4rem,8vw,7rem)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-8" style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(140px,190px) minmax(0,620px)",
          gap: "clamp(2.5rem,5vw,5rem)",
          alignItems: "start",
          width: "100%",
          maxWidth: "860px",
        }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            <h2 style={{
              fontFamily: "var(--font-heading)", fontStyle: "italic",
              fontWeight: 600, fontSize: "clamp(2rem,3vw,2.4rem)",
              lineHeight: 1.2, color: "#fff", paddingTop: "3.5rem", margin: 0,
            }}>
              Contact Me
            </h2>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "0.78rem",
              lineHeight: 1.6, color: "rgba(255,255,255,0.8)", margin: 0,
            }}>
              Have a project in mind or just want to say hello? I'd love to hear from you.
            </p>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.15)", margin: "0.15rem 0" }} />

            {[
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="2,4 12,13 22,4"/>
                  </svg>
                ),
                label: "Email",
                value: "Rayene.educator@gmail.com",
              },
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                ),
                label: "LinkedIn",
                value: "Rayene Medabis, M.Ed",
              },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <strong style={{
                    display: "block", fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: 1,
                  }}>{label}</strong>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(255,255,255,0.75)" }}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Form */}
          <form
            action="https://formspree.io/f/mlgyzper"
            method="POST"
            style={{
              display: "flex", flexDirection: "column", gap: "1.2rem",
              paddingTop: "3.5rem",
              width: "100%",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { id: "name",  label: "Name",  type: "text",  placeholder: "Your name" },
                { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label htmlFor={id} style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.7)", fontWeight: 600,
                  }}>{label}</label>
                  <input id={id} name={id} type={type} placeholder={placeholder} required
                    style={{
                      fontFamily: "var(--font-body)", fontSize: "0.88rem",
                      padding: "0.65rem 0.9rem",
                      border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10,
                      background: "rgba(255,255,255,0.15)",
                      color: "#fff", outline: "none", width: "100%", boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.8)"; e.target.style.background = "rgba(255,255,255,0.22)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label htmlFor="subject" style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)", fontWeight: 600,
              }}>Subject</label>
              <input id="subject" name="subject" type="text" placeholder="What's this about?"
                style={{
                  fontFamily: "var(--font-body)", fontSize: "0.88rem",
                  padding: "0.65rem 0.9rem",
                  border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10,
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff", outline: "none", width: "100%", boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.8)"; e.target.style.background = "rgba(255,255,255,0.22)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label htmlFor="message" style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)", fontWeight: 600,
              }}>Message</label>
              <textarea id="message" name="message" rows={4} placeholder="What's on your mind?" required
                style={{
                  fontFamily: "var(--font-body)", fontSize: "0.88rem",
                  padding: "0.65rem 0.9rem",
                  border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10,
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff", outline: "none", resize: "vertical",
                  width: "100%", boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.8)"; e.target.style.background = "rgba(255,255,255,0.22)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <button
              type="submit"
              style={{
                alignSelf: "flex-start",
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
                padding: "0.75rem 1.5rem", borderRadius: "999px", border: "1.5px solid rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.15)",
                color: "white", cursor: "pointer",
                transition: "background 0.2s, transform 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; e.currentTarget.style.borderColor = "white"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Send Message
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}