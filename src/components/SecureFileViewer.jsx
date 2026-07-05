import { useEffect, useRef } from "react";

export default function SecureFileViewer({ src, title, onClose }) {
  const iframeRef = useRef(null);

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

  function handleIframeLoad() {
    try {
      const doc = iframeRef.current.contentDocument;
      if (!doc) return;
      doc.addEventListener("contextmenu", (e) => e.preventDefault());
      doc.addEventListener("keydown", (e) => {
        const key = e.key?.toLowerCase();
        const blocked = (e.ctrlKey || e.metaKey) && ["s", "p", "u", "c"].includes(key);
        if (blocked) e.preventDefault();
      });
      doc.body.style.userSelect = "none";
      doc.body.style.webkitUserSelect = "none";
    } catch (err) {
      // Ignore — some environments restrict contentDocument access
    }
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
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          onLoad={handleIframeLoad}
          sandbox="allow-scripts"
          style={{ flex: 1, border: "none", width: "100%" }}
        />
      </div>
    </div>
  );
}