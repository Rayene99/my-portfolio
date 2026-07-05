import { useEffect, useState } from "react";

const PROTECTION_SNIPPET = `
<style>
  * {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
</style>
<script>
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key?.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'c', 'u', 'a'].includes(k)) {
      e.preventDefault();
    }
  });
</script>
`;

export default function SecureFileViewer({ src, title, onClose }) {
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDoc(null);
    setError(false);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.text();
      })
      .then((html) => {
        if (cancelled) return;
        const injected = /<\/head>/i.test(html)
          ? html.replace(/<\/head>/i, `${PROTECTION_SNIPPET}</head>`)
          : PROTECTION_SNIPPET + html; // no <head> tag found — just prepend
        setDoc(injected);
      })
      .catch(() => { if (!cancelled) setError(true); });

    return () => { cancelled = true; };
  }, [src]);

  useEffect(() => {
    function blockKeys(e) {
      const key = e.key?.toLowerCase();
      const blocked = (e.ctrlKey || e.metaKey) && ["s", "p", "u", "c"].includes(key);
      if (blocked || e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    window.addEventListener("keydown", blockKeys, true);
    return () => window.removeEventListener("keydown", blockKeys, true);
  }, []);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(20,14,30,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: "14px", overflow: "hidden",
        width: "100%", maxWidth: "1000px", height: "90vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.9rem 1.25rem", borderBottom: "1px solid #eee",
          fontFamily: "var(--font-mono)", fontSize: "0.75rem",
          letterSpacing: "0.08em", textTransform: "uppercase", color: "#533178",
        }}>
          <span>{title}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none", background: "transparent", cursor: "pointer",
              fontSize: "1.1rem", color: "#533178", lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {error ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
            Couldn't load this ebook.
          </div>
        ) : doc === null ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
            Loading…
          </div>
        ) : (
          <iframe
            srcDoc={doc}
            title={title}
            sandbox="allow-scripts"
            style={{ flex: 1, border: "none", width: "100%" }}
          />
        )}
      </div>
    </div>
  );
} 