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
