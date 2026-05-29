export default function CrewSection() {
  const crew = [
    { name: "COOPER", role: "PILOT", status: "ACTIVE", quote: "We're explorers, pioneers, not caretakers.", image: "/crew/cooper.png" },
    { name: "BRAND", role: "SCIENTIST", status: "ACTIVE", quote: "Love is the one thing that transcends time and space.", image: "/crew/brand.png" },
    { name: "ROMILLY", role: "PHYSICIST", status: "DECEASED", quote: "This is a black hole... It's a literal sphere of black.", image: "/crew/romilly.png" },
    { name: "DOYLE", role: "GEOGRAPHER", status: "DECEASED", quote: "We can't just think about our families now.", image: "/crew/doyle.png" },
    { name: "TARS", role: "TACTICAL ROBOT", status: "ACTIVE", quote: "Honesty setting: 90 percent.", image: "/crew/tars.png" },
  ];

  return (
    <section id="crew" className="py-16 md:py-24 px-4 sm:px-6 md:px-20 max-w-7xl mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-10 md:mb-16">
        <span className="w-1.5 h-1.5 bg-amber rounded-full"></span>
        <h2 className="font-mono text-sm tracking-[0.2em] text-muted">ENDURANCE CREW</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {crew.map((member, i) => (
          <div key={i} className="group relative h-[280px] sm:h-[320px] p-6 sm:p-8 border border-white/10 bg-surface/30 backdrop-blur-sm hover:border-amber/50 active:border-amber/50 transition-all duration-300 overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 w-full h-full opacity-40 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-luminosity group-hover:mix-blend-normal group-active:mix-blend-normal">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-bottom drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h4 className="font-display text-xl sm:text-2xl text-foreground mb-1 drop-shadow-md">{member.name}</h4>
                <p className="font-mono text-[10px] sm:text-xs text-muted tracking-widest drop-shadow-md bg-black/20 inline-block px-1 rounded">{member.role}</p>
              </div>
              <span className={`font-mono text-[9px] sm:text-[10px] tracking-widest px-2 py-1 border bg-black/40 backdrop-blur-md whitespace-nowrap ${member.status === 'ACTIVE' ? 'border-amber/50 text-amber' : 'border-ice/50 text-ice'}`}>
                {member.status}
              </span>
            </div>

            <div className="relative z-10 flex items-end mt-auto">
              <p className="font-serif italic text-xs sm:text-sm text-foreground/90 opacity-100 sm:opacity-0 transform sm:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0 transition-all duration-500 delay-100 drop-shadow-md bg-black/60 p-3 sm:p-4 rounded-lg backdrop-blur-md border border-white/10">
                &quot;{member.quote}&quot;
              </p>
            </div>

            <div className="absolute inset-0 bg-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
