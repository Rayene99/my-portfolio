import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { label: "Home",       to: "/",         isRoute: true  },
  { label: "Projects",   to: "/projectPage" , isRoute: true    },
  { label: "Ebooks",     to: "/EbooksPage"  , isRoute: true     },
  { label: "Blog",   to: "/Blogs", isRoute: true  },
  { label: "CV",         to: "/cv", isRoute: true  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function renderLink(link, extraProps = {}) {
    const style = {
      fontFamily: "var(--font-mono)",
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: "#533178",
      textDecoration: "none",
      transition: "opacity 0.2s",
    };

    if (link.isRoute) {
      return (
        <Link to={link.to} style={style} {...extraProps}>
          {link.label}
        </Link>
      );
    }
    // anchor links (hash scrolling) stay as <a>
    return (
      <a href={link.to} style={style} {...extraProps}>
        {link.label}
      </a>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-bg/80 backdrop-blur-md border-b border-border">
      <nav
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          paddingLeft: "0.3rem",
          paddingRight: "1rem",
          paddingTop: "0.3rem",
          paddingBottom: "0.3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#533178",
            textDecoration: "none",
          }}
        >
          Portfolio
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {links.map((link) => (
            <li key={link.to}>
              {renderLink(link)}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-px bg-text block" />
          <span className="w-6 h-px bg-text block" />
          <span className="w-6 h-px bg-text block" />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden flex flex-col gap-4 px-6 pb-6" style={{ listStyle: "none", margin: 0, padding: "0 1.5rem 1.5rem" }}>
          {links.map((link) => (
            <li key={link.to}>
              {renderLink(link, { onClick: () => setOpen(false) })}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}