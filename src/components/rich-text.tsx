import { Check } from "lucide-react";

type Block = { kind: "heading" | "paragraph" | "list"; text: string; items: string[] };

export function parseRichText(body: string): Block[] {
  return body.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean).map<Block>((chunk) => {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.every((line) => line.startsWith("-"))) return { kind: "list", text: "", items: lines.map((line) => line.replace(/^-\s*/, "")) };
    if (lines[0]?.startsWith("##")) return { kind: "heading", text: lines[0].replace(/^#+\s*/, ""), items: [] };
    return { kind: "paragraph", text: lines.join(" "), items: [] };
  });
}

/** Renders admin-written text: blank line = paragraph, "## " = heading, "- " = bullet list. */
export function RichText({ body, leadFirst = false }: { body: string; leadFirst?: boolean }) {
  return <div className="prose rich-text">{parseRichText(body).map((block, index) => {
    if (block.kind === "heading") return <h3 key={index} className="rich-heading">{block.text}</h3>;
    if (block.kind === "list") return <ul className="list-checks" key={index}>{block.items.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>;
    return <p key={index} className={leadFirst && index === 0 ? "prose-lead" : undefined}>{block.text}</p>;
  })}</div>;
}
