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

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"];

function getExtension(src) {
  if (!src) return "";
  const clean = src.split("?")[0].split("#")[0];
  const parts = clean.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export default function SecureFileViewer({ src, title, onClose }) {
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(false);

  const ext = getExtension(src);
  const isHtml = ext === "html" || ext === "htm";
  const isImage = IMAGE_EXTENSIONS.includes(ext);
  const isPdf = ext === "pdf";

  useEffect(() => {
    // Only HTML files need the fetch-and-inject treatment
    if (!isHtml) {
      setDoc(null);
      setError(false);
      return;
    }

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
          : PROTECTION_SNIPPET + html;
        setDoc(injected);
      })
      .catch(() => { if (!cancelled) setError(true); });

    return () => { cancelled = true; };
  }, [src, isHtml]);

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

  function renderContent() {
    if (isHtml) {
      if (error) {
        return (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
            Couldn't load this file.
          </div>
        );
      }
      if (doc === null) {
        return (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
            Loading…
          </div>
        );
      }
      return (
        <iframe
          srcDoc={doc}
          title={title}
          sandbox="allow-scripts"
          style={{ flex: 1, border: "none", width: "100%" }}
        />
      );
    }

    if (isImage) {
      // Rendered directly in our own DOM (not an iframe), so the
      // contextmenu/dragstart/select-none handlers on the wrapper below
      // apply to it natively — no injection needed.
      return (
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f4efe7", overflow: "auto", padding: "1rem",
        }}>
          <img
            src={src}
            alt={title}
            draggable={false}
            style={{
              maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
              userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none",
            }}
          />
        </div>
      );
    }

    if (isPdf) {
      // Browsers render PDFs with their own native viewer (own toolbar,
      // own download/print buttons) that lives outside our DOM entirely —
      // no script or CSS here can reach or restrict it. Hiding the native
      // toolbar via URL params is the only lever available, and it is
      // easily bypassed (e.g. browser's own PDF menu, dev tools, or just
      // re-adding #toolbar=1 to the URL). This is a light deterrent only.
      return (
        <iframe
          src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
          title={title}
          style={{ flex: 1, border: "none", width: "100%" }}
        />
      );
    }

    // Unrecognized file type — no safe way to render/protect it inline.
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem",
        alignItems: "center", justifyContent: "center", color: "#9ca3af",
        fontFamily: "var(--font-mono)", fontSize: "0.8rem", textAlign: "center", padding: "2rem",
      }}>
        <span>This file type can't be previewed here.</span>
      </div>
    );
  }

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

        {renderContent()}
      </div>
    </div>
  );
}