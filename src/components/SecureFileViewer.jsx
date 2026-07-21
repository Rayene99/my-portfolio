import { useEffect, useState } from "react";
import mammoth from "mammoth";

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

  // Prevent any link click from navigating the iframe away from the book.
  // Pure #anchor links (table of contents, chapter jumps) still work via
  // smooth scroll; anything else is blocked to stop the book from
  // navigating out and loading the parent site instead.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id) || document.getElementsByName(id)[0];
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else {
      e.preventDefault();
    }
  }, true);
</script>
`;

// Minimal readable shell for converted docx content, since mammoth only
// returns body-level HTML (no <head>, no styling of its own).
const DOCX_SHELL = (bodyHtml) => `
<html>
  <head>
    <style>
      body {
        font-family: Georgia, 'Times New Roman', serif;
        color: #222;
        line-height: 1.65;
        max-width: 780px;
        margin: 0 auto;
        padding: 2.5rem 1.5rem 4rem;
      }
      img { max-width: 100%; height: auto; }
      table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
      table, th, td { border: 1px solid #ddd; }
      th, td { padding: 0.5rem 0.75rem; text-align: left; }
      h1, h2, h3, h4 { font-family: inherit; line-height: 1.3; }
    </style>
  </head>
  <body>${bodyHtml}</body>
</html>
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
  const isDocx = ext === "docx";
  const isLegacyDoc = ext === "doc"; // old binary .doc — mammoth can't read this
  const isImage = IMAGE_EXTENSIONS.includes(ext);
  const isPdf = ext === "pdf";
  const needsInjectedDoc = isHtml || isDocx;

  useEffect(() => {
    // Only HTML and docx need the fetch-and-inject treatment
    if (!needsInjectedDoc) {
      setDoc(null);
      setError(false);
      return;
    }

    let cancelled = false;
    setDoc(null);
    setError(false);

    // Only route through the proxy for external URLs (e.g. GitHub Releases),
    // which need it to bypass CORS. Local files (same-origin, e.g. /images/...)
    // are fetched directly — no CORS issue, no need for the proxy.
    const isExternal = /^https?:\/\//i.test(src);
    const fetchUrl = isExternal
      ? `/api/proxy-ebook?url=${encodeURIComponent(src)}`
      : src;

    if (isHtml) {
      fetch(fetchUrl)
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
    } else if (isDocx) {
      fetch(fetchUrl)
        .then((res) => {
          if (!res.ok) throw new Error("fetch failed");
          return res.arrayBuffer();
        })
        .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
        .then((result) => {
          if (cancelled) return;
          const shell = DOCX_SHELL(result.value);
          const injected = shell.replace(/<\/head>/i, `${PROTECTION_SNIPPET}</head>`);
          setDoc(injected);
        })
        .catch(() => { if (!cancelled) setError(true); });
    }

    return () => { cancelled = true; };
  }, [src, isHtml, isDocx, needsInjectedDoc]);

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
    if (needsInjectedDoc) {
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

    if (isLegacyDoc) {
      return (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem",
          alignItems: "center", justifyContent: "center", color: "#9ca3af",
          fontFamily: "var(--font-mono)", fontSize: "0.8rem", textAlign: "center", padding: "2rem",
        }}>
          <span>Legacy .doc files can't be previewed here — please re-save as .docx.</span>
        </div>
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
