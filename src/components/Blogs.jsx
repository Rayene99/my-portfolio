import { useState } from "react";
import { blogs } from "../lib/content";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function ArticleNavButton({ article, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative bg-transparent border-none cursor-pointer text-left py-[0.45rem] w-full transition-colors duration-200"
    >
      {active && (
        <span
          className="absolute right-[-2rem] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-sm"
          style={{ background: "linear-gradient(180deg, #5D4480, #B8709C)" }}
        />
      )}
      <span className={`block font-mono text-[0.72rem] tracking-[0.1em] uppercase transition-colors duration-200
        ${active ? "text-[#533178] font-bold" : "text-[#9ca3af] font-normal hover:text-[#533178]"}`}>
        {article.title}
      </span>
      <span className={`block font-mono text-[0.6rem] tracking-[0.07em] mt-[2px] transition-colors duration-200
        ${active ? "text-[#7c5cbf]" : "text-[#c4b5d0]"}`}>
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

        {article.excerpt && (
          <p className="font-body text-base leading-[1.75] text-[#533178] italic border-l-[3px] border-[#B8709C] pl-4 mb-8">
            {article.excerpt}
          </p>
        )}

        {article.cover && (
          <img
            src={article.cover}
            alt={article.title}
            style={{ width: "100%", borderRadius: "12px", marginBottom: "2rem", objectFit: "cover", maxHeight: "360px" }}
          />
        )}

        <hr className="border-0 border-t border-gray-200 my-6" />
      </div>

      {/* Body — rendered as markdown HTML */}
      <div
        className="font-body text-[0.95rem] leading-[1.85] text-[#374151]"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      <style>{`
        @keyframes articleFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        article h1, article h2, article h3 {
          font-family: var(--font-heading);
          font-style: italic;
          font-weight: 600;
          color: #533178;
          margin: 2rem 0 0.75rem;
        }
        article h1 { font-size: 1.8rem; }
        article h2 { font-size: 1.5rem; }
        article h3 { font-size: 1.25rem; }
        article p { margin: 0 0 1.2rem; }
        article em { color: #B8709C; font-style: italic; }
        article strong { color: #111; font-weight: 600; }
        article a { color: #7c5cbf; }
        article img { max-width: 100%; border-radius: 10px; margin: 1.5rem 0; }
        article ul, article ol { padding-left: 1.5rem; margin-bottom: 1.2rem; }
        article li { margin-bottom: 0.4rem; }
        article blockquote {
          border-left: 3px solid #B8709C;
          padding-left: 1rem;
          color: #533178;
          font-style: italic;
          margin: 1.5rem 0;
        }
      `}</style>
    </article>
  );
}

export default function ArticlesPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!Array.isArray(blogs) || blogs.length === 0) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <p className="font-mono text-[#9ca3af] text-sm uppercase tracking-widest">No posts yet</p>
    </div>
  );

  const activeArticle = blogs[activeIndex];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div style={{ background: "linear-gradient(160deg, #5D4480 0%, #8B6BAE 40%, #B8709C 70%, #D4849A 100%)" }}>
        <div className="max-w-[1100px] mx-auto px-8 py-4 mb-6 flex items-center">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">Writing</span>
            <h1 className="font-heading italic font-semibold text-5xl text-white leading-tight m-0 py-2">Blogs</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-8 pb-24 grid grid-cols-[200px_1fr] gap-0 items-start">
        <aside className="sticky top-20 pr-8 border-r border-[rgba(93,68,128,0.18)] self-start">
          <nav className="flex flex-col gap-[0.15rem]">
            <p className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-[#9ca3af] mb-3 m-0">
              {blogs.length} post{blogs.length !== 1 ? "s" : ""}
            </p>
            {blogs.map((article, i) => (
              <ArticleNavButton
                key={i}
                article={article}
                active={i === activeIndex}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </nav>
        </aside>

        <main className="pl-10 pt-1">
          <ArticleViewer key={activeIndex} article={activeArticle} />
        </main>
      </div>
    </div>
  );
}