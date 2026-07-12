"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";

export type IntroStage = { left: ReactNode; right: ReactNode };

/**
 * Scroll-driven intro centrepiece.
 *
 * On entering the section the video shows its first frame (paused). As the user
 * scrolls the section PINS and the video is SCRUBBED — its playback is tied to
 * scroll position, so it plays slowly forward. In sync, the current stage's left
 * copy and right note slide away to the sides while the next stage's text rises
 * from behind the video. When the video reaches its end the pin releases and the
 * page scrolls on to the next section.
 *
 * Desktop only + gated on prefers-reduced-motion; on small screens the first
 * stage simply renders statically and the rest are hidden.
 *
 * ProductDetail is a server component, so this client leaf receives the
 * server-rendered stage nodes as props.
 */
export default function ProductIntroScrub({
  video,
  poster,
  stages,
}: {
  video: string;
  poster?: string;
  stages: IntroStage[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nStages = stages.length;

  useEffect(() => {
    const root = rootRef.current;
    const vid = videoRef.current;
    if (!root || !vid) return;

    registerGsapPlugins();
    vid.pause();

    // Mobile browsers frequently ignore preload and, worse, drop the
    // <video poster> the moment currentTime is set by the scrub — leaving a
    // blank frame on a cold reload / direct URL entry. A static poster <img>
    // (sibling below) stays visible until the video has actually painted a
    // frame; only then do we reveal the video. On client navigation the video
    // is usually already warm, so this just fades in instantly.
    const reveal = () => vid.classList.add("is-ready");
    if (vid.readyState >= 2) reveal();
    else {
      vid.addEventListener("loadeddata", reveal, { once: true });
      vid.addEventListener("seeked", reveal, { once: true });
      vid.addEventListener("canplay", reveal, { once: true });
      // Nudge mobile Safari/Chrome to buffer frame data now.
      vid.load();
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
        () => {
          const lefts = gsap.utils.toArray<HTMLElement>(".pds-stage--left", root);
          const rights = gsap.utils.toArray<HTMLElement>(
            ".pds-stage--right",
            root
          );

          const build = () => {
            const dur = Number.isFinite(vid.duration) && vid.duration > 0
              ? vid.duration
              : 5;

            // Initial state: stage 0 in place; the rest wait "behind" the video
            // (pulled toward centre, scaled down, blurred, transparent).
            gsap.set(lefts, {
              xPercent: 52,
              scale: 0.86,
              autoAlpha: 0,
              filter: "blur(12px)",
            });
            gsap.set(rights, {
              xPercent: -52,
              scale: 0.86,
              autoAlpha: 0,
              filter: "blur(12px)",
            });
            gsap.set([lefts[0], rights[0]], {
              xPercent: 0,
              scale: 1,
              autoAlpha: 1,
              filter: "blur(0px)",
            });

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "+=" + nStages * 100 + "%",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            // Video scrub across the whole pinned timeline (0 → duration).
            const vstate = { t: 0 };
            tl.to(
              vstate,
              {
                t: dur,
                duration: nStages,
                onUpdate: () => {
                  // Guard against seeking past a not-yet-buffered end.
                  const target = Math.min(vstate.t, (vid.duration || dur) - 0.05);
                  if (target >= 0) vid.currentTime = target;
                },
              },
              0
            );

            // Stage swaps: at each boundary the current stage slides out and the
            // next rises from behind the video.
            for (let i = 1; i < nStages; i++) {
              const at = i - 0.28;
              tl.to(lefts[i - 1], { xPercent: -78, autoAlpha: 0, filter: "blur(12px)", duration: 0.55, ease: "power1.in" }, at)
                .to(rights[i - 1], { xPercent: 78, autoAlpha: 0, filter: "blur(12px)", duration: 0.55, ease: "power1.in" }, at)
                .fromTo(
                  lefts[i],
                  { xPercent: 52, scale: 0.86, autoAlpha: 0, filter: "blur(12px)" },
                  { xPercent: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" },
                  at + 0.14
                )
                .fromTo(
                  rights[i],
                  { xPercent: -52, scale: 0.86, autoAlpha: 0, filter: "blur(12px)" },
                  { xPercent: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" },
                  at + 0.14
                );
            }
          };

          if (vid.readyState >= 1 && Number.isFinite(vid.duration)) build();
          else vid.addEventListener("loadedmetadata", build, { once: true });

          return () => vid.removeEventListener("loadedmetadata", build);
        }
      );

      // Tablet / mobile: no pin/scrub. Stages stack in normal flow and each
      // one reveals once as it scrolls into view — independent of content.
      mm.add(
        "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Stacked layout: scrub the video to scroll (no pin), so it plays as
          // the section passes through the viewport. Content-independent.
          const center = root.querySelector<HTMLElement>(
            ".prod-detail__intro-center"
          );
          const build = () => {
            const dur =
              Number.isFinite(vid.duration) && vid.duration > 0
                ? vid.duration
                : 5;
            const vstate = { t: 0 };
            gsap.to(vstate, {
              t: dur,
              ease: "none",
              onUpdate: () => {
                const target = Math.min(vstate.t, (vid.duration || dur) - 0.05);
                if (target >= 0) vid.currentTime = target;
              },
              scrollTrigger: {
                trigger: center ?? root,
                start: "top 80%",
                end: "bottom 20%",
                scrub: true,
              },
            });
          };
          if (vid.readyState >= 1 && Number.isFinite(vid.duration)) build();
          else vid.addEventListener("loadedmetadata", build, { once: true });

          // Each stacked stage reveals once as it scrolls in.
          const stages = gsap.utils.toArray<HTMLElement>(".pds-stage", root);
          stages.forEach((el) => {
            gsap.from(el, {
              autoAlpha: 0,
              y: 28,
              filter: "blur(10px)",
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          });

          return () => vid.removeEventListener("loadedmetadata", build);
        }
      );
    }, root);

    return () => {
      vid.removeEventListener("loadeddata", reveal);
      vid.removeEventListener("seeked", reveal);
      vid.removeEventListener("canplay", reveal);
      ctx.revert();
    };
  }, [nStages]);

  return (
    <div ref={rootRef} className="prod-detail__intro-scrub">
      <div className="prod-detail__intro-dots" aria-hidden="true" />

      <div className="prod-detail__intro-grid">
        <div className="prod-detail__intro-left">
          {stages.map((s, i) => (
            <div className="pds-stage pds-stage--left" key={i}>
              {s.left}
            </div>
          ))}
        </div>

        <div className="prod-detail__intro-center">
          <figure className="prod-detail__shape">
            {poster ? (
              // Always-visible first-frame preview. Guarantees a poster on
              // mobile cold reloads, where the browser drops the <video poster>
              // as soon as the scrub sets currentTime. The video fades in over
              // this identical frame once it can actually paint (see effect).
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="prod-detail__poster"
                src={poster}
                alt=""
                aria-hidden="true"
              />
            ) : null}
            <video ref={videoRef} muted playsInline preload="auto" poster={poster}>
              <source src={video} type="video/mp4" />
            </video>
          </figure>
        </div>

        <div className="prod-detail__intro-right">
          {stages.map((s, i) => (
            <div className="pds-stage pds-stage--right" key={i}>
              {s.right}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
