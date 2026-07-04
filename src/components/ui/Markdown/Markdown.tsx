import { type ReactNode } from "react";
import { inline } from "./inline";

/**
 * Markdown — a tiny, dependency-free renderer for the subset of markdown our
 * product content uses: ## / ### headings, > blockquotes, - bullet lists,
 * **bold** inline, and paragraphs. The top-level # H1 is skipped (the page
 * hero already shows the title).
 */

export default function Markdown({
  source,
  className = "",
}: {
  source: string;
  className?: string;
}) {
  const out: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let quote: string[] = [];
  let k = 0;

  const flushPara = () => {
    if (para.length) {
      out.push(<p key={`p${k++}`}>{inline(para.join(" "), `p${k}`)}</p>);
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      out.push(
        <ul key={`u${k++}`}>
          {list.map((li, i) => (
            <li key={i}>{inline(li, `u${k}-${i}`)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      out.push(
        <blockquote key={`q${k++}`}>{inline(quote.join(" "), `q${k}`)}</blockquote>
      );
      quote = [];
    }
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushQuote();
  };

  for (const raw of source.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushAll();
      continue;
    }
    if (line.startsWith("# ")) {
      flushAll();
      continue; // skip H1 — the page hero shows the title
    }
    if (line.startsWith("### ")) {
      flushAll();
      out.push(<h3 key={`h${k++}`}>{inline(line.slice(4), `h${k}`)}</h3>);
      continue;
    }
    if (line.startsWith("## ")) {
      flushAll();
      out.push(<h2 key={`h${k++}`}>{inline(line.slice(3), `h${k}`)}</h2>);
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara();
      flushList();
      quote.push(line.slice(2));
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      flushQuote();
      list.push(line.slice(2));
      continue;
    }
    flushList();
    flushQuote();
    para.push(line);
  }
  flushAll();

  return <div className={`markdown ${className}`.trim()}>{out}</div>;
}
