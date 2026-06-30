/** Breakpoint values — keep in sync with the media queries in component CSS. */
export const BREAKPOINTS = {
  laptop: 1440,
  tablet: 1024,
  mobile: 768,
  mobileS: 481,
} as const;

/** Ready-made max-width media query strings for matchMedia / JS use. */
export const MEDIA = {
  laptop: `(max-width: ${BREAKPOINTS.laptop}px)`,
  tablet: `(max-width: ${BREAKPOINTS.tablet}px)`,
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  mobileS: `(max-width: ${BREAKPOINTS.mobileS}px)`,
} as const;
