import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { ResourcesSection } from "@/components/home-sections";
import { PageHero } from "@/components/ui";
import { getArticles } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("blog"); }

export default async function BlogPage() {
  const articles = await getArticles("Education hub page");
  return <main><PageHero {...(await getPageHero("blog"))} /><ResourcesSection articles={articles} all /></main>;
}
