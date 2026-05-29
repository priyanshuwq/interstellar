"use client";

import { useRef, Suspense } from "react";
import { useInView } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import EnduranceModel from "../three/EnduranceModel";

export default function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-20% 0px -20% 0px" });

  const objectives = [
    { id: "01", title: "Find a new home", desc: "Earth's atmosphere is failing. We must locate a habitable world across the galaxy." },
    { id: "02", title: "Solve the equation", desc: "Professor Brand's gravity equation requires quantum data from inside a singularity." },
    { id: "03", title: "Save humanity", desc: "Plan A: Evacuate Earth. Plan B: Population bomb on a new world." }
  ];

  return (
    <section ref={sectionRef} id="mission" className="min-h-screen py-24 px-6 md:px-20 max-w-7xl mx-auto flex flex-col justify-center relative z-10">

      <div className="absolute right-0 top-0 w-full md:w-1/2 h-full z-0 pointer-events-none opacity-30 md:opacity-100 flex items-center justify-center">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 40 }}>
          <Suspense fallback={null}>
            <EnduranceModel isVisible={isInView} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 w-full md:w-2/3">
        <div className="flex items-center gap-4 mb-12">
          <span className="w-1.5 h-1.5 bg-amber rounded-full"></span>
          <h2 className="font-mono text-sm tracking-[0.2em] text-muted">THE MISSION</h2>
        </div>

        <h3 className="font-display text-3xl md:text-5xl font-medium tracking-wide mb-16 text-foreground max-w-3xl drop-shadow-lg">
          Mankind was born on Earth. It was never meant to <span className="font-serif italic text-amber">die</span> here.
        </h3>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj) => (
            <div key={obj.id} className="p-6 md:p-8 border-t border-l border-white/10 bg-black/40 hover:bg-black/60 transition-all duration-500 group relative overflow-hidden backdrop-blur-md hover:border-amber/40">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
              <div className="absolute -bottom-6 -right-2 font-display text-8xl md:text-9xl text-white/[0.02] group-hover:text-amber/[0.05] transition-colors duration-500 pointer-events-none select-none tracking-tighter">
                {obj.id}
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="font-mono text-xs text-amber/80 tracking-[0.2em]">{obj.id}</span>
                <div className="h-[1px] w-8 bg-white/20 group-hover:w-16 group-hover:bg-amber/50 transition-all duration-500"></div>
              </div>
              <h4 className="font-display text-2xl mb-4 text-white group-hover:text-amber/90 drop-shadow-md transition-colors duration-300 tracking-wider relative z-10 uppercase">{obj.title}</h4>
              <p className="font-mono text-muted leading-relaxed text-xs md:text-sm relative z-10 group-hover:text-white/80 transition-colors duration-300">
                {obj.desc}
              </p>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 group-hover:border-amber/50 transition-colors duration-500 m-2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
