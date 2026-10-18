import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteChrome } from "@/components/site-chrome";
import { getSiteSettings } from "@/lib/cms";
import "./globals.css";
import "./admin.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#102f46" };

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = settings.siteUrl;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.seoTitle || settings.companyName, template: `%s | ${settings.companyName}` },
    description: settings.seoDescription,
    keywords: ["study abroad Bangladesh", "education consultancy Bangladesh", "student visa guidance", "university application support", "study abroad counselling"],
    openGraph: { title: settings.seoTitle || settings.companyName, description: settings.seoDescription, type: "website", locale: "en_BD", siteName: settings.companyName, images: [{ url: "/images/campus-students.jpg", width: 1200, height: 630, alt: `${settings.companyName} — international education advisory` }] },
    twitter: { card: "summary_large_image", title: settings.seoTitle || settings.companyName, description: settings.seoDescription, images: ["/images/campus-students.jpg"] },
    alternates: { canonical: "/" },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const organisationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.companyName,
    description: settings.seoDescription,
    telephone: settings.phone,
    email: settings.email,
    address: settings.officeAddress,
    areaServed: "Bangladesh",
    url: settings.siteUrl,
  };
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteChrome settings={settings}>{children}</SiteChrome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }} />
      </body>
    </html>
  );
}
