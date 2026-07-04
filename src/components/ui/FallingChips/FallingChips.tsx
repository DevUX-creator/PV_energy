"use client";

import { useEffect, useRef } from "react";
import "./fallingChips.css";

type FallingChipsProps = {
  /** Labels to render as chips. */
  items: string[];
  /** Delay between each chip dropping, in ms. */
  stagger?: number;
};

/**
 * FallingChips — renders each label as a small physics chip that falls from
 * the top of its container, piles up and can be dragged (Matter.js). The
 * container fills its positioned parent; drop begins when it scrolls into
 * view. Shared by the Services and Products closing CTAs.
 */
export default function FallingChips({ items, stagger = 550 }: FallingChipsProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.classList.add("is-static");
      return;
    }

    let cleanup = () => {};
    let disposed = false;

    const build = async () => {
      const Matter = await import("matter-js");
      if (disposed || !stageRef.current) return;
      const { Engine, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

      const blocks = Array.from(
        stage.querySelectorAll<HTMLElement>(".falling-chips__chip")
      );
      let W = stage.clientWidth;
      let H = stage.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 1;

      const wall = { isStatic: true, render: { visible: false } };
      const walls = [
        Bodies.rectangle(W / 2, H + 40, W + 200, 80, wall),
        Bodies.rectangle(-40, H / 2, 80, H * 4, wall),
        Bodies.rectangle(W + 40, H / 2, 80, H * 4, wall),
      ];
      World.add(engine.world, walls);

      // Build the bodies but DON'T drop them yet — wait until in view.
      const bodies = blocks.map((el, i) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const x = w / 2 + 30 + Math.random() * Math.max(1, W - w - 60);
        const y = -40 - i * 55; // just above the top edge, lightly staggered
        const body = Bodies.rectangle(x, y, w, h, {
          restitution: 0.35,
          friction: 0.5,
          frictionAir: 0.02,
          chamfer: { radius: 6 },
          angle: (Math.random() - 0.5) * 0.4,
        });
        return { el, body, w, h };
      });

      // Drag only on hover/fine-pointer devices — on touch, Matter's own touch
      // listeners would swallow the swipe and make the section hard to scroll.
      const canDrag = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (canDrag) {
        const mouse = Mouse.create(stage);
        const m = mouse as unknown as {
          element: HTMLElement;
          mousewheel: EventListener;
        };
        m.element.removeEventListener("wheel", m.mousewheel);
        m.element.removeEventListener("DOMMouseScroll", m.mousewheel);
        World.add(
          engine.world,
          MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.2, render: { visible: false } },
          })
        );
      }

      const runner = Runner.create();
      Runner.run(runner, engine);

      let raf = 0;
      const draw = () => {
        for (const { el, body, w, h } of bodies) {
          el.style.transform = `translate(${body.position.x - w / 2}px, ${
            body.position.y - h / 2
          }px) rotate(${body.angle}rad)`;
        }
        raf = requestAnimationFrame(draw);
      };

      // Drop the chips one by one once the section scrolls into view.
      let started = false;
      const timers: number[] = [];
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !started) {
            started = true;
            draw();
            bodies.forEach(({ body, el }, i) => {
              timers.push(
                window.setTimeout(() => {
                  World.add(engine.world, body);
                  el.style.opacity = "1";
                }, i * stagger) // staggered — one falls, then the next
              );
            });
            io.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      io.observe(stage);

      const onResize = () => {
        W = stage.clientWidth;
        H = stage.clientHeight;
        Matter.Body.setPosition(walls[0], { x: W / 2, y: H + 40 });
        Matter.Body.setPosition(walls[2], { x: W + 40, y: H / 2 });
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        timers.forEach((t) => clearTimeout(t));
        io.disconnect();
        window.removeEventListener("resize", onResize);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    };

    // Defer loading matter.js until the section nears the viewport (it's below
    // the fold on most pages) — the chips still fall identically when reached.
    const loadIO = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadIO.disconnect();
          build();
        }
      },
      { rootMargin: "300px" }
    );
    loadIO.observe(stage);

    return () => {
      disposed = true;
      loadIO.disconnect();
      cleanup();
    };
  }, [stagger]);

  return (
    <div ref={stageRef} className="falling-chips" aria-hidden="true">
      {items.map((s) => (
        <div key={s} className="falling-chips__chip">
          {s}
        </div>
      ))}
    </div>
  );
}
