import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Load the pdf.js worker from a CDN matching the installed package version.
// (Works regardless of bundler — no bundler-specific "?url" import needed.)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

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

/*
 * Renders every page of a PDF onto its own <canvas>, inside our own DOM.
 * Because it's plain pixels on a canvas we own (not the browser's native
 * PDF plugin in an iframe), the modal's onContextMenu/onDragStart handlers
 * actually apply to it — there's no separate native toolbar or right-click
 * "Save as" to work around.
 */
function PdfCanvasViewer({ src }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | error | done

  useEffect(() => {
    let cancelled = false;
    let pdfDoc = null;

    async function render() {
      setStatus("loading");
      try {
        pdfDoc = await pdfjsLib.getDocument(src).promise;
        if (cancelled) return;

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = "";

        const containerWidth = container.clientWidth || 760;

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (cancelled) return;

          const page = await pdfDoc.getPage(pageNum);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / baseViewport.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.display = "block";
          canvas.style.width = "100%";
          canvas.style.marginBottom = "10px";
          canvas.style.borderRadius = "4px";
          canvas.style.boxShadow = "0 1px 6px rgba(0,0,0,0.15)";
          canvas.draggable = false;

          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;

          if (cancelled) return;
          container.appendChild(canvas);
        }

        if (!cancelled) setStatus("done");
      } catch (err) {
        if (!cancelled) setStatus("error");
      }
    }

    render();

    return () => {
      cancelled = true;
      if (pdfDoc) pdfDoc.destroy();
    };
  }, [src]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        flex: 1, overflow: "auto", background: "#f4efe7",
        padding: "1rem", userSelect: "none", WebkitUserSelect: "none",
      }}
    >
      {status === "loading" && (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>Loading…</div>
      )}
      {status === "error" && (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>Couldn't load this file.</div>
      )}
      <div ref={containerRef} style={{ maxWidth: "760px", margin: "0 auto" }} />
    </div>
  );
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
      // Rendered page-by-page onto <canvas> elements in our own DOM
      // (via pdf.js) instead of the browser's native PDF plugin in an
      // iframe. The native viewer's toolbar/context-menu lived outside
      // our DOM and couldn't be blocked; canvas pixels can.
      return <PdfCanvasViewer src={src} />;
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