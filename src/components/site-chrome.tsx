"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/cms";
import { FloatingActions } from "./floating-actions";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteChrome({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <><SiteHeader phone={settings.phone} email={settings.email} tagline={settings.tagline} /><div id="main-content">{children}</div><SiteFooter settings={settings} /><FloatingActions whatsappNumber={settings.whatsappNumber || settings.phone} /></>;
}
