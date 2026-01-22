import { PerspectiveCamera } from "@react-three/drei";

export default function SceneCamera() {
  return (
    <PerspectiveCamera
      makeDefault
      position={[5, 5, 5]}
      fov={50}
      near={0.1}
      far={1000}
    />
  );
}
