"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BlackHole() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = document.createElement("video");
    // Use compressed/optimized video
    vid.src = "/videos/gargantua.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    // Don't preload — let the browser decide when to buffer
    vid.preload = "none";

    // Use IntersectionObserver to start playback only when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => { });
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe the hero section (where this video lives)
    const heroEl = document.querySelector("section");
    if (heroEl) observer.observe(heroEl);

    // Play eagerly on first interaction if not already playing
    const startOnInteraction = () => {
      if (vid.paused) vid.play().catch(() => { });
    };
    document.addEventListener("click", startOnInteraction, { once: true });
    document.addEventListener("scroll", startOnInteraction, { once: true, passive: true });

    setVideo(vid);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("scroll", startOnInteraction);
      vid.pause();
      vid.removeAttribute("src");
      vid.load();
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Use smoother, cheaper sin math (no additional trig calls on mobile)
      const t = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = Math.sin(t) * 0.05;
      meshRef.current.rotation.x = Math.cos(t) * 0.02;
    }
  });

  if (!video) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, -20]}>
      <planeGeometry args={[64, 36]} />
      <meshBasicMaterial
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      >
        <videoTexture attach="map" args={[video]} />
      </meshBasicMaterial>
    </mesh>
  );
}
