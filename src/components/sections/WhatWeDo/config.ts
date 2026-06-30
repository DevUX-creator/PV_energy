/**
 * Services shown in the "What We Do" pinned-scroll showcase. Copy is
 * original, derived from the live-site service list. Assets live in
 * public/WhatWeDo: video items loop on hover (mp4 + webm + poster),
 * image-only items use an optimized webp.
 */
export type ShowcaseService = {
  id: string;
  name: string;
  copy: string;
  image: string;
  /** Optional clip — loops on hover; its first frame (poster) is the still.
   *  H.264 MP4 only (hardware-decoded; VP9/WebM loops jank on many setups). */
  video?: string;
  poster?: string;
};

export const SHOWCASE_SERVICES: ShowcaseService[] = [
  {
    id: "trading",
    name: "Trading",
    copy: "We buy, sell, and move energy and agro commodities across global markets — turning supply and demand into reliable, well-priced flows.",
    image: "/WhatWeDo/trading-poster.jpg",
    video: "/WhatWeDo/trading.mp4",
    poster: "/WhatWeDo/trading-poster.jpg",
  },
  {
    id: "supply-distribution",
    name: "Supply & Distribution",
    copy: "From source to destination, we keep product moving — coordinating volumes, terminals, and transport so deliveries arrive on-spec and on time.",
    image: "/WhatWeDo/supply-poster.jpg",
    video: "/WhatWeDo/supply.mp4",
    poster: "/WhatWeDo/supply-poster.jpg",
  },
  {
    id: "storage-blending",
    name: "Storage & Blending",
    copy: "Strategic storage and precision blending let us hold, condition, and tailor products to the exact grades our partners need.",
    image: "/WhatWeDo/storage.webp",
  },
  {
    id: "shipping-chartering",
    name: "Shipping & Chartering",
    copy: "We charter and manage vessels across key routes, handling logistics end-to-end so cargo moves safely and efficiently by sea.",
    image: "/WhatWeDo/shipping.webp",
  },
  {
    id: "hedging-risk",
    name: "Hedging & Risk Management",
    copy: "We manage price and market exposure with disciplined hedging, protecting every trade against volatility.",
    image: "/WhatWeDo/hedging-poster.jpg",
    video: "/WhatWeDo/hedging.mp4",
    poster: "/WhatWeDo/hedging-poster.jpg",
  },
  {
    id: "financial-solutions",
    name: "Financial Solutions",
    copy: "Trade finance and structured solutions that keep deals liquid, bankable, and moving — backed by strong financial expertise.",
    image: "/WhatWeDo/finance.webp",
  },
];
