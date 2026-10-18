import { ArrowDown, CheckCircle2, MessageCircle } from "lucide-react";
import { ImageSlider } from "@/components/image-slider";
import { AssessmentCallout, ConsultationSection, DestinationsSection, EventsSection, FinderSection, JourneySection, ParentSection, ResourcesSection, ScholarshipSection, ServicesSection, StoriesSection, TrustRail, UniversitySection, VisaSection, WhySection } from "@/components/home-sections";
import { ButtonLink } from "@/components/ui";
import { getArticles, getDestinations, getEvents, getScholarshipCategories, getServices, getSiteSettings, getSliderInterval, getSlides, getStories, getUniversities, lines } from "@/lib/cms";

const HOME = "Homepage";

export default async function HomePage() {
  const [s, services, destinations, finderDestinations, universities, categories, articles, events, stories, heroSlides, interval] = await Promise.all([
    getSiteSettings(), getServices(HOME), getDestinations(HOME), getDestinations("Destination finder"), getUniversities(HOME), getScholarshipCategories(HOME), getArticles(HOME), getEvents(HOME), getStories(HOME),
    getSlides("heroSlides", "International study campus"), getSliderInterval(),
  ]);
  return (
    <main>
      <section className="hero">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span /> {s.heroEyebrow}</p>
            <h1>{s.heroTitle} <em>{s.heroHighlight}</em></h1>
            <p className="hero-intro">{s.heroIntro}</p>
            <div className="hero-actions"><ButtonLink href="/contact" arrow>Book a consultation</ButtonLink><ButtonLink href="/study-abroad" variant="secondary" arrow>Explore study destinations</ButtonLink></div>
            <div className="hero-trust">{lines(s.heroBadges).map((badge) => <span key={badge}><CheckCircle2 size={16} /> {badge}</span>)}</div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap"><ImageSlider slides={heroSlides} interval={interval} priority sizes="(max-width: 900px) 100vw, 46vw" label="International campus photos" /></div>
            {(s.heroNoteTitle || s.heroNoteText) && <div className="hero-note"><span>01</span><p><strong>{s.heroNoteTitle}</strong>{s.heroNoteText}</p></div>}
            {s.heroChip && <div className="hero-chat"><MessageCircle size={18} /><span>{s.heroChip}</span></div>}
          </div>
        </div>
        <a className="scroll-cue" href="#services" aria-label="Continue to services"><ArrowDown size={17} /></a>
      </section>
      <TrustRail />
      {services.length > 0 && <ServicesSection services={services} />}
      {destinations.length > 0 && <DestinationsSection destinations={destinations} />}
      {finderDestinations.length > 0 && <FinderSection destinations={finderDestinations} />}
      <AssessmentCallout />
      <VisaSection />
      <JourneySection />
      {universities.length > 0 && <UniversitySection universities={universities} />}
      {categories.length > 0 && <ScholarshipSection categories={categories} />}
      <ParentSection />
      <WhySection />
      <StoriesSection stories={stories} />
      {articles.length > 0 && <ResourcesSection articles={articles} />}
      {events.length > 0 && <EventsSection events={events} />}
      <ConsultationSection />
    </main>
  );
}
