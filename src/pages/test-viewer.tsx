import { useState } from "react";
import ThreeViewer from "../components/ThreeViewer";

export default function TestViewer() {
  const [materialId, setMaterialId] = useState("mdf-clarus");

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          gap: 8,
          zIndex: 5,
        }}
      >
        <button
          onClick={() => setMaterialId("mdf-clarus")}
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(148, 163, 184, 0.35)",
            color: "#e2e8f0",
            padding: "6px 10px",
            borderRadius: 8,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Carvalho
        </button>
        <button
          onClick={() => setMaterialId("mdf-branco")}
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(148, 163, 184, 0.35)",
            color: "#e2e8f0",
            padding: "6px 10px",
            borderRadius: 8,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Branco
        </button>
      </div>
      <div style={{ width: "100%", height: "100vh" }}>
        <ThreeViewer
          cubeCount={2}
          cubeSize={1}
          animationEnabled={true}
          backgroundColor="#0f172a"
          materialId={materialId}
        />
      </div>
    </div>
  );
}
