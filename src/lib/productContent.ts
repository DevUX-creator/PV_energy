import fs from "node:fs";
import path from "node:path";

/**
 * Load a product's long-form markdown body from docs/content/products/<slug>.md,
 * stripping the YAML frontmatter. Read at build time (product pages are SSG).
 * Returns null if the file doesn't exist.
 */
export function getProductContent(slug: string): string | null {
  try {
    const file = path.join(
      process.cwd(),
      "docs/content/products",
      `${slug}.md`
    );
    const raw = fs.readFileSync(file, "utf8");
    const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
    return body || null;
  } catch {
    return null;
  }
}

/* ---- Structured parse (for the sectioned product layout) ---------------- */

export type PBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };
export type PSection = { title: string; blocks: PBlock[] };
export type ProductDoc = { lead: string | null; sections: PSection[] };

/**
 * Parse a product markdown body into a one-line lead (the blockquote) and a
 * list of sections (each ## heading with its paragraphs and bullet lists).
 * The # H1 is dropped (the page hero shows the title).
 */
export function parseProductDoc(md: string): ProductDoc {
  const leadBuf: string[] = [];
  const sections: PSection[] = [];
  let cur: PSection | null = null;
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length && cur) cur.blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list.length && cur) cur.blocks.push({ type: "ul", items: list.slice() });
    list = [];
  };
  const flush = () => {
    flushPara();
    flushList();
  };

  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    if (line.startsWith("# ")) {
      flush();
      continue;
    }
    if (line.startsWith("> ")) {
      leadBuf.push(line.slice(2));
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      cur = { title: line.slice(3), blocks: [] };
      sections.push(cur);
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      list.push(line.slice(2));
      continue;
    }
    flushList();
    para.push(line);
  }
  flush();

  return { lead: leadBuf.length ? leadBuf.join(" ") : null, sections };
}
