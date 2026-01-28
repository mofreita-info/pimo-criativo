import { useMemo } from "react";
import { useProject } from "../../../context/useProject";
import ThreeViewer from "../../ThreeViewer";

export default function Workspace() {
  const { project } = useProject();
  const materialId = useMemo(() => "mdf-branco", []);

  return (
    <main className="workspace-root">
      <div className="workspace-canvas">
        <div className="workspace-viewer">
          <ThreeViewer
            cubeCount={2}
            cubeSize={1}
            animationEnabled={false}
            backgroundColor="#0f172a"
            modelUrl={project.selectedCaixaModelUrl ?? ""}
            materialId={materialId}
          />
        </div>
      </div>
      <a
        href="/test-viewer"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 5,
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(148, 163, 184, 0.35)",
          color: "#e2e8f0",
          padding: "8px 12px",
          borderRadius: 8,
          fontSize: 12,
          textDecoration: "none",
        }}
      >
        Abrir test-viewer
      </a>
    </main>
  );
}
