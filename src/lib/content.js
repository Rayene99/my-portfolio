import matter from "gray-matter";

const projectFiles  = import.meta.glob("/content/projects/*.md",   { eager: true, as: "raw" });
const ebookFiles    = import.meta.glob("/content/ebooks/*.md",     { eager: true, as: "raw" });
const expFiles      = import.meta.glob("/content/experience/*.md", { eager: true, as: "raw" });
const blogFiles     = import.meta.glob("/content/blogs/*.md",      { eager: true, as: "raw" });
const heroFile      = import.meta.glob("/content/hero/index.md",   { eager: true, as: "raw" });
const cvFile        = import.meta.glob("/content/cv/index.md",     { eager: true, as: "raw" });

function parseFiles(files) {
  return Object.values(files).map((raw) => {
    const { data, content } = matter(raw);
    return { ...data, body: content };
  });
}

function parseSingle(files) {
  const raw = Object.values(files)[0];
  if (!raw) return null;
  const { data, content } = matter(raw);
  return { ...data, body: content };
}

export const projects   = parseFiles(projectFiles);
export const ebooks     = parseFiles(ebookFiles);
export const experience = parseFiles(expFiles);
export const blogs      = parseFiles(blogFiles).sort((a, b) => new Date(b.date) - new Date(a.date));
export const hero       = parseSingle(heroFile);
export const cv         = parseSingle(cvFile);