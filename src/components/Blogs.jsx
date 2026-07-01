import { useState } from "react";

const articles = [
  {
    id: "1",
    title: "Designing for Clarity",
    date: "2024-05-12",
    tags: ["Design", "UX"],
    excerpt: "How reducing cognitive load transforms the user experience.",
    body: `
      <h3>Why clarity matters</h3>
      <p>Every decision a user has to make costs them mental energy. When interfaces demand too much of that energy, they fail — not because the feature is wrong, but because the path to it is unclear.</p>
      <p>The best interfaces feel obvious. Not simple necessarily, but inevitable: after using them once, you can't imagine them working any other way.</p>
      <h3>Principles I keep coming back to</h3>
      <p>Reduce the number of choices at each step. Group related actions. Use whitespace as punctuation. Let hierarchy do the heavy lifting before reaching for color or motion.</p>
      <p>These aren't rules — they're heuristics. Every project breaks at least one of them for good reason. The key is knowing <em>why</em> you're breaking it.</p>
    `,
  },
  {
    id: "2",
    title: "The Case for Slower Iteration",
    date: "2024-03-28",
    tags: ["Process"],
    excerpt: "Why shipping faster isn't always the same as learning faster.",
    body: `
      <h3>Speed vs. signal</h3>
      <p>The move-fast mantra assumes that more releases mean more learning. But if each release is too small to generate a meaningful signal, you're just generating noise faster.</p>
      <p>Slowing down — just enough to let a change breathe before piling another one on top — often produces cleaner data and better decisions.</p>
    `,
  },
  {
    id: "3",
    title: "Typography as Personality",
    date: "2024-01-15",
    tags: ["Design", "Typography"],
    excerpt: "Type is the first thing a reader feels before they read a single word.",
    body: `
      <h3>First impressions happen in milliseconds</h3>
      <p>Before a user reads your headline, they've already formed an impression from its weight, width, and rhythm. Typography is branding before it's legibility.</p>
      <p>Choosing a typeface well means understanding what that face was designed for, and whether your context matches that intention.</p>
      <h3>Pairing is a conversation</h3>
      <p>A good type pairing sets up a dialogue: the display face opens, the body face responds. They should have enough contrast to be distinct, enough harmony to not fight.</p>
    `,
  },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ── Sidebar nav button — identical to CV page style ── */
function ArticleNavButton({ article, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-transparent border-none cursor-pointer text-left py-[0.45rem] w-full transition-colors duration-200`}
    >
      {/* Active indicator bar — same as CV page */}
      {active && (
        <span
          className="absolute right-[-2rem] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-sm"
          style={{ background: "linear-gradient(180deg, #5D4480, #B8709C)" }}
        />
      )}

      {/* Date — monospaced label, same role as CV's section label */}
      <span
        className={`block font-mono text-[0.72rem] tracking-[0.1em] uppercase transition-colors duration-200
          ${active ? "text-[#533178] font-bold" : "text-[#9ca3af] font-normal hover:text-[#533178]"}`}
      >
        {article.title}
      </span>

      {/* Subtitle — the date, quiet beneath */}
      <span
        className={`block font-mono text-[0.6rem] tracking-[0.07em] mt-[2px] transition-colors duration-200
          ${active ? "text-[#7c5cbf]" : "text-[#c4b5d0]"}`}
      >
        {formatDate(article.date)}
      </span>
    </button>
  );
}

function ArticleViewer({ article }) {
  if (!article) return (
    <div className="flex items-center justify-center h-[300px] text-[#9ca3af] font-mono text-[0.8rem] tracking-[0.1em] uppercase">
      Select an article
    </div>
  );

  return (
    <article style={{ animation: "articleFadeIn 0.3s ease both" }}>

      {/* Header */}
      <div className="mb-8">
        {article.tags?.length > 0 && (
          <div className="flex gap-[6px] mb-3">
            {article.tags.map((tag) => (
              <span key={tag} className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[#7c5cbf]">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-heading italic font-semibold text-[clamp(2rem,4vw,2.8rem)] text-[#533178] leading-[1.15] mb-[0.6rem]">
          {article.title}
        </h1>

        <p className="font-mono text-[0.72rem] text-[#9ca3af] tracking-[0.08em] mb-6">
          {formatDate(article.date)}
        </p>

        <p className="font-body text-base leading-[1.75] text-[#533178] italic border-l-[3px] border-[#B8709C] pl-4 mb-8">
          {article.excerpt}
        </p>

        <hr className="border-0 border-t border-gray-200 my-6" />
      </div>

      {/* Body */}
      <div
        className="font-body text-[0.95rem] leading-[1.85] text-[#374151]"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      <style>{`
        @keyframes articleFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        article h3 {
          font-family: var(--font-heading);
          font-style: italic;
          font-weight: 600;
          font-size: 1.35rem;
          color: #533178;
          margin: 2rem 0 0.75rem;
        }
        article p { margin: 0 0 1.2rem; }
        article em { color: #B8709C; font-style: italic; }
        article strong { color: #111; font-weight: 600; }
        article a { color: #7c5cbf; }
        article img { max-width: 100%; border-radius: 10px; margin: 1.5rem 0; }
      `}</style>
    </article>
  );
}

export default function ArticlesPage() {
  const [activeId, setActiveId] = useState(articles[0]?.id ?? null);
  const activeArticle = articles.find((a) => a.id === activeId) ?? null;

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ── Page header ── */}
      <div style={{ background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)" }}>
        <div className="max-w-[1100px] mx-auto px-8 py-4 mb-6 flex items-center">

          {/* Text */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">
              Writing
            </span>
            <h1 className="font-heading italic font-semibold text-5xl text-white leading-tight m-0 py-2">
              Blogs
            </h1>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-[1100px] mx-auto px-8 pb-24 grid grid-cols-[200px_1fr] gap-0 items-start">

        {/* LEFT: sticky nav — CV page style exactly */}
        <aside className="sticky top-20 pr-8 border-r border-[rgba(93,68,128,0.18)] self-start">
          <nav className="flex flex-col gap-[0.15rem]">
            <p className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-[#9ca3af] mb-3 m-0">
              {articles.length} blog{articles.length !== 1 ? "s" : ""}
            </p>
            {articles.map((article) => (
              <ArticleNavButton
                key={article.id}
                article={article}
                active={article.id === activeId}
                onClick={() => setActiveId(article.id)}
              />
            ))}
          </nav>
        </aside>

        {/* RIGHT: article viewer */}
        <main className="pl-10 pt-1">
          <ArticleViewer key={activeId} article={activeArticle} />
        </main>
      </div>
    </div>
  );
}