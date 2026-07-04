import PhotoBand from "@/components/ui/PhotoBand";

/**
 * ProductsBand — full-bleed cinematic photo band for the products page.
 * Thin wrapper around the shared PhotoBand.
 */
export default function ProductsBand() {
  return (
    <PhotoBand
      image="/Products/products-band.webp"
      alt="Petroleum storage tanks at a terminal in the evening light"
      caption="From refinery and plant to port and field — stored, blended and delivered on-spec, wherever industry needs it."
      ariaLabel="Storing, blending and delivering commodities on-spec"
      focus="center 45%"
    />
  );
}
