"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import gsap from "gsap";
import type { AccordionItemData } from "./Accordion";

type AccordionItemProps = {
  item: AccordionItemData;
  isOpen: boolean;
  headerId: string;
  panelId: string;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  registerHeader: (el: HTMLButtonElement | null) => void;
};

export default function AccordionItem({
  item,
  isOpen,
  headerId,
  panelId,
  onToggle,
  onKeyDown,
  registerHeader,
}: AccordionItemProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // Skip the open/close tween on the very first render (initial state).
  const mountedRef = useRef(false);

  useEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // First render: set the resting state with no animation.
    if (!mountedRef.current) {
      mountedRef.current = true;
      gsap.set(panel, { height: isOpen ? "auto" : 0 });
      gsap.set(inner, { autoAlpha: isOpen ? 1 : 0 });
      return;
    }

    if (reduced) {
      gsap.set(panel, { height: isOpen ? "auto" : 0 });
      gsap.set(inner, { autoAlpha: isOpen ? 1 : 0 });
      return;
    }

    gsap.killTweensOf([panel, inner]);

    // Same duration + ease for open and close, so when one item closes while
    // another opens (the swap), they travel together smoothly.
    if (isOpen) {
      gsap.set(panel, { height: "auto" });
      gsap.from(panel, {
        height: 0,
        duration: 0.45,
        ease: "power2.inOut",
      });
      gsap.to(inner, { autoAlpha: 1, duration: 0.35, delay: 0.06 });
    } else {
      gsap.to(inner, { autoAlpha: 0, duration: 0.2 });
      gsap.to(panel, {
        height: 0,
        duration: 0.45,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className={`accordion__item ${isOpen ? "is-open" : ""}`.trim()}>
      <h3 className="accordion__heading">
        <button
          ref={registerHeader}
          id={headerId}
          type="button"
          className="accordion__trigger"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={onKeyDown}
        >
          <span className="accordion__titles">
            {item.eyebrow ? (
              <span className="accordion__eyebrow">{item.eyebrow}</span>
            ) : null}
            <span className="accordion__title">{item.title}</span>
          </span>
          {item.meta ? (
            <span className="accordion__meta">{item.meta}</span>
          ) : null}
          <span className="accordion__icon" aria-hidden="true">
            {/* Rotating shuriken: plus by default, turns to a cross when open. */}
            <svg
              className="accordion__shuriken"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="accordion__panel"
        hidden={false}
      >
        <div ref={innerRef} className="accordion__panel-inner">
          {item.content}
        </div>
      </div>
    </div>
  );
}
