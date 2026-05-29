"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EnduranceModel({ isVisible }: { isVisible?: boolean }) {
  const { scene } = useGLTF("/models/interstellar__endurance_high_fidelity.glb");
  const groupRef = useRef<THREE.Group>(null);
  const cursor = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 2;
        }
      }
    });

    const ctx = gsap.context(() => {
      if (groupRef.current) {
        gsap.fromTo(groupRef.current.position,
          { x: -5, y: 5, z: -10 },
          { x: 0, y: 0, z: 0, scrollTrigger: { trigger: "#mission", start: "top bottom", end: "center center", scrub: 2.5 } }
        );
        gsap.fromTo(groupRef.current.scale,
          { x: 0.005, y: 0.005, z: 0.005 },
          { x: 0.045, y: 0.045, z: 0.045, scrollTrigger: { trigger: "#mission", start: "top bottom", end: "center center", scrub: 2.5 } }
        );
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      cursor.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y -= delta * 0.3;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, cursor.current.y * 0.5, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, cursor.current.x * -0.5, 0.1);
  });

  return (
    <group ref={groupRef} scale={0.005} position={[-5, 5, -10]}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
      <directionalLight position={[-10, 0, -5]} intensity={2} color="#f4a832" />
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/interstellar__endurance_high_fidelity.glb");
