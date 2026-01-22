import type { Estrutura3D } from "../../core/types";
import PecaMesh from "./PecaMesh";
import SceneHelpers from "./SceneHelpers";
import SceneLights from "./SceneLights";

interface SceneContentProps {
  estrutura3D: Estrutura3D | null;
}

export default function SceneContent({ estrutura3D }: SceneContentProps) {
  const hasStructure = Boolean(estrutura3D && estrutura3D.pecas.length > 0);
  const gridSize = hasStructure ? 20 : 10;
  const axesSize = 2;

  return (
    <>
      <SceneLights hasStructure={hasStructure} />
      <SceneHelpers gridSize={gridSize} axesSize={axesSize} />
      {hasStructure &&
        estrutura3D!.pecas.map((peca) => <PecaMesh key={peca.id} peca={peca} />)}
    </>
  );
}
