import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { ButtonLink, Disclaimer, PageHero } from "@/components/ui";
import { getArticlePage, getArticles, getSliderInterval } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };
type Block = { kind: "heading" | "paragraph" | "list"; text: string; items: string[] };

function parseBody(body: string): Block[] {
  return body.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean).map<Block>((chunk) => {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.every((line) => line.startsWith("-"))) return { kind: "list", text: "", items: lines.map((line) => line.replace(/^-\s*/, "")) };
    if (lines[0]?.startsWith("##")) return { kind: "heading", text: lines[0].replace(/^#+\s*/, ""), items: [] };
    return { kind: "paragraph", text: lines.join(" "), items: [] };
  });
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.kind === "heading") return <h2 style={{ fontSize: 38, marginTop: 45 }}>{block.text}</h2>;
  if (block.kind === "list") return <ul className="list-checks">{block.items.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>;
  return <p style={{ marginTop: 18 }}>{block.text}</p>;
}

export async function generateStaticParams() { return (await getArticles()).map((article) => ({ slug: article.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getArticlePage(slug);
  if (!page) return {};
  return { title: page.seoTitle || page.item.title, description: page.seoDescription || page.item.excerpt, alternates: { canonical: `/blog/${page.item.slug}` } };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const page = await getArticlePage(slug);
  if (!page) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: page.item.title, description: page.item.excerpt, articleSection: page.item.category, author: { "@type": "Organization", name: "Globepath Education Advisory" }, publisher: { "@type": "Organization", name: "Globepath Education Advisory" } };
  return <main><PageHero eyebrow={`${page.item.category} · ${page.item.readTime}`} title={page.item.title} intro={page.item.excerpt} slides={page.slides} interval={await getSliderInterval()} /><article className="internal-section"><div className="container" style={{ maxWidth: 820 }}><Link href="/blog" className="button button-text"><ArrowLeft size={15} /> Back to education hub</Link><div className="prose" style={{ marginTop: 45 }}>{parseBody(page.body).map((block, index) => <BlockRenderer block={block} key={index} />)}<Disclaimer>This resource provides general education-planning information. It is not a promise of admission, funding or visa approval and should not replace current official guidance.</Disclaimer><div style={{ marginTop: 40 }}><ButtonLink href="/contact">Discuss this with an advisor</ButtonLink></div></div></div></article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></main>;
}
