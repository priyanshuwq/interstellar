"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

export default function StarField() {
  const starsRef = useRef<THREE.Points>(null);
  const quality = useDevicePerformance();

  // Adaptive star counts — mobile gets far fewer draw calls
  const primaryCount = quality === "high" ? 5000 : quality === "medium" ? 2500 : 1200;
  const secondaryCount = quality === "high" ? 1000 : quality === "medium" ? 400 : 0;

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group>
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={primaryCount}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      {secondaryCount > 0 && (
        <Stars
          radius={150}
          depth={50}
          count={secondaryCount}
          factor={6}
          saturation={1}
          fade
          speed={0.5}
        />
      )}
    </group>
  );
}
