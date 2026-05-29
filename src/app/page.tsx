import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";

// Dynamically import below-fold sections — splits JS bundle, defers hydration
const MissionSection = dynamic(
  () => import("@/components/sections/MissionSection"),
  { loading: () => null }
);
const GargantuaSection = dynamic(
  () => import("@/components/sections/GargantuaSection"),
  { loading: () => null }
);
const TimeDilationSection = dynamic(
  () => import("@/components/sections/TimeDilationSection"),
  { loading: () => null }
);
const CrewSection = dynamic(
  () => import("@/components/sections/CrewSection"),
  { loading: () => null }
);
const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => null,
});

export default function Home() {
  return (
    <main className="w-full flex flex-col bg-void selection:bg-amber/30 selection:text-amber-100">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <GargantuaSection />
      <TimeDilationSection />
      <CrewSection />
      <Footer />
    </main>
  );
}
