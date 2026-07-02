"use client";

import { useEffect, useRef } from "react";
import "./servicesDrop.css";

const SERVICES = [
  "Trading",
  "Supply & Distribution",
  "Storage & Blending",
  "Shipping & Chartering",
  "Hedging & Risk Management",
  "Financial Solutions",
];

// A little colour variety, all from the brand palette.
const TONES = ["blue", "ink", "light", "blue", "ink", "light"];

/**
 * ServicesDrop — the six services as physics blocks that drop in, pile up, and
 * can be dragged (Matter.js). Reduced-motion / no-JS shows them stacked static.
 */
export default function ServicesDrop() {
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

    (async () => {
      const Matter = await import("matter-js");
      if (disposed || !stageRef.current) return;
      const { Engine, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

      const blocks = Array.from(
        stage.querySelectorAll<HTMLElement>(".svc-drop__block")
      );

      let W = stage.clientWidth;
      let H = stage.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 1;

      const wall = { isStatic: true, render: { visible: false } };
      const walls = [
        Bodies.rectangle(W / 2, H + 40, W + 200, 80, wall), // floor
        Bodies.rectangle(-40, H / 2, 80, H * 4, wall), // left
        Bodies.rectangle(W + 40, H / 2, 80, H * 4, wall), // right
      ];
      World.add(engine.world, walls);

      const bodies = blocks.map((el, i) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const x = w / 2 + 40 + Math.random() * Math.max(1, W - w - 80);
        const y = -120 - i * 90; // staggered above the stage → they rain in
        const body = Bodies.rectangle(x, y, w, h, {
          restitution: 0.35,
          friction: 0.5,
          frictionAir: 0.02,
          chamfer: { radius: 8 },
          angle: (Math.random() - 0.5) * 0.4,
        });
        World.add(engine.world, body);
        el.style.opacity = "1";
        return { el, body, w, h };
      });

      const mouse = Mouse.create(stage);
      // Don't hijack the page scroll wheel over the stage.
      const m = mouse as unknown as {
        element: HTMLElement;
        mousewheel: EventListener;
      };
      m.element.removeEventListener("wheel", m.mousewheel);
      m.element.removeEventListener("DOMMouseScroll", m.mousewheel);
      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      World.add(engine.world, mc);

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
      draw();

      const onResize = () => {
        W = stage.clientWidth;
        H = stage.clientHeight;
        Matter.Body.setPosition(walls[0], { x: W / 2, y: H + 40 });
        Matter.Body.setPosition(walls[2], { x: W + 40, y: H / 2 });
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <section className="svc-drop" aria-label="Our services">
      <div className="svc-drop__head">
        <span className="section-tag">Everything we do</span>
        <h2 className="svc-drop__title">Six services, one team</h2>
      </div>

      <div ref={stageRef} className="svc-drop__stage">
        {SERVICES.map((s, i) => (
          <div key={s} className={`svc-drop__block svc-drop__block--${TONES[i]}`}>
            {s}
          </div>
        ))}
      </div>
    </section>
  );
}
