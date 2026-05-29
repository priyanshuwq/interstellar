"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Prefer the compressed model; fall back to original
const OPTIMIZED_MODEL = "/models/endurance_optimized.glb";

export default function EnduranceModel({ isVisible }: { isVisible?: boolean }) {
  const { scene } = useGLTF(OPTIMIZED_MODEL);
  const groupRef = useRef<THREE.Group>(null);
  const quality = useDevicePerformance();
  const cursor = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Throttled pointer update — only update cursor if it has moved meaningfully
  const lastPointer = useRef({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    // Skip tiny movements to reduce CPU work
    if (Math.abs(nx - lastPointer.current.x) > 0.01 || Math.abs(ny - lastPointer.current.y) > 0.01) {
      cursor.current.x = nx;
      cursor.current.y = ny;
      lastPointer.current = { x: nx, y: ny };
    }
  }, []);

  useEffect(() => {
    // Apply material optimisations
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          // Reduced envMapIntensity: 2 → 1 (half the shader work)
          (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = quality === "high" ? 1.5 : 1;
        }
      }
    });

    const ctx = gsap.context(() => {
      if (groupRef.current) {
        gsap.fromTo(
          groupRef.current.position,
          { x: -5, y: 5, z: -10 },
          {
            x: 0, y: 0, z: 0,
            scrollTrigger: {
              trigger: "#mission",
              start: "top bottom",
              end: "center center",
              scrub: 2.5,
            },
          }
        );
        gsap.fromTo(
          groupRef.current.scale,
          { x: 0.005, y: 0.005, z: 0.005 },
          {
            x: 0.045, y: 0.045, z: 0.045,
            scrollTrigger: {
              trigger: "#mission",
              start: "top bottom",
              end: "center center",
              scrub: 2.5,
            },
          }
        );
      }
    });

    // Only add mouse tracking on non-touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice && quality !== "low") {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scene, quality, handleMouseMove, viewport]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y -= delta * 0.3;
    if (quality !== "low") {
      // Lerp mouse-look only on mid/high quality to save CPU on mobile
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        cursor.current.y * 0.5,
        0.1
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        cursor.current.x * -0.5,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} scale={0.005} position={[-5, 5, -10]}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
      {quality !== "low" && (
        <directionalLight position={[-10, 0, -5]} intensity={2} color="#f4a832" />
      )}
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(OPTIMIZED_MODEL);
