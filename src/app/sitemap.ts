import type { MetadataRoute } from "next";
import { getArticles, getDestinations, getSiteSettings } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ siteUrl }, destinations, articles] = await Promise.all([getSiteSettings(), getDestinations(), getArticles()]);
  const base = siteUrl.replace(/\/$/, "");
  const pages = ["", "/study-abroad", "/universities", "/courses", "/scholarships", "/services", "/student-visa", "/events", "/blog", "/about", "/contact", "/profile-assessment"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .8 })),
    ...destinations.map((item) => ({ url: `${base}/${item.slug}`, changeFrequency: "monthly" as const, priority: .75 })),
    ...articles.map((item) => ({ url: `${base}/blog/${item.slug}`, changeFrequency: "monthly" as const, priority: .65 })),
  ];
}
