"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import dynamic from 'next/dynamic';

const GargantuaScene = dynamic(() => import("../three/GargantuaScene"), { ssr: false });

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [displayText, setDisplayText] = useState("");
  const fullText = "INTERSTELLAR";
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentText = "";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText.charAt(i);
        setDisplayText(currentText);
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);

        const navLogo = document.getElementById("navbar-logo");
        if (navLogo && textRef.current) {
          const heroRect = textRef.current.getBoundingClientRect();

          gsap.set(textRef.current, {
            position: "fixed",
            top: heroRect.top,
            left: heroRect.left,
            margin: 0,
            transformOrigin: "top left"
          });

          const heroFixedRect = textRef.current.getBoundingClientRect();
          const navRect = navLogo.getBoundingClientRect();

          const navFontSize = parseFloat(window.getComputedStyle(navLogo).fontSize);
          const heroFontSize = parseFloat(window.getComputedStyle(textRef.current).fontSize);
          const scaleTarget = navFontSize / heroFontSize;

          const deltaX = navRect.left - heroFixedRect.left;
          const deltaY = (navRect.top + navRect.height / 2) - (heroFixedRect.top + (heroFixedRect.height * scaleTarget) / 2);

          gsap.to(textRef.current, {
            x: deltaX,
            y: deltaY,
            scale: scaleTarget,
            letterSpacing: "0.2em",
            opacity: 1,
            duration: 1.5,
            ease: "power2.inOut",
            delay: 0.5,
            onComplete: () => {
              gsap.set(navLogo, { opacity: 1 });
              if (textRef.current) textRef.current.style.opacity = "0";
            }
          });
        }
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <GargantuaScene />
      <div ref={containerRef} className="relative z-10 text-center flex flex-col items-center pointer-events-none px-4 justify-center w-full h-full">
        <div className="h-32 flex items-center justify-center">
          <h1 ref={textRef} className="font-display font-bold text-3xl sm:text-4xl md:text-8xl tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.4em] text-white">
            {displayText}
            <span className={`animate-pulse opacity-80 ${!isTyping ? 'hidden' : ''}`}>|</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
