// Building section-by-section. Hero is live; the rest stay hidden until
// polished (components + content remain in src/components/sections/*).
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import ProductShowcase from "@/components/sections/ProductShowcase";
import Leaders from "@/components/sections/Leaders";
// import Services from "@/components/sections/Services";
// import Products from "@/components/sections/Products";
// import Industries from "@/components/sections/Industries";
// import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Experience />
      <ProductShowcase />
      <Leaders />
    </main>
  );
}
