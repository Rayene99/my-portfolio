import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

import matter from "gray-matter";

const experienceFiles    = import.meta.glob("../../content/experience/*.md",    { eager: true, query: '?raw', import: 'default' });
const projectFiles       = import.meta.glob("../../content/projects/*.md",      { eager: true, query: '?raw', import: 'default' });
const ebookFiles         = import.meta.glob("../../content/ebooks/*.md",        { eager: true, query: '?raw', import: 'default' });
const heroFile           = import.meta.glob("../../content/hero/index.md",      { eager: true, query: '?raw', import: 'default' });
const cvFile             = import.meta.glob("../../content/cv/index.md",        { eager: true, query: '?raw', import: 'default' });
const testimonialFiles   = import.meta.glob("../../content/testimonials/*.md",  { eager: true, query: '?raw', import: 'default' });

// ← Add this: grab every image in assets
const imageAssets = import.meta.glob("../../assets/**/*.{jpg,jpeg,png,webp,avif,svg}", {
  eager: true,
  import: 'default',
});

// Resolve a relative path like "../assets/profile-pic.jpg" to a bundled URL
function resolveAsset(relativePath) {
  if (!relativePath) return null;
  // Normalize to the same format as the glob keys
  const key = relativePath.replace(/^\.\.\//, "../../content/testimonials/../");
  // Try direct match first, then search by filename
  if (imageAssets[key]) return imageAssets[key];
  const filename = relativePath.split("/").pop();
  const match = Object.entries(imageAssets).find(([k]) => k.endsWith("/" + filename));
  return match ? match[1] : null;
}

function parseAll(files) {
  return Object.values(files).map((raw) => {
    const { data, content } = matter(raw);
    return { ...data, body: content.trim() };
  });
}

function parseWithAssets(files) {
  return Object.values(files).map((raw) => {
    const { data, content } = matter(raw);
    return {
      ...data,
      avatar: resolveAsset(data.avatar), // ← resolves to real bundled URL
      body: content.trim(),
    };
  });
}

export const hero         = parseAll(heroFile)[0];
export const experience   = parseAll(experienceFiles);
export const projects     = parseAll(projectFiles);
export const ebooks       = parseAll(ebookFiles);
export const cv           = parseAll(cvFile)[0];
export const testimonials = parseWithAssets(testimonialFiles); // ← use new parser