"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/music/Interstellar Main Theme - Hans Zimmer (1).mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setIsPlaying(false);
        const startAudio = () => {
          if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
          ['click', 'scroll', 'pointerdown', 'keydown'].forEach(e =>
            document.removeEventListener(e, startAudio)
          );
        };
        ['click', 'scroll', 'pointerdown', 'keydown'].forEach(e =>
          document.addEventListener(e, startAudio, { once: true })
        );
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const MusicButton = () => (
    <button
      onClick={toggleMute}
      className="p-2 border border-white/20 rounded-full hover:border-amber hover:text-amber transition-all flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer"
      title={isPlaying ? "Mute Music" : "Play Music"}
    >
      {isPlaying ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      )}
    </button>
  );

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 md:py-8 flex justify-between items-center bg-transparent pointer-events-none">
      <Link href="#" scroll={false} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} id="navbar-logo" className="font-display font-bold text-lg md:text-xl tracking-[0.2em] text-foreground drop-shadow-md opacity-0 pointer-events-auto cursor-pointer">
        INTERSTELLAR
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8 font-mono text-sm tracking-widest text-muted pointer-events-auto">
        <Link href="#mission" className="hover:text-amber transition-colors">MISSION</Link>
        <Link href="#gargantua" className="hover:text-amber transition-colors">GARGANTUA</Link>
        <Link href="#time" className="hover:text-amber transition-colors">TIME</Link>
        <Link href="#crew" className="hover:text-amber transition-colors">CREW</Link>
        <MusicButton />
      </div>

      {/* Mobile controls */}
      <div className="flex md:hidden items-center gap-3 pointer-events-auto">
        <MusicButton />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 border border-white/20 rounded-full bg-black/30 backdrop-blur-sm cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-void/95 backdrop-blur-lg flex flex-col items-center justify-center gap-10 pointer-events-auto md:hidden z-40">
          {["mission", "gargantua", "time", "crew"].map((id) => (
            <Link
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-lg tracking-[0.3em] text-muted hover:text-amber transition-colors uppercase"
            >
              {id}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
