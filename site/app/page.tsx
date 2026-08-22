import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ReadersStrip } from "@/components/landing/readers-strip";
import { Features } from "@/components/landing/features";
import { Interlude } from "@/components/landing/interlude";
import { LibraryScroll } from "@/components/landing/library-scroll";
import { Gallery } from "@/components/landing/gallery";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background">
      <Nav />
      <main className="relative">
        <Hero />
        <Marquee />
        <HowItWorks />
        <ReadersStrip />
        <Features />
        <Interlude />
        <LibraryScroll />
        <Gallery />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
