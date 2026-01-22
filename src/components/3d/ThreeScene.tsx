import { Canvas } from "@react-three/fiber";
import type { Estrutura3D } from "../../core/types";
import SceneCamera from "./SceneCamera";
import SceneContent from "./SceneContent";
import SceneControls from "./SceneControls";

interface ThreeSceneProps {
  estrutura3D: Estrutura3D | null;
}

// Componente principal
export default function ThreeScene({ estrutura3D }: ThreeSceneProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <SceneCamera />
        <SceneControls />
        <SceneContent estrutura3D={estrutura3D} />
      </Canvas>
    </div>
  );
}
