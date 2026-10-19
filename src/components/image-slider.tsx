"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Slide } from "@/lib/slides";

export type { Slide };

type Props = {
  slides: Slide[];
  interval?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  label?: string;
  showControls?: boolean;
  showCaption?: boolean;
};

export function ImageSlider({ slides, interval = 6000, priority = false, sizes = "100vw", className = "", label = "Image gallery", showControls = true, showCaption = false }: Props) {
  const safeSlides = slides.filter((slide) => slide.src);
  const count = safeSlides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const goTo = useCallback((index: number) => {
    if (!count) return;
    const next = (index + count) % count;
    setActive(next);
    setLoaded((current) => {
      const updated = new Set(current);
      updated.add(next);
      updated.add((next + 1) % count);
      return updated;
    });
  }, [count]);

  const running = count > 1 && !paused && !userPaused && !reducedMotion;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => goTo(active + 1), interval);
    return () => window.clearTimeout(timer);
  }, [running, active, interval, goTo]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
  }
  function onTouchStart(event: TouchEvent) { touchStart.current = event.touches[0]?.clientX ?? null; }
  function onTouchEnd(event: TouchEvent) {
    if (touchStart.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    if (Math.abs(delta) > 45) goTo(active + (delta < 0 ? 1 : -1));
    touchStart.current = null;
  }

  if (!count) return null;

  return (
    <div
      className={`slider ${reducedMotion ? "slider-static" : ""} ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ "--slider-interval": `${interval}ms` } as CSSProperties}
    >
      {safeSlides.map((slide, index) => {
        const isActive = index === active;
        return (
          <div key={`${slide.src}-${index}`} className={`slide ${isActive ? "is-active" : ""}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} aria-hidden={!isActive}>
            {loaded.has(index) && (slide.href ? <a href={slide.href} aria-label={`Open ${slide.alt}`} className="slide-link"><Image src={slide.src} alt={slide.alt} fill sizes={sizes} priority={priority && index === 0} className="slide-image" unoptimized={slide.src.startsWith("/api/") || slide.src.startsWith("http")} /></a> : <Image src={slide.src} alt={slide.alt} fill sizes={sizes} priority={priority && index === 0} className="slide-image" unoptimized={slide.src.startsWith("/api/") || slide.src.startsWith("http")} />)}
            {showCaption && slide.caption && <p className="slide-caption">{slide.caption}</p>}
          </div>
        );
      })}

      {showControls && count > 1 && (
        <div className="slider-controls">
          <button type="button" className="slider-arrow" onClick={() => goTo(active - 1)} aria-label="Previous image"><ChevronLeft size={17} /></button>
          <div className="slider-dots" role="tablist" aria-label="Choose image">
            {safeSlides.map((slide, index) => (
              <button key={`dot-${index}`} type="button" role="tab" aria-selected={index === active} aria-label={`Show image ${index + 1}`} className={`slider-dot ${index === active ? "is-active" : ""} ${index === active && running ? "is-running" : ""}`} onClick={() => goTo(index)}><span /></button>
            ))}
          </div>
          <button type="button" className="slider-arrow" onClick={() => goTo(active + 1)} aria-label="Next image"><ChevronRight size={17} /></button>
          {!reducedMotion && <button type="button" className="slider-arrow slider-pause" onClick={() => setUserPaused((value) => !value)} aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}>{userPaused ? <Play size={14} /> : <Pause size={14} />}</button>}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{`Image ${active + 1} of ${count}: ${safeSlides[active]?.alt}`}</p>
    </div>
  );
}


