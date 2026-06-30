import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

let registered = false;

/**
 * Register every GSAP plugin the site uses, exactly once per session.
 * Safe to call from any component's effect — subsequent calls no-op.
 * Centralising this means new sections never have to remember which
 * plugins to register.
 */
export function registerGsapPlugins(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
  registered = true;
}

export { gsap, ScrollTrigger, CustomEase, SplitText };
