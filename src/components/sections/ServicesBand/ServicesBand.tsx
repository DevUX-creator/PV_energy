import PhotoBand from "@/components/ui/PhotoBand";

/**
 * ServicesBand — full-bleed cinematic photo band for the services page.
 * Thin wrapper around the shared PhotoBand.
 */
export default function ServicesBand() {
  return (
    <PhotoBand
      image="/Services/services-band.webp"
      alt="A PV Link Energy tanker at sea at sunset"
      caption="Moving critical energy & agricultural commodities — safely and on schedule, across every major market."
      ariaLabel="Moving energy and commodities worldwide"
      focus="center 55%"
    />
  );
}
