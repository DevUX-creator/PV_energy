"use client";

/**
 * Accordion — generic expand/collapse list. NET-NEW foundational
 * component (none existed in the reference projects); built because the
 * client explicitly wants BB-Energy-style accordions for the office
 * locations and the traded-products / fertilizer departments.
 *
 * Features:
 *   - controlled-or-uncontrolled open state
 *   - single-open (default) or `allowMultiple`
 *   - GSAP height + opacity animation, reduced-motion aware
 *   - accessible: header <button> with aria-expanded/aria-controls,
 *     panel region with aria-labelledby; arrow / Home / End key nav
 *
 * Reused by the Offices and Products sections during section polish.
 */

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import AccordionItem from "./AccordionItem";
import "./accordion.css";

export type AccordionItemData = {
  id: string;
  title: ReactNode;
  /** Small uppercase label shown above/beside the title (optional). */
  eyebrow?: ReactNode;
  /** Compact meta shown on the header row when collapsed (optional). */
  meta?: ReactNode;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItemData[];
  /** Allow more than one panel open at once. Default false (single-open). */
  allowMultiple?: boolean;
  /** Item ids open on first render (uncontrolled). */
  defaultOpen?: string[];
  className?: string;
};

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = "",
}: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(defaultOpen)
  );
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  const onHeaderKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = items.length - 1;
      let target = -1;
      switch (event.key) {
        case "ArrowDown":
          target = index === last ? 0 : index + 1;
          break;
        case "ArrowUp":
          target = index === 0 ? last : index - 1;
          break;
        case "Home":
          target = 0;
          break;
        case "End":
          target = last;
          break;
        default:
          return;
      }
      event.preventDefault();
      headerRefs.current[target]?.focus();
    },
    [items.length]
  );

  return (
    <div className={`accordion ${className}`.trim()}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          headerId={`${baseId}-h-${item.id}`}
          panelId={`${baseId}-p-${item.id}`}
          onToggle={() => toggle(item.id)}
          onKeyDown={(e) => onHeaderKeyDown(e, index)}
          registerHeader={(el) => {
            headerRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}
