import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import ShowcaseSection from "./components/ShowcaseSection";
import ProcessSection from "./components/ProcessSection";
import PreviewSection from "./components/PreviewSection";
import TemplatesSection from "./components/TemplatesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navigation />
      <main>
        <HeroSection />
        <ShowcaseSection />
        <ProcessSection />
        <PreviewSection />
        <TemplatesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
