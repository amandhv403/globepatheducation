import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "./ui";
import type { SiteSettings } from "@/lib/cms";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = [["Facebook", settings.facebookUrl], ["Instagram", settings.instagramUrl], ["LinkedIn", settings.linkedinUrl], ["YouTube", settings.youtubeUrl], ["TikTok", settings.tiktokUrl]] as const;
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Brand light />
          <p>Personalised international education planning, admission guidance, visa support and practical help through arrival.</p>
          <p className="footer-note">{settings.companyName} provides advisory and application support. Admission, scholarships and visas remain subject to independent institutional and government decisions.</p>
          {socials.some(([, url]) => url) && <div className="footer-social">{socials.map(([label, url]) => url ? <a key={label} href={url} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={12} /></a> : null)}</div>}
        </div>
        <div>
          <h2>Plan your study</h2>
          <Link href="/study-abroad">Study destinations</Link>
          <Link href="/universities">Find a university</Link>
          <Link href="/courses">Explore courses</Link>
          <Link href="/scholarships">Scholarship guidance</Link>
          <Link href="/profile-assessment">Profile assessment</Link>
        </div>
        <div>
          <h2>Guidance</h2>
          <Link href="/services">Our services</Link>
          <Link href="/student-visa">Student visa</Link>
          <Link href="/events">Student events</Link>
          <Link href="/blog">Education hub</Link>
          <Link href="/about">About us</Link>
        </div>
        <div className="footer-contact">
          <h2>Speak with us</h2>
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`}><Phone size={16} /> {settings.phone}</a>
          <a href={`mailto:${settings.email}`}><Mail size={16} /> {settings.email}</a>
          <p><MapPin size={16} /> {settings.officeAddress}</p>
          <p><Clock3 size={16} /> {settings.openingHours}</p>
          <Link className="footer-map" href="/contact">Contact & map <ArrowUpRight size={14} /></Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
        <div><Link href="/contact">Privacy</Link><Link href="/contact">Terms</Link><Link href="/contact">Accessibility</Link></div>
      </div>
    </footer>
  );
}
