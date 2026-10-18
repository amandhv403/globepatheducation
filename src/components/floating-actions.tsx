import Link from "next/link";
import { CalendarCheck, MessageCircle } from "lucide-react";

export function FloatingActions({ whatsappNumber }: { whatsappNumber: string }) {
  const digits = whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent("Hello Globepath, I would like study abroad guidance.");
  return <>
    <a className="whatsapp-float" href={`https://wa.me/${digits}?text=${text}`} target="_blank" rel="noreferrer" aria-label="Chat with Globepath on WhatsApp"><MessageCircle size={22} /><span>WhatsApp</span></a>
    <div className="mobile-sticky-cta"><Link href="/contact"><CalendarCheck size={18} /> Book consultation</Link></div>
  </>;
}
