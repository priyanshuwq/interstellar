import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import MissionSection from "@/components/sections/MissionSection";
import GargantuaSection from "@/components/sections/GargantuaSection";
import TimeDilationSection from "@/components/sections/TimeDilationSection";
import CrewSection from "@/components/sections/CrewSection";
import Footer from "@/components/layout/Footer";

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
