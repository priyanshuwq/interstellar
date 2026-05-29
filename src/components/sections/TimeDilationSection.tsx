"use client";

import { useState, useEffect } from "react";

export default function TimeDilationSection() {
  const [earthYears, setEarthYears] = useState(0);
  const [millerHours, setMillerHours] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setMillerHours(prev => {
        const next = prev + 0.1;
        setEarthYears(next * 7);
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <section id="time" className="min-h-screen py-24 px-6 relative z-10 bg-gradient-to-b from-transparent to-ice/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="flex items-center gap-4 mb-12">
          <span className="w-1.5 h-1.5 bg-ice rounded-full shadow-[0_0_10px_#7eb8da]"></span>
          <h2 className="font-mono text-sm tracking-[0.2em] text-ice">RELATIVITY</h2>
        </div>

        <h3 className="font-serif italic text-2xl sm:text-3xl md:text-5xl max-w-4xl text-foreground mb-16 md:mb-24 px-2">
          &quot;We used to look up at the sky and wonder... now we just look down and worry.&quot;
        </h3>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 items-center cursor-crosshair select-none"
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
          onTouchStart={() => setIsActive(true)}
          onTouchEnd={() => setIsActive(false)}
        >
          <div className="flex flex-col items-center">
            <span className="font-mono text-muted text-xs sm:text-sm tracking-widest mb-4">EARTH TIME PASSED</span>
            <div className="font-display text-5xl sm:text-6xl md:text-8xl text-amber mb-2">
              {earthYears.toFixed(1)} <span className="text-2xl sm:text-3xl text-amber/50">YRS</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-mono text-muted text-xs sm:text-sm tracking-widest mb-4">MILLER&apos;S PLANET TIME</span>
            <div className="font-display text-5xl sm:text-6xl md:text-8xl text-ice mb-2">
              {millerHours.toFixed(1)} <span className="text-2xl sm:text-3xl text-ice/50">HRS</span>
            </div>
          </div>
        </div>

        <p className="font-mono text-muted text-xs tracking-widest mt-12 md:mt-16 animate-pulse">
          <span className="hidden md:inline">[ HOVER TO EXPERIENCE TIME DILATION ]</span>
          <span className="md:hidden">[ TAP & HOLD TO EXPERIENCE TIME DILATION ]</span>
        </p>
      </div>
    </section>
  );
}
