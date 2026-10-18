"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Menu, Phone, X } from "lucide-react";
import { Brand, ButtonLink } from "./ui";

const nav = [
  ["Destinations", "/study-abroad"],
  ["Universities", "/universities"],
  ["Courses", "/courses"],
  ["Scholarships", "/scholarships"],
  ["Services", "/services"],
  ["Student Visa", "/student-visa"],
  ["Events", "/events"],
  ["Blog", "/blog"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader({ phone, email, tagline }: { phone: string; email: string; tagline: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <p>{tagline}</p>
          <div>
            <a href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={13} /> {phone}</a>
            <a href={`mailto:${email}`}><Mail size={13} /> {email}</a>
          </div>
        </div>
      </div>
      <div className="nav-shell">
        <div className="container nav-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([label, href]) => <Link key={href} className={pathname === href ? "active" : ""} href={href}>{label}</Link>)}
          </nav>
          <div className="nav-cta"><ButtonLink href="/contact">Book consultation</ButtonLink></div>
          <button className="menu-toggle" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open menu"><Menu /></button>
        </div>
      </div>
      <div className={`mobile-drawer ${open ? "open" : ""}`} id="mobile-navigation" aria-hidden={!open}>
        <button className="drawer-backdrop" onClick={() => setOpen(false)} aria-label="Close menu" />
        <div className="drawer-panel">
          <div className="drawer-head"><Brand /><button onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div>
          <nav aria-label="Mobile navigation">
            <Link href="/">Home</Link>
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <div className="drawer-footer">
            <ButtonLink href="/profile-assessment" variant="primary">Assess my profile</ButtonLink>
            <a href="tel:+8801828547270"><Phone size={16} /> +880 1828 547270</a>
          </div>
        </div>
      </div>
    </header>
  );
}
