import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SceneLightsProps {
  hasStructure: boolean;
}

export default function SceneLights({ hasStructure }: SceneLightsProps) {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (lightRef.current) {
      const time = Date.now() * 0.0005;
      lightRef.current.position.x = Math.cos(time) * 5;
      lightRef.current.position.z = Math.sin(time) * 5;
    }
  });

  if (!hasStructure) {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight ref={lightRef} position={[5, 5, 5]} intensity={1} />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={1}
        castShadow
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.3} />
    </>
  );
}
