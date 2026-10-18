import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ConsultationForm } from "@/components/consultation-form";
import { PageHero } from "@/components/ui";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("contact"); }

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const digits = settings.whatsappNumber || settings.phone;
  return <main><PageHero {...(await getPageHero("contact"))} /><section className="internal-section"><div className="container consultation-grid"><div><p className="eyebrow">Contact Globepath</p><h2>Start where you are.</h2><p className="prose-lead">A useful first conversation can clarify what to research, prepare or reconsider next.</p><div className="info-grid"><article><Phone size={20} /><h3>Phone</h3><p><a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a></p></article><article><MessageCircle size={20} /><h3>WhatsApp</h3><p><a href={`https://wa.me/${digits.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Message our advisor</a></p></article><article><Mail size={20} /><h3>Email</h3><p><a href={`mailto:${settings.email}`}>{settings.email}</a></p></article><article><Clock3 size={20} /><h3>Opening hours</h3><p>{settings.openingHours}</p></article><article className="form-span-2"><MapPin size={20} /><h3>Office</h3><p>{settings.officeAddress}</p></article></div></div><div className="consultation-card" style={{ boxShadow: "0 20px 55px rgba(9,36,56,.12)" }}><ConsultationForm /></div></div></section><section className="internal-section muted"><div className="container"><iframe title={`Map showing the ${settings.companyName} office`} src={settings.mapEmbedUrl} width="100%" height="420" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><p style={{ fontSize: 11, color: "#747e81", marginTop: 10 }}>Update this map anytime from Admin → Site settings → Contact details.</p></div></section></main>;
}
