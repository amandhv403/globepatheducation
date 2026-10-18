import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Compass } from "lucide-react";
import type { Slide } from "@/lib/slides";
import { ImageSlider } from "./image-slider";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Globepath Education Advisory home">
      <span className={`brand-mark ${light ? "brand-mark-light" : ""}`} aria-hidden="true">
        <Compass size={23} strokeWidth={1.7} />
      </span>
      <span className="brand-type">
        <strong className={light ? "text-white" : ""}>GLOBEPATH</strong>
        <small className={light ? "text-white/65" : ""}>Education Advisory</small>
      </span>
    </Link>
  );
}

export function ButtonLink({ href, children, variant = "primary", className = "", arrow = false }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "light" | "text"; className?: string; arrow?: boolean }) {
  return (
    <Link href={href} className={`button button-${variant} ${className}`}>
      <span>{children}</span>{arrow && <ArrowRight size={17} aria-hidden="true" />}
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, body, align = "left", action }: { eyebrow?: string; title: string; body?: string; align?: "left" | "center"; action?: ReactNode }) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {body && <p className="section-intro">{body}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children, slides, interval = 6000 }: { eyebrow: string; title: string; intro: string; children?: ReactNode; slides?: Slide[]; interval?: number }) {
  const hasSlides = Boolean(slides?.length);
  return (
    <section className={`page-hero ${hasSlides ? "page-hero-slides" : ""}`}>
      {hasSlides && <div className="page-hero-bg" aria-hidden={false}><ImageSlider slides={slides!} interval={interval} priority sizes="100vw" label={`${title} banner images`} /></div>}
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
          {children && <div className="page-hero-actions">{children}</div>}
        </div>
        <div className="page-hero-motif" aria-hidden="true">
          <span>Profile</span><i /><span>Pathway</span><i /><span>Progress</span>
        </div>
      </div>
    </section>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <div className="disclaimer"><span aria-hidden="true">i</span><p>{children}</p></div>;
}

export function EmptyStoryCard() {
  return (
    <article className="story-card">
      <div className="story-avatar" aria-hidden="true">—</div>
      <p className="story-label">Verified story placeholder</p>
      <h3>Real student story will appear here.</h3>
      <p>Student, previous education, destination, university, program, intake and a verified journey summary will be published only with permission.</p>
    </article>
  );
}
