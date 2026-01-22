import { OrbitControls } from "@react-three/drei";

export default function SceneControls() {
  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={20}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 1.5}
    />
  );
}
