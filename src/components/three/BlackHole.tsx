"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BlackHole() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = document.createElement("video");
    vid.src = "/videos/gargantua.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.play().catch(() => {});
    setVideo(vid);

    return () => {
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  if (!video) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, -20]}>
      <planeGeometry args={[64, 36]} />
      <meshBasicMaterial side={THREE.DoubleSide} blending={THREE.AdditiveBlending} transparent depthWrite={false}>
        <videoTexture attach="map" args={[video]} />
      </meshBasicMaterial>
    </mesh>
  );
}
