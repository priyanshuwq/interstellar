"use client";

import InteractiveBlackHole from "../three/InteractiveBlackHole";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GargantuaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  // Mount the heavy WebGL canvas only when section enters viewport
  const [canvasVisible, setCanvasVisible] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textLeftRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top center" },
        }
      );
      gsap.fromTo(
        textRightRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top center" },
        }
      );
    });

    // Use IntersectionObserver to mount/unmount the black hole canvas
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setCanvasVisible(entry.isIntersecting);
        });
      },
      {
        // Start loading the canvas a bit before it's visible
        rootMargin: "200px 0px 200px 0px",
        threshold: 0,
      }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  const dataPoints = [
    { label: "MASS", value: "100 MILLION SOLAR MASSES" },
    { label: "ROTATION", value: "99.8% SPEED OF LIGHT" },
    { label: "EVENT HORIZON", value: "300 MILLION KM" },
    { label: "TEMPERATURE", value: "DEGREES KELVIN - INF" },
  ];

  return (
    <section
      id="gargantua"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Mount heavy canvas only when section is near/in view */}
      {canvasVisible && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <InteractiveBlackHole />
        </div>
      )}

      <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center px-8 md:px-16 pointer-events-none py-24 md:py-0">
        <div
          ref={textLeftRef}
          className="max-w-md pointer-events-auto flex flex-col items-start text-left mt-12 md:mt-0"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-2 h-2 bg-amber rounded-full animate-pulse shadow-[0_0_8px_#f4a832]"></span>
            <h2 className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/70 drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">
              THE SINGULARITY
            </h2>
          </div>
          <h3 className="font-display text-4xl md:text-7xl mb-6 text-white tracking-widest drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
            GARGANTUA
          </h3>
          <p className="font-sans text-white/90 text-sm md:text-base leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,1)] font-medium">
            A supermassive black hole spinning at 99.8% the speed of light. Its
            gravitational pull is so immense that it bends space, time, and
            light itself into a massive accretion disk.
          </p>
        </div>

        <div
          ref={textRightRef}
          className="w-full md:max-w-xs pointer-events-auto flex flex-row md:flex-col justify-between md:justify-center flex-wrap md:flex-nowrap gap-6 md:gap-12 mt-16 md:mt-0"
        >
          {dataPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start md:items-end text-left md:text-right gap-1 border-l-2 md:border-l-0 md:border-r-2 border-white/30 pl-4 md:pl-0 md:pr-4 py-1 flex-1 min-w-[40%]"
            >
              <span className="font-mono text-white/70 text-[10px] md:text-xs tracking-widest uppercase drop-shadow-[0_2px_5px_rgba(0,0,0,1)] font-bold">
                {point.label}
              </span>
              <span className="font-mono text-amber text-sm md:text-base drop-shadow-[0_2px_5px_rgba(0,0,0,1)] font-semibold">
                {point.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
