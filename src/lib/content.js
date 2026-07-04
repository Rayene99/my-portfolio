import matter from "gray-matter";
import { marked } from "marked";

const projectFiles     = import.meta.glob("/content/projects/*.md",     { eager: true, query: "?raw", import: "default" });
const ebookFiles       = import.meta.glob("/content/ebooks/*.md",       { eager: true, query: "?raw", import: "default" });
const expFiles         = import.meta.glob("/content/experience/*.md",   { eager: true, query: "?raw", import: "default" });
const blogFiles        = import.meta.glob("/content/blogs/*.md",        { eager: true, query: "?raw", import: "default" });
const testimonialFiles = import.meta.glob("/content/testimonials/*.md", { eager: true, query: "?raw", import: "default" });
const heroFile          = import.meta.glob("/content/hero/index.md",    { eager: true, query: "?raw", import: "default" });
const cvFile             = import.meta.glob("/content/cv/index.md",     { eager: true, query: "?raw", import: "default" });

function parseFiles(files) {
  return Object.values(files).map((raw) => {
    const { data, content } = matter(raw);
    return { ...data, body: marked(content) };
  });
}

function parseSingle(files) {
  const raw = Object.values(files)[0];
  if (!raw) return null;
  const { data, content } = matter(raw);
  return { ...data, body: marked(content) };
}

export const projects     = parseFiles(projectFiles);
export const ebooks       = parseFiles(ebookFiles);
export const experience   = parseFiles(expFiles);
export const blogs        = parseFiles(blogFiles).sort((a, b) => new Date(b.date) - new Date(a.date));
export const testimonials = parseFiles(testimonialFiles);
export const hero         = parseSingle(heroFile);
export const cv           = parseSingle(cvFile);