"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";
import BlackHole from "./BlackHole";
import StarField from "./StarField";
import { PerspectiveCamera } from "@react-three/drei";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

export default function GargantuaScene() {
  const quality = useDevicePerformance();
  const dpr: [number, number] =
    quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1] : [0.75, 1];

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={dpr}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={45} />
        <color attach="background" args={["#06060a"]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#f4a832" />
        {quality !== "low" && (
          <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#7eb8da" />
        )}
        <Suspense fallback={null}>
          <StarField />
          <group position={[0, 0, -5]}>
            <BlackHole />
          </group>
          <EffectComposer>
            {/* Bloom is always on — it's the core visual effect */}
            <Bloom
              intensity={quality === "low" ? 1.0 : 2.0}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur={quality === "high"}
            />
            {/* Vignette only on medium+ — saves a full-screen pass on mobile */}
            <Vignette
              eskil={false}
              offset={quality === "low" ? 0 : 0.1}
              darkness={quality === "low" ? 0 : 1.1}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
