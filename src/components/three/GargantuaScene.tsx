"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";
import BlackHole from "./BlackHole";
import StarField from "./StarField";
import { PerspectiveCamera } from "@react-three/drei";

export default function GargantuaScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={45} />
        <color attach="background" args={["#06060a"]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#f4a832" />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#7eb8da" />
        <Suspense fallback={null}>
          <StarField />
          <group position={[0, 0, -5]}>
            <BlackHole />
          </group>
          <EffectComposer>
            <Bloom intensity={2.0} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <Noise opacity={0.04} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
